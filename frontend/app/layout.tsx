import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { ErrorBoundary } from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SignalIQ - AI-Powered Investment Intelligence",
  description: "Decide which stocks to consider, know when to buy, understand how long to hold, and identify when to sell.",
  keywords: ["stocks", "investment", "AI", "trading", "signals", "NGX", "NYSE", "NASDAQ"],
  authors: [{ name: "SignalIQ" }],
  creator: "SignalIQ",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SignalIQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
