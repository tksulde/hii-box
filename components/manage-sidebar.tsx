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
  SidebarFooter,
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
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/manage/dashboard",
    },
    { icon: Users, label: "Users", href: "/manage/dashboard/users" },
    { icon: Box, label: "Items", href: "/manage/dashboard/items" },
    { icon: Boxes, label: "Category", href: "/manage/dashboard/categories" },
    {
      icon: Boxes,
      label: "Sub Category",
      href: "/manage/dashboard/sub-categories",
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

  const requestItems = [
    {
      icon: PenTool,
      label: "Sign Request",
      href: "/manage/dashboard/requests/sign",
    },
    {
      icon: Shield,
      label: "Auth Request",
      href: "/manage/dashboard/requests/auth",
    },
    {
      icon: FileSearch,
      label: "Extract Request",
      href: "/manage/dashboard/requests/extract",
    },
  ];

  const logoSrc = theme === "light" ? "/E-Sign-Light.svg" : "/E-Sign-Dark.svg";

  // Check if any request route is active
  const isRequestsActive = requestItems.some((item) => isActive(item.href));

  useEffect(() => {
    if (pathname.startsWith("/manage/dashboard/requests")) {
      setIsRequestsOpen(true);
    }
  }, [pathname]);

  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="border-b flex h-16 items-center px-4">
          <Link href="/manage/dashboard" className="select-none">
            <Image src={logoSrc} alt="Logo" width={85} height={32} />
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
          <Collapsible
            open={isRequestsOpen}
            onOpenChange={setIsRequestsOpen}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  className="px-4 py-3 h-11"
                  isActive={isRequestsActive}
                >
                  <FileText className="h-5 w-5" />
                  <span>Requests</span>
                  {isRequestsOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {requestItems.map((item) => (
                    <SidebarMenuSubItem key={item.label}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(item.href)}
                        className="px-4 py-3 h-12 w-44"
                      >
                        <a
                          href={item.href}
                          className="flex items-center w-full h-full"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </SidebarComponent>
  );
}
