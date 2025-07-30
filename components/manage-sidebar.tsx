"use client";
import {
  Home,
  Users,
  FileUser,
  Box,
  Boxes,
  Logs,
  FileKey,
  Receipt,
  ReceiptText,
  FileText,
  ChevronDown,
  ChevronRight,
  PenTool,
  Shield,
  FileSearch,
} from "lucide-react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Label } from "@radix-ui/react-label";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { theme } = useTheme();
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
    {
      icon: FileUser,
      label: "User Subscriptions",
      href: "/manage/dashboard/user-subscriptions",
    },
    {
      icon: ReceiptText,
      label: "Payments",
      href: "/manage/dashboard/payments",
    },
    {
      icon: Receipt,
      label: "Subscription Plans",
      href: "/manage/dashboard/subscription-plans",
    },
    { icon: Logs, label: "Access Log", href: "/manage/dashboard/access-log" },
    {
      icon: FileKey,
      label: "Api Key Log",
      href: "/manage/dashboard/api-key-log",
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
