"use client";
import { Home, Users, FileUser } from "lucide-react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Label } from "@radix-ui/react-label";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/manage/dashboard",
    },
    { icon: Users, label: "Users", href: "/manage/dashboard/users" },
    {
      icon: FileUser,
      label: "Supported NFTs",
      href: "/manage/dashboard/supported-nfts",
    },
  ];

  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="border-b flex h-16 items-center px-4">
          <Link href="/manage/dashboard" className="select-none">
            {/* <Image src={logoSrc} alt="Logo" width={85} height={32} /> */}
            <Label className="text-sm font-secondary cursor-pointer select-none">
              Admin Dashboard
            </Label>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                className="px-4 py-3"
              >
                <a href={item.href} className="flex items-center w-full h-full">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/* Requests Dropdown */}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </SidebarComponent>
  );
}
