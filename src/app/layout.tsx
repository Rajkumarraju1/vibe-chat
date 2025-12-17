import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vibeme.live'),
  title: {
    default: 'VibeMe - Premium Random Video Chat',
    template: '%s | VibeMe',
  },
  description: 'Connect with strangers instantly on VibeMe. High-quality video chat, secure, and fun. Meet new people from around the world today.',
  keywords: ['video chat', 'random chat', 'talk to strangers', 'omegle alternative', 'video dating', 'make friends', 'live chat'],
  authors: [{ name: 'VibeMe Team' }],
  creator: 'VibeMe',
  publisher: 'VibeMe',
  openGraph: {
    title: 'VibeMe - Premium Random Video Chat',
    description: 'Experience crystal clear random video chat. Connect instantly with people worldwide.',
    url: 'https://vibeme.live',
    siteName: 'VibeMe',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeMe - Talk to Strangers Instantly',
    description: 'Join thousands of users on the most premium random video chat platform.',
    creator: '@vibeme_live',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico', // Ensure you have a favicon
    apple: '/apple-touch-icon.png', // Optional
  },
  alternates: {
    canonical: 'https://vibeme.live',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white h-full">
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'VibeMe',
              url: 'https://vibeme.live',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://vibeme.live/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {children}
      </body>
    </html>
  );
}
