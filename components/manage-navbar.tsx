"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggler";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Breadcrumb from "@/components/breadcrumb";
import { signOut } from "next-auth/react";

export default function ManageNavbar() {
  return (
    <header className="flex justify-between border-b h-16 items-center px-4 gap-4">
      <SidebarTrigger className="md:hidden" />
      <Breadcrumb />
      <div className="flex items-center gap-2">
        <div className="flex flex-row items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
