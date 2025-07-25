"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wallet,
  LogOut,
  Settings,
  Copy,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
interface ConnectButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ConnectButton({
  variant = "ghost",
  size = "default",
  className,
}: ConnectButtonProps) {
  const { open } = useAppKit();
  const { address, isConnected, chain, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied!", {
        description: "Wallet address copied to clipboard",
        icon: <Copy className="h-4 w-4" />,
        duration: 2000,
      });
    }
  };

  const openExplorer = () => {
    if (address && chain) {
      const explorerUrl = chain.blockExplorers?.default?.url;
      if (explorerUrl) {
        window.open(`${explorerUrl}/address/${address}`, "_blank");
      }
    }
  };

  if (isConnecting) {
    return (
      <Button
        onClick={() => open()}
        variant={variant}
        size={size}
        className={className}
      >
        Loading...
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button
        onClick={() => open()}
        variant={variant}
        size={size}
        className={className}
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`${className} flex items-center space-x-2`}
        >
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm">{formatAddress(address!)}</span>
            {chain && (
              <Badge variant="secondary" className="text-xs">
                {chain.name}
              </Badge>
            )}
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {formatAddress(address!)}
              </p>
              {chain && (
                <p className="text-xs text-muted-foreground">
                  Connected to {chain.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-2" />
          Copy Address
        </DropdownMenuItem>

        <DropdownMenuItem onClick={openExplorer} className="cursor-pointer">
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Explorer
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => open({ view: "Account" })}
          className="cursor-pointer"
        >
          <Settings className="h-4 w-4 mr-2" />
          Account Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => disconnect()}
          className="cursor-pointer text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
