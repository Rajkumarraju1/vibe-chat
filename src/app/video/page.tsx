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
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                {/* Video Stage */}
                <div className="md:flex-1 h-[40dvh] md:h-auto relative bg-neutral-900 flex items-center justify-center p-4">
                    {/* Partner Video (Main) */}
                    <div className="relative w-full h-full max-h-full rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                        {searching ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                                <div className="w-16 h-16 border-4 border-neutral-700 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                                <p>Looking for someone...</p>
                            </div>
                        ) : (
                            <video
                                ref={partnerVideo}
                                playsInline
                                autoPlay
                                className="w-full h-full object-contain"
                            />
                        )}
                        {!partnerStream && !searching && (
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-500">Stranger has no video</div>
                        )}

                        {/* Controls Overlay */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10 shadow-lg opacity-100 md:opacity-0 md:hover:opacity-100 transition-all duration-300">
                            <button onClick={toggleMic} className={clsx("p-3 rounded-full transition-colors", micOn ? "bg-white/10 hover:bg-white/20" : "bg-red-500/80 text-white")}>
                                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                            </button>
                            <button onClick={toggleCam} className={clsx("p-3 rounded-full transition-colors", camOn ? "bg-white/10 hover:bg-white/20" : "bg-red-500/80 text-white")}>
                                {camOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
                            </button>

                            {/* Filter Buttons (Trigger Premium) */}
                            <div className="hidden md:block h-8 w-px bg-white/10 mx-1"></div>
                            <button onClick={() => setShowPremiumModal(true)} className="hidden md:block p-3 rounded-full bg-white/10 hover:bg-purple-500/20 text-white hover:text-purple-400 transition-colors group relative">
                                <Users size={20} className={targetGender === 'female' ? "text-pink-500" : ""} />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {targetGender === 'female' ? "Filter Active" : "Filter Female"}
                                </span>
                            </button>
                            <button onClick={() => setShowPremiumModal(true)} className="hidden md:block p-3 rounded-full bg-white/10 hover:bg-blue-500/20 text-white hover:text-blue-400 transition-colors group relative">
                                <Globe size={20} />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Country</span>
                            </button>
                            <div className="hidden md:block h-8 w-px bg-white/10 mx-1"></div>

                            <button onClick={handleSkip} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold transition-colors flex items-center gap-2">
                                <SkipForward size={18} fill="currentColor" />
                                Next
                            </button>
                        </div>
                    </div>

                    {/* My Video */}
                    <div className="absolute top-4 right-4 w-24 md:top-8 md:right-8 md:w-48 aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 border-white/10 hover:border-purple-500 transition-colors group">
                        <video ref={myVideo} playsInline autoPlay muted className={clsx("w-full h-full object-cover mirror-mode transition-opacity", !camOn && "opacity-0")} />
                        {!camOn && <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-xs text-neutral-400">Camera Off</div>}
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] text-white/70">You</div>
                    </div>
                </div>
}

                export default function VideoChat() {
    return (
                <Suspense fallback={<div className="h-screen bg-black text-white flex items-center justify-center">Loading Vibe...</div>}>
                    <VideoChatContent />
                </Suspense>
                );
}
