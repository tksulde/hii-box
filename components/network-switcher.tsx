/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Network, ChevronDown, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const SUPPORTED_NETWORKS = [
  {
    id: 33139,
    name: "ApeChain",
    shortName: "APE",
    isTestnet: false,
  },
  {
    id: 42161,
    name: "Arbitrum One",
    shortName: "ARB",
    isTestnet: false,
  },
  {
    id: 1,
    name: "Ethereum",
    shortName: "ETH",
    isTestnet: false,
  },
];

export function NetworkSwitcher() {
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return null;

  const currentNetwork = SUPPORTED_NETWORKS.find((n) => n.id === chain?.id);
  const isUnsupportedNetwork = !currentNetwork;

  const handleNetworkSwitch = async (networkId: number) => {
    try {
      await switchChain({ chainId: networkId });
      toast.success("Network switched!", {
        description: `Switched to ${
          SUPPORTED_NETWORKS.find((n) => n.id === networkId)?.name
        }`,
        icon: <Network className="h-4 w-4" />,
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to switch network", {
        description: "Please try again or switch manually in your wallet",
        duration: 4000,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isUnsupportedNetwork ? "destructive" : "outline"}
          size="sm"
          className="flex items-center space-x-2"
          disabled={isPending}
        >
          {isUnsupportedNetwork ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Network className="h-4 w-4" />
          )}
          <span className="text-sm">
            {isPending
              ? "Switching..."
              : currentNetwork?.shortName || "Unsupported"}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SUPPORTED_NETWORKS.map((network) => (
          <DropdownMenuItem
            key={network.id}
            onClick={() => handleNetworkSwitch(network.id)}
            className="cursor-pointer flex items-center justify-between"
            disabled={chain?.id === network.id || isPending}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  chain?.id === network.id ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span>{network.name}</span>
            </div>
            {chain?.id === network.id && (
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
