import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

// Prevent static prerendering — the app uses client-side Firebase Auth
// which requires real env vars at runtime, not build time.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AgriVision | One Intelligent System for Your Entire Farm',
  description: 'Enterprise AI AgriTech SaaS Platform combining crop vision pathology, livestock monitoring, interactive digital twin, weather intelligence, and farm advisory.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full bg-[var(--bg-app)] text-[var(--text-main)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
