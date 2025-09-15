
"use client";

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// This metadata is not used in a client component, but we'll keep it for now.
// For full metadata support, this would need to be in a server component layout.
// export const metadata: Metadata = {
//   title: 'KalaConnect',
//   description: 'Empowering Indian Artisans in the Digital Marketplace',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith('/dashboard');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>KalaConnect</title>
        <meta name="description" content="Empowering Indian Artisans in the Digital Marketplace" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex flex-col min-h-screen">
          {!isDashboardPage && <SiteHeader />}
          <main className="flex-grow">{children}</main>
          <SiteFooter />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
