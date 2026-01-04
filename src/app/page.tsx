"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Users, Video, ShieldCheck, CheckCircle2, Globe, Zap, Heart, MessageCircle, Lock } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  const router = useRouter();
  const [gender, setGender] = useState<string | null>(null);

  const handleStart = () => {
    if (!gender) return;
    router.push(`/video?gender=${gender}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
      </div>

      <main className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto p-4 md:p-8 space-y-24">

        {/* --- HERO SECTION --- */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 w-full min-h-[80vh] pt-12">

          {/* Hero Text */}
          <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-green-400 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                1,203 Users Online Now
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Connect with <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                  Strangers
                </span>{" "}
                Instantly
              </h1>

              <p className="text-xl text-neutral-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                VibeMe is the next-generation random video chat platform.
                Experience crystal-clear video calls, instant matching, and a safe community.
                No registration required.
              </p>
            </div>
          </div>

          {/* Action Card (Functionality) */}
          <div className="flex-1 w-full max-w-md">
            <div className="group relative bg-neutral-900/60 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl hover:border-purple-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-white">Start Chatting</h3>
                  <p className="text-sm text-neutral-500">Select your gender to begin</p>
                </div>

                {/* Gender Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGender("male")}
                    className={clsx(
                      "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 relative group/btn",
                      gender === "male"
                        ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        : "border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-600 hover:bg-neutral-800"
                    )}
                  >
                    <span className="text-4xl group-hover/btn:scale-110 transition-transform duration-300">👨</span>
                    <span className="font-medium">Male</span>
                    {gender === "male" && <CheckCircle2 size={18} className="text-blue-500 absolute top-3 right-3" />}
                  </button>
                  <button
                    onClick={() => setGender("female")}
                    className={clsx(
                      "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 relative group/btn",
                      gender === "female"
                        ? "border-pink-500 bg-pink-500/10 text-white shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                        : "border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-600 hover:bg-neutral-800"
                    )}
                  >
                    <span className="text-4xl group-hover/btn:scale-110 transition-transform duration-300">👩</span>
                    <span className="font-medium">Female</span>
                    {gender === "female" && <CheckCircle2 size={18} className="text-pink-500 absolute top-3 right-3" />}
                  </button>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleStart}
                    disabled={!gender}
                    className="block w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform active:scale-95"
                  >
                    Start Video Chat
                  </button>
                  <p className="text-xs text-neutral-500 text-center px-4">
                    By clicking Start, you confirm you are 18+ and agree to our <Link href="/terms" className="underline hover:text-white">Terms</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- FEATURES SECTION (Content for AdSense) --- */}
        <section className="w-full grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Video size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white">HD Video Quality</h3>
            <p className="text-neutral-400 leading-relaxed">
              Enjoy high-definition video calls with low latency. Our P2P technology ensures a smooth connection, making your random chat experience feel like you're in the same room.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white">Global Community</h3>
            <p className="text-neutral-400 leading-relaxed">
              Connect with strangers from over 150 countries. VibeMe is the perfect place to learn new languages, explore different cultures, and make international friends instantly.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-neutral-900/30 border border-white/5 hover:bg-neutral-900/50 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white">Safe & Secure</h3>
            <p className="text-neutral-400 leading-relaxed">
              Your safety is our priority. We employ advanced AI moderation and community reporting tools to maintain a respectful environment. Chat anonymously without sharing personal data.
            </p>
          </div>
        </section>

        {/* --- DETAILED INFO SECTION --- */}
        <section className="w-full space-y-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
              Why Choose VibeMe?
            </h2>
            <div className="text-neutral-300 space-y-6 text-lg leading-relaxed">
              <p>
                In a digital world where connection is key, VibeMe stands out as the premier destination for spontaneous and meaningful interactions. Unlike traditional social media where you interact with people you already know, VibeMe opens the door to the unexpected. It's the modern equivalent of striking up a conversation at a coffee shop or a party, but with the entire world as your venue.
              </p>
              <p>
                We have built VibeMe with a user-first philosophy. We understand the frustration of laggy connections, cluttered interfaces, and paywalls. That's why we've streamlined the experience to be as simple as one click. No lengthy sign-up forms, no credit cards required for basic features—just pure, authentic human connection.
              </p>
              <p>
                Whether you're feeling lonely, bored, or just curious, VibeMe provides a platform to express yourself. Our community is diverse, welcoming people from all walks of life. Musicians use it to perform for new audiences, students use it to practice foreign languages, and travelers use it to get local tips before visiting a new country. The possibilities are endless.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto pt-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400 mt-1">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Find Your Match</h4>
                  <p className="text-neutral-400">Our smart matching algorithm pairs you with users based on your preferences, ensuring better conversations and fewer skips.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400 mt-1">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Lightning Fast</h4>
                  <p className="text-neutral-400">Optimized for mobile and desktop, our lightweight platform loads instantly and works smoothly even on slower networks.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 mt-1">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Text & Video</h4>
                  <p className="text-neutral-400">Not ready for face-to-face? Use our integrated text chat to break the ice before turning on your camera.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/10 text-white mt-1">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Privacy First</h4>
                  <p className="text-neutral-400">We don't sell your data. Your chats are private, and P2P technology means your video stream goes directly to your partner.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION for SEO --- */}
        <section className="w-full max-w-3xl mx-auto pt-16 border-t border-white/10">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Is VibeMe really free?</h3>
              <p className="text-neutral-400">Yes, VibeMe is completely free to use. You can video chat with random strangers for as long as you like without paying a dime. We offer optional premium features for users who want advanced filtering capabilities.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Do I need to register an account?</h3>
              <p className="text-neutral-400">No! We believe in instant access. You can start chatting immediately as a guest. This ensures your anonymity and makes the process hassle-free.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Is it safe for teenagers?</h3>
              <p className="text-neutral-400">VibeMe is strictly for users aged 18 and older. We have strict community guidelines against inappropriate behavior. We advise all users to be cautious and responsible while interacting with strangers online.</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">How do I report a user?</h3>
              <p className="text-neutral-400">If you encounter someone violating our rules, please simply end the chat and report them using the report button during the call. Our moderation system reviews reports to ban offenders.</p>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full border-t border-white/10 bg-neutral-950 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-purple-500 blur-lg opacity-50 rounded-full"></div>
              <Image src="/logo.png" alt="Vibe Logo" width={32} height={32} className="relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight">VibeMe</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-400">
            <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-purple-400 transition-colors">Contact Us</Link>
            <Link href="/cancellation-refund" className="hover:text-purple-400 transition-colors">Refunds</Link>
          </div>

          <div className="text-xs text-neutral-600">
            © {new Date().getFullYear()} VibeMe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
