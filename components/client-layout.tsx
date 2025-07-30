"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Web3Provider from "@/components/web3-provider";
import { Toaster } from "@/components/ui/sonner";
import { HeroHeader } from "@/components/header";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
  cookies,
  token,
}: Readonly<{
  children: React.ReactNode;
  cookies: string | null;
  token: string | undefined;
}>) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="min-h-screen bg-background" />;
  }

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <Web3Provider cookies={cookies}>
      <div className="relative w-screen min-h-screen overflow-hidden">
        <HeroHeader token={token ?? ""} />
        <div className="absolute inset-0 -z-20 h-[50vh] overflow-hidden">
          <Image
            src="https://giveaway.hii.link/background.avif"
            alt="Background decoration"
            width={986}
            height={100}
            className="absolute -top-36 left-1/6"
            priority
            aria-hidden="true"
          />
          <Image
            src="https://giveaway.hii.link/pattern.avif"
            alt="Pattern overlay"
            width={700}
            height={700}
            className="absolute -top-36 left-1/6 mix-blend-overlay h-[90vh] w-auto mx-auto"
            aria-hidden="true"
          />
          <div
            aria-hidden="true"
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
  );
}
