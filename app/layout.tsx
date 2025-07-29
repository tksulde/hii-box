// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthClientProvider from "@/context/auth-client-provider";

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
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Hiilink Box Opening",
    description: "Hiilink Box Opening",
    url: "https://your-site.com",
    images: ["https://giveaway.hii.link/og-image.jpg"],
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthClientProvider>
            {children}
            <Toaster />
          </AuthClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
