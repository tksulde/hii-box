// app/(main)/layout.tsx
import { cookies, headers } from "next/headers";
import ClientLayout from "./client-layout";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookiesData = headersData.get("cookie");
  const cookieStore = await cookies();
  const token = cookieStore.get("hii_box_token")?.value;

  return (
    <ClientLayout cookies={cookiesData} token={token}>
      {children}
    </ClientLayout>
  );
}
