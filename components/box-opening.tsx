"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Gift, Key, Sparkles, Coins, Trophy, Star } from "lucide-react";
import { post_request } from "@/services/crud";

interface Reward {
  type: "ape" | "nft" | "ticket";
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  amount?: number;
  weight: number;
}

interface Props {
  availableKeys: number;
  onBoxOpened: (reward: Reward) => void;
}

export function BoxOpening({ availableKeys, onBoxOpened }: Props) {
  const [animation, setAnimation] = useState<
    "idle" | "shaking" | "opening" | "revealing"
  >("idle");

  const REWARDS: Reward[] = [
    {
      type: "nft",
      name: "Standard NFT",
      rarity: "common",
      weight: 90000,
    },
    {
      type: "ape",
      name: "50 APE",
      amount: 50,
      rarity: "rare",
      weight: 4000,
    },
    {
      type: "nft",
      name: "Rare NFT",
      rarity: "epic",
      weight: 999,
    },
    {
      type: "ticket",
      name: "ApeFest Las Vegas Ticket",
      rarity: "legendary",
      weight: 1,
    },
  ];

  const getRarityBadge = (rarity: Reward["rarity"]) =>
    ({
      common: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      rare: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      epic: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      legendary:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    }[rarity]);

  const openBox = async () => {
    if (availableKeys <= 0) {
      toast.error("No keys available", {
        description: "You need at least 1 key to open a box.",
        icon: <Key className="h-4 w-4" />,
      });
      return;
    }

    const toastId = `box-opening-${Date.now()}`;

    toast.loading("Opening your box...", {
      id: toastId,
      icon: <Gift className="h-4 w-4" />,
    });

    setAnimation("shaking");
    await new Promise((r) => setTimeout(r, 1000));
    setAnimation("opening");

    try {
      const { data } = await post_request("/open", {}); // 🔥 CALL YOUR API
      const reward = data.box;

      setAnimation("revealing");
      onBoxOpened(reward);

      await new Promise((r) => setTimeout(r, 1500));
      setAnimation("idle");

      toast.dismiss(toastId);
      toast.success(`${data.message}`, {
        icon:
          reward.type === "ape" ? (
            <Coins className="h-4 w-4" />
          ) : (
            <Trophy className="h-4 w-4" />
          ),
      });
    } catch (err) {
      setAnimation("idle");
      toast.dismiss(toastId);
      toast.error("Box opening failed", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-shadow border-border/50 transition-all duration-300">
        <CardHeader>
          <div
            className={`h-36 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center ${
              animation !== "idle" ? "animate-pulse" : ""
            }`}
          >
            {animation === "opening" ? (
              <Sparkles className="h-16 w-16 text-white animate-spin" />
            ) : (
              <Gift className="h-16 w-16 text-white" />
            )}
          </div>
          <CardTitle className="text-lg mt-4">Hii Mystery Box</CardTitle>
          <CardDescription>
            1 key = 1 box. Win NFTs, APE, or a Vegas ticket 🎁
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Badge variant="outline" className="text-sm">
              Cost: 1 Key
            </Badge>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-medium">Possible Rewards</p>
            {REWARDS.map((r, i) => (
              <div key={i} className="flex justify-between">
                <span>{r.name}</span>
                <Badge className={getRarityBadge(r.rarity)}>{r.rarity}</Badge>
              </div>
            ))}
          </div>
          <Button
            onClick={openBox}
            disabled={availableKeys <= 0 || animation !== "idle"}
            className="w-full"
          >
            {animation === "idle" ? "Open Box" : "Opening..."}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
