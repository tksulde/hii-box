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
import { Key } from "lucide-react";
import { post_request } from "@/services/crud";
import ThreeBoxCanvas from "./box-canvas";
import confetti from "canvas-confetti";
import { MyBox } from "@/app/(main)/page";
import { BoxOpenDialog } from "./box-open-dialog";

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
  boxBalance: number;
  myBoxes: MyBox[];
}

export function BoxOpening({
  availableKeys,
  onBoxOpened,
  boxBalance,
  myBoxes,
}: Props) {
  const [animation, setAnimation] = useState<
    "idle" | "shaking" | "opening" | "revealing"
  >("idle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rotateSpeed, setRotateSpeed] = useState(1);

  const REWARDS: Reward[] = [
    {
      type: "nft",
      name: "100k Points",
      rarity: "common",
      weight: 90000,
    },
    {
      type: "ape",
      name: "1 APE",
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

  const openBox = async (id: number) => {
    if (availableKeys <= 0 || boxBalance <= 0) {
      toast.error("No keys or boxes available", {
        description: "You need at least 1 key and 1 box to open a box.",
        icon: <Key className="h-4 w-4" />,
      });
      return;
    }

    setAnimation("shaking");
    await new Promise((r) => setTimeout(r, 500));
    setAnimation("opening");
    setRotateSpeed(10);

    toast.promise(
      async () => {
        const { data, status } = await post_request("/user/open", {
          id: Number(id),
        });

        if (status > 300) {
          throw new Error(data.detail ?? "Box opening failed");
        }

        const reward: Reward = data.box || REWARDS[0];
        await new Promise((r) => setTimeout(r, 1000));

        setAnimation("revealing");
        onBoxOpened(reward);

        await new Promise((r) => setTimeout(r, 1000));
        return data;
      },
      {
        loading: "Opening your box...",
        success: async (data) => {
          await new Promise((r) => setTimeout(r, 1500));
          setAnimation("idle");
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
          });
          return `You received: ${data.message}`;
        },
        error: (err) => `${err.message ?? "Box opening failed"}`,
      }
    );

    setRotateSpeed(1);
  };

  return (
    <div className="space-y-6">
      <Card className="card-shadow border-border/50 transition-all duration-300">
        <CardHeader>
          <div
            className={`h-64 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center ${
              animation !== "idle" ? "animate-pulse" : ""
            }`}
          >
            <ThreeBoxCanvas
              isOpening={animation !== "idle"}
              rotateSpeed={rotateSpeed}
            />
          </div>
          <CardTitle className="text-lg mt-4 flex justify-between">
            <p> Hii Mystery Box</p>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-sm">
                Key: {availableKeys}
              </Badge>
              <Badge variant="default" className="text-sm">
                Box: {boxBalance}
              </Badge>
            </div>
          </CardTitle>

          <CardDescription>
            1 key = 1 box. Win NFTs, APE, or a Vegas ticket 🏱
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 border-t pt-4">
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
            onClick={() => setDialogOpen(true)}
            disabled={
              availableKeys <= 0 || animation !== "idle" || boxBalance <= 0
            }
            className="w-full"
          >
            {animation === "idle" ? "Open Box" : "Opening..."}
          </Button>
        </CardContent>
      </Card>

      <BoxOpenDialog
        open={dialogOpen}
        boxIds={myBoxes.map((box) => box.id.toString())}
        onClose={() => setDialogOpen(false)}
        onSelectBox={async (boxId: number) => {
          setDialogOpen(false);
          await openBox(boxId);
        }}
      />
    </div>
  );
}
