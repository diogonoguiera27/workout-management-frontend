import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Anton,
  Geist,
  Geist_Mono,
  Inter_Tight,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "streamdown/styles.css";
import "./globals.css";

import { ChatProvider } from "@/components/chat/chat-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIT.AI",
  description: "Plataforma FIT.AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} ${anton.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <Suspense fallback={children}>
          <ChatProvider>{children}</ChatProvider>
        </Suspense>
      </body>
    </html>
  );
}
