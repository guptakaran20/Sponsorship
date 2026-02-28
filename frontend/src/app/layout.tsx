import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
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
  title: "SponsorBridge — Campus Sponsorship Platform",
  description: "The smartest way for college clubs to find brand sponsors — and for brands to reach Gen-Z. Connect, sponsor, and grow.",
  openGraph: {
    title: "SponsorBridge — Campus Sponsorship Platform",
    description: "The smartest way for college clubs to find brand sponsors — and for brands to reach Gen-Z.",
    siteName: "SponsorBridge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SponsorBridge — Campus Sponsorship Platform",
    description: "The smartest way for college clubs to find brand sponsors — and for brands to reach Gen-Z.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
