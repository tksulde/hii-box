import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Image from "next/image";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Web3Provider from "@/components/web3-provider";
import { Toaster } from "@/components/ui/sonner";
import { HeroHeader } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hiilink Box Opening",
  description: "Hiilink Box Opening",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Web3Provider cookies={cookies}>
            <div className="relative w-screen min-h-screen overflow-hidden">
              <HeroHeader />
              <div className="absolute inset-0 -z-20 h-[50vh] overflow-hidden">
                <Image
                  src="https://giveaway.hii.link/background.avif"
                  alt="Background decoration"
                  width={986}
                  height={100}
                  className="absolute -top-36 left-1/6"
                  priority
                />
                <Image
                  src="https://giveaway.hii.link/pattern.avif"
                  alt="Pattern overlay"
                  width={700}
                  height={700}
                  className="absolute -top-36 left-1/6 mix-blend-overlay h-[90vh] w-auto mx-auto"
                />

                <div
                  aria-hidden
                  className="bg-linear-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
              </div>
              <div className="min-w-[50%] h-screen bg-[radial-gradient(circle,rgba(108,108,108,1)_0%,rgba(0,0,0,1)_70%)] absolute top-0 left-0 translate-x-1/2 -translate-y-[70%] -z-50" />
              <main className="relative z-10 container mx-auto max-w-[986px] py-8 mt-12">
                {children}
              </main>
              <Toaster />
            </div>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
