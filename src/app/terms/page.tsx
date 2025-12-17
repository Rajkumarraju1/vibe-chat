
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Terms and Conditions</h1>

                <div className="space-y-4 text-neutral-300 leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">1. Acceptance of Terms</h2>
                    <p>By accessing and using Vibe, you accept and agree to be bound by the terms and provision of this agreement.</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">2. User Conduct</h2>
                    <p>You agree to use Vibe only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, libelous, defamatory, obscene, or profane material.</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">3. Intellectual Property</h2>
                    <p>The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and trademarks.</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">4. Disclaimer</h2>
                    <p>The service is provided "as is" and "as available" without any warranties of any kind.</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">5. Contact Information</h2>
                    <p>For any questions regarding these Terms, please contact us at vibemelive@gmail.com.</p>
                </div>
            </div>
        </div>
    );
}
