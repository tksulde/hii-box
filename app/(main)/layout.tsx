// app/(main)/layout.tsx
import { headers } from "next/headers";
import ClientLayout from "./client-layout";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookiesData = headersData.get("cookie");

  return <ClientLayout cookies={cookiesData}>{children}</ClientLayout>;
}
