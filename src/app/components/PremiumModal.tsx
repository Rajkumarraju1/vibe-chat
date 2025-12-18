"use client";

import { X, Check } from "lucide-react";
import { useState } from "react";
import { io } from "socket.io-client";

// Razorpay types removed


const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
    socketId?: string;
    onRewardComplete?: (expiry: number) => void;
}

export default function PremiumModal({ isOpen, onClose, socketId, onRewardComplete }: PremiumModalProps) {
    const [loading, setLoading] = useState(false);
    const [adState, setAdState] = useState<'idle' | 'playing' | 'completed'>('idle');
    const [timeLeft, setTimeLeft] = useState(30);

    const startAd = () => {
        setAdState('playing');
        setTimeLeft(30);

        // Timer Logic
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAdComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleAdComplete = async () => {
        setLoading(true);
        try {
            const effectiveSocketId = socketId || (window as any).socketId;
            if (!effectiveSocketId) {
                alert("Connection lost. Please refresh.");
                setLoading(false);
                return;
            }

            const res = await fetch(`${SOCKET_URL}/verify-ad-reward`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ socketId: effectiveSocketId }),
            });

            const data = await res.json();
            if (data.status === "success") {
                setAdState('completed');
                setTimeout(() => {
                    if (onRewardComplete) onRewardComplete(data.expiry);
                    onClose();
                    setAdState('idle');
                }, 500);
            } else {
                alert("Something went wrong. Try again.");
                setAdState('idle');
            }
        } catch (error) {
            console.error("Ad Reward failed", error);
            setAdState('idle');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
                // No close on click outside while playing ad
                onClick={adState === 'playing' ? undefined : onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/10">

                {adState === 'playing' ? (
                    <div className="relative aspect-video bg-black flex flex-col items-center justify-center space-y-4 p-8">
                        {/* Mock Video Player UI */}
                        <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-xs font-mono text-white/70 border border-white/10">
                            Ad · {timeLeft}s
                        </div>

                        <div className="w-16 h-16 rounded-full border-4 border-t-pink-500 border-r-purple-500 border-b-blue-500 border-l-transparent animate-spin" />

                        <p className="text-white font-medium animate-pulse">
                            Watching Ad...
                        </p>
                        <p className="text-xs text-neutral-500 text-center uppercase tracking-widest">
                            Do not close this window
                        </p>
                    </div>
                ) : (
                    <div className="relative p-8 text-center space-y-6">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                Unlock Filters Free
                            </h2>
                            <p className="text-neutral-400 text-sm">
                                Watch a short video to unlock Gender & Country filters.
                            </p>
                        </div>

                        <div className="space-y-3 text-left bg-neutral-800/50 p-6 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-1 bg-green-500/20 text-green-400 rounded-full"><Check size={14} /></div>
                                <span>Filter by <strong>Female</strong></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-1 bg-green-500/20 text-green-400 rounded-full"><Check size={14} /></div>
                                <span>Filter by <strong>Country</strong></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-1 bg-yellow-500/20 text-yellow-400 rounded-full"><Check size={14} /></div>
                                <span><strong>2 Minutes</strong> Access</span>
                            </div>
                        </div>

                        <button
                            onClick={startAd}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <span>Watch Ad (30s)</span>
                            <span className="bg-white/20 text-xs px-2 py-0.5 rounded">FREE</span>
                        </button>

                        <p className="text-xs text-neutral-500">
                            Support us by watching a short message.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
