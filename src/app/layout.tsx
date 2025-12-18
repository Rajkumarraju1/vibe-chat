import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vibeme.live'),
  title: {
    default: 'VibeMe - Free Random Video Chat App',
    template: '%s | VibeMe',
  },
  description: 'Join VibeMe for the best Free Video Chat experience. Connect with strangers instantly, completely free. High-quality, secure, and fun random video chat.',
  keywords: ['free video chat', 'random chat', 'talk to strangers', 'omegle', 'ometv', 'omegle alternative', 'ometv alternative', 'chatroulette', 'free chat app', 'make friends', 'live chat', 'online video chat'],
  authors: [{ name: 'VibeMe Team' }],
  creator: 'VibeMe',
  publisher: 'VibeMe',
  openGraph: {
    title: 'VibeMe - Free Random Video Chat App',
    description: 'Experience crystal clear free random video chat. The best alternative for meeting new people worldwide.',
    url: 'https://vibeme.live',
    siteName: 'VibeMe',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeMe - Free Random Video Chat',
    description: 'Join thousands of users on the best free random video chat platform.',
    creator: '@vibeme_live',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
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
              name: 'VibeMe - Free Random Video Chat',
              url: 'https://vibeme.live',
              description: 'The best free alternative to Omegle and OmeTV for random video chat.',
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
