import './globals.css';
import React from 'react';
import Link from 'next/link';

export const metadata = { title: 'DriftGR' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
        <header className="border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">DriftGR</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/">Home</Link>
            <Link href="/tracks">Tracks</Link>
            <Link href="/upload">Upload</Link>
          </nav>
        </header>
        <main className="p-6 max-w-7xl mx-auto grid gap-6">{children}</main>
      </body>
    </html>
  );
}
