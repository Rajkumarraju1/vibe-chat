import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ContactUs() {
    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans flex items-center justify-center">
            <div className="max-w-md w-full bg-neutral-900 rounded-3xl p-8 border border-white/10 space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4">
                    <ArrowLeft size={20} /> Back
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Contact Us</h1>
                    <p className="text-neutral-400">We'd love to hear from you. Reach out for support or inquiries.</p>
                </div>

                <div className="bg-neutral-800/50 p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-3 bg-purple-600/20 text-purple-400 rounded-full">
                        <Mail size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500 font-medium">Email us at</p>
                        <a href="mailto:vibemelive@gmail.com" className="text-lg font-bold text-white hover:underline">
                            vibemelive@gmail.com
                        </a>
                    </div>
                </div>

                <div className="text-center text-xs text-neutral-600">
                    Response time: 24-48 hours.
                </div>
            </div>
        </div>
    );
}
