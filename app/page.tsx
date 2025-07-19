"use client";

import { useAccount } from "wagmi";
import { Dashboard } from "@/components/dashboard";
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {isConnected ? <Dashboard /> : <LandingPage />}
    </main>
  );
}
