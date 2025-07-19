"use client";

import { ConnectButton } from "@/components/connect-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Key, Trophy } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-8 text-xs font-medium">
            Limited Time Campaign
          </Badge>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            Hii Box
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-light">
            ApeChain Reward Campaign
          </p>

          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Complete on-chain and social tasks to collect keys and unlock
            digital boxes with real prizes including ApeCoin rewards and a rare
            ApeFest Las Vegas ticket.
          </p>

          <ConnectButton
            size="lg"
            className="h-12 px-8 text-base font-medium group"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="card-shadow border-border/50 hover:border-border transition-colors">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Key className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Collect Keys
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Complete tasks and verify NFT ownership to earn keys
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="status-dot status-inactive mr-3" />
                  Hold specific NFTs
                </li>
                <li className="flex items-center">
                  <div className="status-dot status-inactive mr-3" />
                  Complete social tasks
                </li>
                <li className="flex items-center">
                  <div className="status-dot status-inactive mr-3" />
                  Verify on-chain activity
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-shadow border-border/50 hover:border-border transition-colors">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Gift className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Open Boxes
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Use your keys to unlock mystery boxes with tiered rewards
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="status-dot status-inactive mr-3" />
                  Random reward engine
                </li>
                <li className="flex items-center">
                  <div className="status-dot status-inactive mr-3" />
                  Multiple box tiers
                </li>
                <li className="flex items-center">
                  <div className="status-dot status-inactive mr-3" />
                  Guaranteed rewards
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-shadow border-border/50 hover:border-border transition-colors">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Win Prizes
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Earn ApeCoin, NFTs, and exclusive ApeFest tickets
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="status-dot status-success mr-3" />
                  ApeCoin rewards
                </li>
                <li className="flex items-center">
                  <div className="status-dot status-success mr-3" />
                  Exclusive NFTs
                </li>
                <li className="flex items-center">
                  <div className="status-dot status-success mr-3" />
                  ApeFest Las Vegas ticket
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <span>
              Built by Fusion Labs • Powered by ApeCoin and Arbitrum Orbit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
