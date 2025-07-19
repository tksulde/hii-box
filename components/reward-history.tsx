"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Coins, Gift, Calendar, ExternalLink } from "lucide-react";

interface RewardEntry {
  id: string;
  type: "ape" | "nft" | "ticket" | "common";
  name: string;
  amount?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  timestamp: Date;
  txHash?: string;
}

interface RewardHistoryProps {
  userAddress?: string;
}

export function RewardHistory({ userAddress }: RewardHistoryProps) {
  const [rewards, setRewards] = useState<RewardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockRewards: RewardEntry[] = [
      {
        id: "1",
        type: "ape",
        name: "50 APE Reward",
        amount: 50,
        rarity: "rare",
        timestamp: new Date(Date.now() - 86400000),
        txHash: "0x1234...5678",
      },
      {
        id: "2",
        type: "nft",
        name: "Silver Collector NFT",
        rarity: "rare",
        timestamp: new Date(Date.now() - 172800000),
        txHash: "0x2345...6789",
      },
      {
        id: "3",
        type: "ape",
        name: "25 APE Reward",
        amount: 25,
        rarity: "common",
        timestamp: new Date(Date.now() - 259200000),
        txHash: "0x3456...7890",
      },
    ];

    setTimeout(() => {
      setRewards(mockRewards);
      setLoading(false);
    }, 1000);
  }, [userAddress]);

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "epic":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "common":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "ape":
        return <Coins className="h-5 w-5" />;
      case "nft":
        return <Gift className="h-5 w-5" />;
      case "ticket":
        return <Trophy className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const totalApeEarned = rewards
    .filter((r) => r.type === "ape")
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  if (loading) {
    return (
      <Card className="card-shadow border-border/50">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading reward history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-shadow border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total APE Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalApeEarned}</div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              NFTs Won
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {rewards.filter((r) => r.type === "nft").length}
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rewards.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Reward History
          </CardTitle>
          <CardDescription>All your earned rewards and prizes</CardDescription>
        </CardHeader>
        <CardContent>
          {rewards.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No rewards yet</p>
              <p className="text-muted-foreground">
                Complete tasks and open boxes to start earning rewards
              </p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        {getRewardIcon(reward.type)}
                      </div>
                      <div>
                        <p className="font-medium">{reward.name}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge className={getRarityBadge(reward.rarity)}>
                            {reward.rarity}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {reward.timestamp.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      {reward.amount && (
                        <p className="text-lg font-bold">{reward.amount} APE</p>
                      )}
                      {reward.txHash && (
                        <a
                          href={`https://apechain.calderachain.xyz/tx/${reward.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View TX
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
