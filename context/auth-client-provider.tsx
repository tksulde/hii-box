// app/context/auth-client-provider.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SessionProvider>{children}</SessionProvider>;
}
