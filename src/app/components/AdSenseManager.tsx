"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function AdSenseManager() {
  const pathname = usePathname();

  // Do not show ads on the video page (no content violation)
  if (pathname?.startsWith("/video")) {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9682711224616634"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
