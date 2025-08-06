"use client";

import { wagmiAdapter, projectId, networks, siweConfig } from "@/lib/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { SessionProvider } from "next-auth/react";

// Set up queryClient
const queryClient = new QueryClient();

// Set up metadata
const metadata = {
  name: "Hii Box Opening",
  description: "Hii Box Opening",
  url: "https://hii-box.vercel.app",
  icons: ["https://hii-box.vercel.app/favicon.ico"],
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: "dark",
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  allWallets: "SHOW", // default to SHOW
  themeVariables: {
    "--w3m-accent": "#ccc",
  },
  siweConfig: siweConfig,
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
