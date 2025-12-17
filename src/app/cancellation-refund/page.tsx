
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CancellationRefund() {
    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Cancellations and Refunds</h1>

                <div className="space-y-4 text-neutral-300 leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">1. Cancellation Policy</h2>
                    <p>You may cancel your account at any time by contacting our support team or using the deletion option in your profile settings. Cancellation is effective immediately.</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">2. Refund Policy</h2>
                    <p>Since Vibe provides digital services, all sales are generally final. However, if you believe you have been charged in error, please contact us immediately.</p>
                    <p>Refund requests must be made within 7 days of the transaction.</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">3. Contact Us</h2>
                    <p>If you have any questions about our Returns and Refunds Policy, please contact us: support@vibeapp.com</p>
                </div>
            </div>
        </div>
    );
}
