import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RoutePrefetcher } from "@/components/route-prefetcher";
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
  title: "JKV VisaXpress | Fast, Secure & Reliable Visa Solutions",
  description:
    "Streamline your global travel with our expert-led visa processing platform. Experience speed and accuracy in every application. 1M+ visas processed, 24h priority processing.",
  keywords: [
    "visa application",
    "visa processing",
    "travel visa",
    "visa solutions",
    "document validation",
    "visa tracking",
  ],
  openGraph: {
    title: "JKV VisaXpress | Fast, Secure & Reliable Visa Solutions",
    description:
      "Streamline your global travel with our expert-led visa processing platform.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
        suppressHydrationWarning
      >
        <RoutePrefetcher />
        {children}
      </body>
    </html>
  );
}
