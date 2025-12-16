"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

interface AdOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdOverlay({ isOpen, onClose }: AdOverlayProps) {
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        if (isOpen) {
            setTimeLeft(5);
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="max-w-lg w-full bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">

                {/* Header / Timer */}
                <div className="flex justify-between items-center p-4 border-b border-white/5 bg-neutral-950">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Advertisement</span>
                    <div className="text-sm font-medium text-white">
                        {timeLeft > 0 ? (
                            <span className="text-neutral-400">Reward in {timeLeft}s</span>
                        ) : (
                            <button
                                onClick={onClose}
                                className="flex items-center gap-1 text-white hover:text-purple-400 transition-colors"
                            >
                                <X size={16} /> Close
                            </button>
                        )}
                    </div>
                </div>

                {/* Ad Content Placeholder */}
                <div className="aspect-video bg-neutral-800 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 group-hover:opacity-100 transition-opacity" />
                    <div className="text-center space-y-2 z-10">
                        <ExternalLink size={48} className="mx-auto text-neutral-600 group-hover:text-white transition-colors" />
                        <h3 className="text-xl font-bold text-neutral-300 group-hover:text-white">Amazing Product</h3>
                        <p className="text-sm text-neutral-500">Click to learn more</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-neutral-950 text-center">
                    <button className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors">
                        Visit Site
                    </button>
                </div>
            </div>
        </div>
    );
}
