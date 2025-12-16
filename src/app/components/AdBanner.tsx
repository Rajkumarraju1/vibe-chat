"use client";

import { useEffect, useRef } from "react";

export default function AdBanner() {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            // In production, this pushes the ad to Google's queue
            // (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            // (window as any).adsbygoogle.push({});
        } catch (e) {
            console.error("AdSense error", e);
        }
    }, []);

    return (
        <div className="w-full bg-neutral-900 border-t border-white/5 p-4 flex flex-col items-center justify-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-neutral-600">Sponsored</span>

            {/* AdSense Container */}
            <div className="w-full h-[60px] bg-neutral-800 rounded-lg flex items-center justify-center overflow-hidden relative">
                {/* Placeholder for Dev */}
                <div className="absolute inset-0 flex items-center justify-center text-neutral-500 text-xs font-medium bg-stripes opacity-50">
                    Google AdBanner Space
                </div>

                {/* Actual Ad Code (Commented out until live) */}
                {/* 
                <ins className="adsbygoogle"
                     style={{ display: "block" }}
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with real ID
                     data-ad-slot="1234567890"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins> 
                */}
            </div>
        </div>
    );
}

// Add CSS for stripes in global css or just use simple generic bg
