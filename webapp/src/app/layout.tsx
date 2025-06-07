
import Header from "@/components/header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "George Anthony",
  description: "Forward Thinking Finance",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} 
          antialiased`}
      >
        <Suspense><Header /></Suspense>
        {children}
        <footer className="bg-white border-t p-6 text-center text-sm text-gray-500">
          <p>&copy; 2025 George Anthony. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
