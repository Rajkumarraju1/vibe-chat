"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Users, Video, ShieldCheck, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  const router = useRouter();
  const [gender, setGender] = useState<string | null>(null);

  const handleStart = () => {
    if (!gender) return;
    router.push(`/video?gender=${gender}`);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 overflow-hidden relative selection:bg-purple-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl w-full text-center space-y-12 z-10">

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-4 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Live Now &bull; 1,203 Online
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50 rounded-full animate-pulse"></div>
              <Image src="/logo.png" alt="Vibe Logo" width={96} height={96} className="relative z-10" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
              Vibe
            </span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Experience random video chat reimagined. Instant connections, crystal clear video, and a modern interface designed for you.
          </p>
        </div>

        {/* Action Card */}
        <div className="group relative bg-neutral-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl hover:border-purple-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative space-y-6">
            <div className="flex justify-center gap-8 text-neutral-400">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white/5 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform"><Video size={24} /></div>
                <span className="text-xs">HD Video</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white/5 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform delay-75"><Users size={24} /></div>
                <span className="text-xs">P2P Chat</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white/5 rounded-2xl text-green-400 group-hover:scale-110 transition-transform delay-150"><ShieldCheck size={24} /></div>
                <span className="text-xs">Secure</span>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>

            <div className="space-y-4">
              <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">
                Clicking start confirms you are 18+ and agree to our terms.
              </p>

              {/* Gender Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setGender("male")}
                  className={clsx(
                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 relative",
                    gender === "male"
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600"
                  )}
                >
                  <span className="text-2xl">👨</span>
                  <span className="font-medium">Male</span>
                  {gender === "male" && <CheckCircle2 size={16} className="text-blue-500 absolute top-2 right-2" />}
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={clsx(
                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 relative",
                    gender === "female"
                      ? "border-pink-500 bg-pink-500/10 text-white"
                      : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600"
                  )}
                >
                  <span className="text-2xl">👩</span>
                  <span className="font-medium">Female</span>
                  {gender === "female" && <CheckCircle2 size={16} className="text-pink-500 absolute top-2 right-2" />}
                </button>
              </div>

              <button
                onClick={handleStart}
                disabled={!gender}
                className="block w-full py-4 bg-white text-black font-bold text-xl rounded-full hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Chat
              </button>
            </div>

            {/* Footer Links (AdSense Requirement) */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center text-xs text-neutral-500">
              <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-neutral-300 transition-colors">Contact Us</Link>
              <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
              <Link href="/cancellation-refund" className="hover:text-neutral-300 transition-colors">Cancellation & Refund</Link>
              <Link href="/shipping" className="hover:text-neutral-300 transition-colors">Shipping Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
