import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Privacy Policy</h1>

                <div className="space-y-4 text-neutral-300 leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">1. Introduction</h2>
                    <p>Welcome to Vibe ("we", "our", or "us"). We are committed to protecting your privacy and ensuring a safe experience.</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">2. Data Collection</h2>
                    <p>We collect minimal data to operate the service:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Voluntary Info:</strong> Messages and video streams are transmitted directly between users (P2P). We do not store chat contents.</li>
                        <li><strong>Usage Data:</strong> IP addresses and browser details for security and moderation.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white mt-8">3. Cookies & Advertising</h2>
                    <p>We use third-party vendors, including Google, which use cookies to serve ads based on user's prior visits to our website or other websites.</p>
                    <p>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</p>
                    <p>Users may opt out of personalized advertising by visiting Ads Settings.</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">4. Contact Us</h2>
                    <p>If you have questions about this policy, please contact us at support@vibeapp.com.</p>
                </div>
            </div>
        </div>
    );
}
