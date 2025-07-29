"use client";

import { ReactNode } from "react";
import ManageSidebar from "@/components/manage-sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import ManageNavbar from "@/components/manage-navbar";

export default function Layout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/manage");
    },
  });

  if (status !== "authenticated") {
    return null;
  }

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <ManageSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <ManageNavbar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
