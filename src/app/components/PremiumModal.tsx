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
}

export default function PremiumModal({ isOpen, onClose, socketId }: PremiumModalProps) {
    const [loading, setLoading] = useState(false);
    const [isVerifyMode, setIsVerifyMode] = useState(false);

    const handlePayment = () => {
        // Open Cosmofeed/Topmate Link
        window.open("https://superprofile.bio/httpswwwvibemelive", "_blank");
        setIsVerifyMode(true);
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            // Socket ID is needed. 
            // Since we don't have it in props yet (legacy issue), we try to get it from window or just alert.
            // But wait, the previous code had: const socketId = (window as any).socketId;
            // We should stick to that hack for this file unless we pass it properly.

            const effectiveSocketId = socketId || (window as any).socketId;

            if (!effectiveSocketId) {
                alert("Connection not found. Please refresh and try again.");
                setLoading(false);
                return;
            }

            const res = await fetch(`${SOCKET_URL}/verify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ socketId: effectiveSocketId }),
            });

            const data = await res.json();
            if (data.status === "success") {
                alert("Upgrade Successful! You are now Vibe+ Premium.");
                onClose();
            } else {
                // In a real app we would check a webhook status here
                alert("Verification failed. Please try again or contact support.");
            }
        } catch (error) {
            console.error("Verification failed", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Shiny Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-[1px]">
                    <div className="absolute inset-0 bg-neutral-900 rounded-3xl m-[1px]" />
                </div>

                <div className="relative p-8 text-center space-y-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Unlock Vibe+
                        </h2>
                        <p className="text-neutral-400">
                            Filter who you match with. Stop wasting time.
                        </p>
                    </div>

                    <div className="space-y-3 text-left bg-neutral-800/50 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-green-500/20 text-green-400 rounded-full"><Check size={14} /></div>
                            <span>Filter by <strong>Gender</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-green-500/20 text-green-400 rounded-full"><Check size={14} /></div>
                            <span>Filter by <strong>Country</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-green-500/20 text-green-400 rounded-full"><Check size={14} /></div>
                            <span><strong>HD Video</strong> Priority</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-green-500/20 text-green-400 rounded-full"><Check size={14} /></div>
                            <span><strong>Ad-free</strong> Experience</span>
                        </div>
                    </div>

                    {!isVerifyMode ? (
                        <button
                            onClick={handlePayment}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-[1.02] transition-all"
                        >
                            Get Vibe+ for ₹99
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-yellow-400">
                                Please change 'quantity' to 1 if needed and complete payment.
                            </p>
                            <button
                                onClick={handleVerify}
                                disabled={loading}
                                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "I have paid, Enable Premium"}
                            </button>
                            <button
                                onClick={() => setIsVerifyMode(false)}
                                className="text-sm text-neutral-400 hover:text-white underline"
                            >
                                Back
                            </button>
                        </div>
                    )}

                    <p className="text-xs text-neutral-500">
                        Secure processing. Cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
}
