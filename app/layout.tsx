import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import LayoutWrapper from "@/components/LayoutWrapper";
import Script from "next/script";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quize",
  description: "Explore a wide range of quizzes across finance, technology, IT, and more. Test your knowledge, challenge your skills, and stay updated with the latest trends.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
         <meta
          name="google-adsense-account"
          content="ca-pub-5504771682915102"  // <-- ADD THIS
        />
        <Script
          id="adsense-verify"
          async
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5504771682915102"
          crossOrigin="anonymous"
        />
        </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutWrapper>
          {children}
          <Analytics/>
        </LayoutWrapper>
      </body>
    </html>
  );
}
