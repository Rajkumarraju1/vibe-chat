"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import SimplePeer from "simple-peer";
import Image from "next/image";
import { Send, Mic, MicOff, Video as VideoIcon, VideoOff, SkipForward, Power, Globe, Users } from "lucide-react";
import clsx from "clsx";
import PremiumModal from "../components/PremiumModal";
import AdBanner from "../components/AdBanner";
import AdOverlay from "../components/AdOverlay";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

import { Suspense } from "react";

function VideoChatContent() {
    const searchParams = useSearchParams();
    const myGender = searchParams.get("gender") || "unknown";

    // State
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [partnerStream, setPartnerStream] = useState<MediaStream | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [searching, setSearching] = useState(true);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    // Filters & Premium
    // Filters & Premium
    const [targetGender, setTargetGender] = useState<string>("any");
    const [premiumExpiry, setPremiumExpiry] = useState<number | null>(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    // Ads State
    const [skips, setSkips] = useState(0);
    const [showAdOverlay, setShowAdOverlay] = useState(false);

    // Refs
    const myVideo = useRef<HTMLVideoElement>(null);
    const partnerVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<SimplePeer.Instance | null>(null);

    // Initial Setup
    useEffect(() => {
        let socketInstance: Socket;

        // 1. Get User Media
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) myVideo.current.srcObject = currentStream;

                // 2. Connect to Socket
                socketInstance = io(SOCKET_URL);
                setSocket(socketInstance);

                // 3. Initiate Search
                socketInstance.emit("join_pool", { gender: myGender, targetGender });

                socketInstance.on("matched", ({ partnerId, initiator }) => {
                    setSearching(false);
                    startCall(initiator, socketInstance, currentStream, partnerId);
                });

                socketInstance.on("signal", (data) => {
                    if (connectionRef.current) {
                        connectionRef.current.signal(data.signal);
                    }
                });

                socketInstance.on("partner_left", () => {
                    setPartnerStream(null);
                    setChat([]);
                    setSearching(true);
                    // Re-search with current prefs
                    socketInstance.emit("join_pool", { gender: myGender, targetGender: "any" }); // Default safe re-join, we rely on handleSkip mostly
                });

            })
            .catch((err) => console.error("Error accessing media:", err));

        return () => {
            if (socketInstance) socketInstance.disconnect();
            if (stream) stream.getTracks().forEach(track => track.stop());
        }
    }, []);

    // WebRTC Logic
    const startCall = (initiator: boolean, socket: Socket, stream: MediaStream, partnerId: string) => {
        const peer = new SimplePeer({
            initiator: initiator,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", (data) => {
            socket.emit("signal", { target: partnerId, signal: data });
        });

        peer.on("stream", (remoteStream) => {
            setPartnerStream(remoteStream);
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = remoteStream;
            }
        });

        peer.on("data", (data) => {
            const text = data.toString();
            setChat(prev => [...prev, { sender: "Stranger", text }]);
        });

        connectionRef.current = peer;
    };

    // Actions
    const sendMessage = () => {
        if (!message.trim() || !connectionRef.current) return;

        const msg = message.trim();
        setChat(prev => [...prev, { sender: "You", text: msg }]);
        connectionRef.current.send(msg);
        setMessage("");
    };

    const handleSkip = () => {
        if (connectionRef.current) {
            connectionRef.current.destroy();
            connectionRef.current = null;
        }
        setPartnerStream(null);
        setChat([]);
        setSearching(true);

        const newSkips = skips + 1;
        setSkips(newSkips);

        if (newSkips % 10 === 0) {
            setShowAdOverlay(true);
        }

        // Check Expiry Logic
        let currentTarget = targetGender;

        if (premiumExpiry && Date.now() > premiumExpiry) {
            // Expired!
            setPremiumExpiry(null);
            setTargetGender("any");
            currentTarget = "any";
            alert("Premium time ended. Returning to random matches.");
        }

        if (socket) {
            socket.emit("join_pool", { gender: myGender, targetGender: currentTarget });
        }
    };

    // ... (rest kept same, see below for render changes)

    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !micOn;
            setMicOn(!micOn);
        }
    }

    const toggleCam = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !camOn;
            setCamOn(!camOn);
        }
    }

    const handlePremiumUnlock = (expiry: number) => {
        setTargetGender("female");
        setPremiumExpiry(expiry);
        setShowPremiumModal(false);

        setTimeout(() => {
            handleSkip();
        }, 500);
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
            {/* Top Bar */}
            <div className="h-14 bg-neutral-900/50 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-6 z-20">
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Vibe" width={32} height={32} />
                    <h1 className="font-bold text-lg tracking-tight">Vibe</h1>
                </div>
            </div>

            {/* Status Bar */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30">
                <div className="text-sm font-medium px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2">
                    {premiumExpiry && premiumExpiry > Date.now() && (
                        <span className="text-pink-500 text-xs font-bold border-r border-white/10 pr-2 mr-2">
                            FEMALE FILTER ACTIVE
                        </span>
                    )}
                    {searching ? (
                        <span className="text-yellow-400 animate-pulse">Searching...</span>
                    ) : (
                        <span className="text-green-400">Connected</span>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative md:flex md:flex-row min-h-0 overflow-hidden">
                {/* Video Stage */}
                <div className="absolute inset-0 z-0 md:relative md:flex-1 md:inset-auto bg-neutral-900 flex items-center justify-center overflow-hidden">
                    {/* Partner Video (Main) */}
                    <div className="relative w-full h-full md:max-h-full md:rounded-2xl md:overflow-hidden md:bg-black md:shadow-2xl md:ring-1 md:ring-white/10 md:m-4">
                        {searching ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 bg-black/50 backdrop-blur-sm z-10">
                                <div className="w-16 h-16 border-4 border-neutral-700 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-white/80 font-medium">Finding a partner...</p>
                            </div>
                        ) : (
                            <video
                                ref={partnerVideo}
                                playsInline
                                autoPlay
                                className="w-full h-full object-cover md:object-contain"
                            />
                        )}
                        {!partnerStream && !searching && (
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-500 bg-black">Stranger has no video</div>
                        )}

                        {/* Controls Overlay - Floating at bottom for Mobile, Hover for Desktop */}
                        <div className="absolute bottom-20 left-0 right-0 z-50 flex justify-center pb-2 md:bottom-6 md:pb-0 pointer-events-auto">
                            <div className="flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                                <button onClick={toggleMic} className={clsx("p-3 rounded-full transition-colors", micOn ? "bg-white/10 hover:bg-white/20" : "bg-red-500 text-white")}>
                                    {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                                </button>
                                <button onClick={toggleCam} className={clsx("p-3 rounded-full transition-colors", camOn ? "bg-white/10 hover:bg-white/20" : "bg-red-500 text-white")}>
                                    {camOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
                                </button>

                                {/* Filter Buttons (Trigger Premium) */}
                                <div className="h-8 w-px bg-white/10 mx-1"></div>
                                <button onClick={() => setShowPremiumModal(true)} className="hidden md:block p-3 rounded-full bg-white/10 hover:bg-purple-500/20 text-white hover:text-purple-400 transition-colors">
                                    <Users size={20} className={targetGender === 'female' ? "text-pink-500" : ""} />
                                </button>
                                <button onClick={() => setShowPremiumModal(true)} className="hidden md:block p-3 rounded-full bg-white/10 hover:bg-blue-500/20 text-white hover:text-blue-400 transition-colors">
                                    <Globe size={20} />
                                </button>
                                <div className="hidden md:block h-8 w-px bg-white/10 mx-1"></div>

                                <button onClick={handleSkip} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold transition-transform active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                                    <SkipForward size={18} fill="currentColor" />
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* My Video - Floating Top Right */}
                    <div className="absolute top-20 right-4 w-28 aspect-[3/4] z-20 md:top-8 md:right-8 md:w-48 md:aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 border-white/10 group cursor-pointer hover:border-purple-500 transition-all">
                        <video ref={myVideo} playsInline autoPlay muted className={clsx("w-full h-full object-cover mirror-mode transition-opacity", !camOn && "opacity-0")} />
                        {!camOn && <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-xs text-neutral-400">Camera Off</div>}
                    </div>
                </div>

                {/* Chat Sidebar / Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-[45%] z-10 pointer-events-none md:pointer-events-auto md:static md:h-auto md:w-96 md:bg-neutral-950 md:border-l md:border-white/5 md:flex md:flex-col md:shadow-2xl">
                    <div className="w-full h-full flex flex-col bg-gradient-to-t from-black via-black/80 to-transparent md:bg-none pointer-events-auto">
                        <div className="hidden md:block p-4 border-b border-white/5 bg-neutral-900/50">
                            <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Chat</h2>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 [&::-webkit-scrollbar]:hidden flex flex-col justify-end md:justify-start">
                            <div className="text-center text-xs text-white/50 my-4 md:text-neutral-600">
                                You are chatting with a random stranger. Say Hi!
                            </div>
                            {chat.map((msg, i) => (
                                <div key={i} className={clsx("flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2", msg.sender === "You" ? "ml-auto items-end" : "mr-auto items-start")}>
                                    <div className={clsx("px-4 py-2 rounded-2xl text-sm backdrop-blur-md shadow-sm",
                                        msg.sender === "You"
                                            ? "bg-purple-600 text-white rounded-br-none"
                                            : "bg-white/10 text-white border border-white/10 rounded-bl-none md:bg-neutral-800 md:text-neutral-200"
                                    )}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-white/50 mt-1 px-1">{msg.sender}</span>
                                </div>
                            ))}
                        </div>

                        {/* Banner Ad (Desktop Only mainly, or hidden if interfering) */}
                        <div className="hidden md:block bg-neutral-900 border-t border-white/5">
                            <AdBanner />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-black/80 backdrop-blur-xl border-t border-white/10 md:p-4 md:bg-black/20 md:border-white/5 pb-6 md:pb-4">
                            <div className="flex gap-2 relative">
                                <input
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                    disabled={searching}
                                    className="w-full bg-white/10 text-white border border-white/10 rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 placeholder:text-white/40 transition-all disabled:opacity-50"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={searching || !message.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-colors disabled:opacity-0 disabled:scale-75 transform duration-200"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                socketId={socket?.id}
                onRewardComplete={handlePremiumUnlock}
            />
            <AdOverlay
                isOpen={showAdOverlay}
                onClose={() => setShowAdOverlay(false)}
            />
        </div>
    );
}

export default function VideoChat() {
    return (
        <Suspense fallback={<div className="h-screen bg-black text-white flex items-center justify-center">Loading Vibe...</div>}>
            <VideoChatContent />
        </Suspense>
    );
}
