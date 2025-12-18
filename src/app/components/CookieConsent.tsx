"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("vibe_cookie_consent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("vibe_cookie_consent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-neutral-900/95 backdrop-blur-md border-t border-white/10 z-50 p-4 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-neutral-300 text-center md:text-left">
                    <p>
                        We use cookies to enhance your experience and serve personalized ads.
                        By using our service, you agree to our <Link href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-purple-400 hover:underline">Terms of Service</Link>.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={acceptCookies}
                        className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors text-sm"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 text-neutral-400 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
