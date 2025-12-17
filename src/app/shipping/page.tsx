
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Shipping Policy</h1>

                <div className="space-y-4 text-neutral-300 leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">1. Digital Service</h2>
                    <p>Vibe is a digital platform. We do not sell or ship physical goods. As such, there are no shipping fees or delivery times associated with our services.</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">2. Delivery of Digital Content</h2>
                    <p>Access to premium features or virtual items is immediate upon successful payment.</p>

                    <h2 className="text-2xl font-semibold text-white mt-8">3. Contact Us</h2>
                    <p>If you have questions, please contact us at vibemelive@gmail.com.</p>
                </div>
            </div>
        </div>
    );
}
