"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Gift, Key, Sparkles, Coins, Trophy, Star } from "lucide-react";

interface Reward {
  type: "ape" | "nft" | "ticket" | "common";
  amount?: number;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface BoxOpeningProps {
  availableKeys: number;
  onBoxOpened: (reward: Reward) => void;
}

interface AnimationState {
  phase: "idle" | "shaking" | "opening" | "revealing" | "complete";
  boxId: string | null;
}

const BOX_TYPES = [
  {
    id: "bronze",
    name: "Bronze Box",
    cost: 1,
    description: "Basic rewards with guaranteed APE tokens",
    color: "from-amber-600 to-amber-800",
    rewards: [
      {
        type: "ape" as const,
        amount: 10,
        name: "10 APE",
        rarity: "common" as const,
      },
      {
        type: "ape" as const,
        amount: 25,
        name: "25 APE",
        rarity: "rare" as const,
      },
      {
        type: "common" as const,
        name: "Bronze Badge NFT",
        rarity: "common" as const,
      },
    ],
  },
  {
    id: "silver",
    name: "Silver Box",
    cost: 3,
    description: "Enhanced rewards with rare collectibles",
    color: "from-gray-400 to-gray-600",
    rewards: [
      {
        type: "ape" as const,
        amount: 50,
        name: "50 APE",
        rarity: "common" as const,
      },
      {
        type: "ape" as const,
        amount: 100,
        name: "100 APE",
        rarity: "rare" as const,
      },
      {
        type: "nft" as const,
        name: "Silver Collector NFT",
        rarity: "rare" as const,
      },
    ],
  },
  {
    id: "gold",
    name: "Gold Box",
    cost: 5,
    description: "Premium rewards including exclusive prizes",
    color: "from-yellow-400 to-yellow-600",
    rewards: [
      {
        type: "ape" as const,
        amount: 200,
        name: "200 APE",
        rarity: "rare" as const,
      },
      {
        type: "ape" as const,
        amount: 500,
        name: "500 APE",
        rarity: "epic" as const,
      },
      { type: "nft" as const, name: "Gold VIP NFT", rarity: "epic" as const },
      {
        type: "ticket" as const,
        name: "ApeFest Las Vegas Ticket",
        rarity: "legendary" as const,
      },
    ],
  },
];

export function BoxOpening({ availableKeys, onBoxOpened }: BoxOpeningProps) {
  const [animationState, setAnimationState] = useState<AnimationState>({
    phase: "idle",
    boxId: null,
  });
  const [lastReward, setLastReward] = useState<Reward | null>(null);
  const [showParticles, setShowParticles] = useState(false);

  const openBox = async (boxType: (typeof BOX_TYPES)[0]) => {
    if (availableKeys < boxType.cost) {
      toast.error("Insufficient keys", {
        description: `You need ${boxType.cost} keys to open this box.`,
        icon: <Key className="h-4 w-4" />,
        duration: 4000,
      });
      return;
    }

    // Show opening toast
    toast.loading("Opening box...", {
      description: "Get ready for your reward!",
      icon: <Gift className="h-4 w-4" />,
      duration: 3500,
    });

    // Start animation sequence
    setAnimationState({ phase: "shaking", boxId: boxType.id });

    // Shaking phase (1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAnimationState({ phase: "opening", boxId: boxType.id });

    // Opening phase (1 second)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Calculate reward
    const rewards = boxType.rewards;
    const weights = rewards.map((r) => {
      switch (r.rarity) {
        case "legendary":
          return 1;
        case "epic":
          return 5;
        case "rare":
          return 20;
        case "common":
          return 74;
        default:
          return 50;
      }
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    let selectedReward = rewards[0];
    for (let i = 0; i < rewards.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedReward = rewards[i];
        break;
      }
    }

    // Revealing phase
    setAnimationState({ phase: "revealing", boxId: boxType.id });
    setLastReward(selectedReward);
    setShowParticles(true);

    // Complete phase
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAnimationState({ phase: "complete", boxId: boxType.id });

    // Hide particles and reset
    setTimeout(() => {
      setShowParticles(false);
      setAnimationState({ phase: "idle", boxId: null });
    }, 2000);

    onBoxOpened(selectedReward);

    // Show success toast with reward details
    const getRewardEmoji = (rarity: string) => {
      switch (rarity) {
        case "legendary":
          return "🏆";
        case "epic":
          return "💎";
        case "rare":
          return "⭐";
        case "common":
          return "🎁";
        default:
          return "🎉";
      }
    };

    toast.success(`${getRewardEmoji(selectedReward.rarity)} Box opened!`, {
      description: `You won: ${selectedReward.name}`,
      icon:
        selectedReward.type === "ape" ? (
          <Coins className="h-4 w-4" />
        ) : (
          <Trophy className="h-4 w-4" />
        ),
      duration: 6000,
      action:
        selectedReward.type === "ape"
          ? {
              label: `+${selectedReward.amount} APE`,
              onClick: () => console.log("APE reward claimed"),
            }
          : undefined,
    });
  };

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
        return <Coins className="h-8 w-8" />;
      case "nft":
        return <Gift className="h-8 w-8" />;
      case "ticket":
        return <Trophy className="h-8 w-8" />;
      default:
        return <Star className="h-8 w-8" />;
    }
  };

  const isBoxAnimating = (boxId: string) => {
    return animationState.boxId === boxId && animationState.phase !== "idle";
  };

  const getBoxAnimation = (boxId: string) => {
    if (animationState.boxId !== boxId) return "";

    switch (animationState.phase) {
      case "shaking":
        return "box-shaking";
      case "opening":
        return "box-opening";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8">
      <Card className="card-shadow border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Available Keys
              </CardTitle>
              <CardDescription className="mt-1">
                Use your keys to open mystery boxes and win rewards
              </CardDescription>
            </div>
            <div className="text-3xl font-bold">{availableKeys}</div>
          </div>
        </CardHeader>
      </Card>

      {/* Reward Reveal Modal */}
      {animationState.phase === "revealing" && lastReward && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative">
            {/* Particles */}
            {showParticles && (
              <div className="particles-container">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`particle particle-${i}`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Reward Card */}
            <Card className="reward-revealing w-96 bg-background border-2 glow-effect">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 pulse-effect">
                  {getRewardIcon(lastReward.type)}
                </div>
                <CardTitle className="text-2xl font-bold">
                  Congratulations! 🎉
                </CardTitle>
                <CardDescription>You won an amazing reward!</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <p className="text-xl font-semibold mb-2">
                    {lastReward.name}
                  </p>
                  <Badge className={getRarityBadge(lastReward.rarity)}>
                    {lastReward.rarity.toUpperCase()}
                  </Badge>
                </div>
                {lastReward.type === "ape" && (
                  <div className="flex items-center justify-center text-3xl font-bold text-green-600">
                    <Coins className="h-8 w-8 mr-2" />
                    {lastReward.amount} APE
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Latest Reward Display */}
      {lastReward && animationState.phase === "idle" && (
        <Card className="card-shadow border-border/50 bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Latest Reward
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="font-medium">{lastReward.name}</p>
                <Badge className={getRarityBadge(lastReward.rarity)}>
                  {lastReward.rarity.toUpperCase()}
                </Badge>
              </div>
              {lastReward.type === "ape" && (
                <div className="flex items-center text-2xl font-bold">
                  <Coins className="h-6 w-6 mr-2" />
                  {lastReward.amount}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Box Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {BOX_TYPES.map((box) => (
          <Card
            key={box.id}
            className={`card-shadow border-border/50 hover:border-border transition-all duration-300 relative overflow-hidden ${
              isBoxAnimating(box.id) ? "transform-gpu" : ""
            }`}
          >
            <CardHeader>
              <div
                className={`w-full h-32 bg-gradient-to-br ${
                  box.color
                } rounded-lg flex items-center justify-center mb-4 relative ${getBoxAnimation(
                  box.id
                )}`}
              >
                {animationState.phase === "opening" &&
                animationState.boxId === box.id ? (
                  <div className="sparkle-effect">
                    <Sparkles className="h-16 w-16 text-white" />
                  </div>
                ) : (
                  <Gift className="h-12 w-12 text-white" />
                )}

                {/* Glow effect during animation */}
                {isBoxAnimating(box.id) && (
                  <div className="absolute inset-0 bg-white/20 rounded-lg animate-pulse" />
                )}
              </div>
              <CardTitle className="text-lg font-medium">{box.name}</CardTitle>
              <CardDescription>{box.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Badge variant="outline" className="text-sm">
                  {box.cost} Key{box.cost > 1 ? "s" : ""}
                </Badge>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Possible Rewards</p>
                {box.rewards.map((reward, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{reward.name}</span>
                    <Badge className={getRarityBadge(reward.rarity)}>
                      {reward.rarity}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => openBox(box)}
                disabled={availableKeys < box.cost || isBoxAnimating(box.id)}
                className="w-full transition-all duration-300"
                variant={availableKeys >= box.cost ? "default" : "secondary"}
              >
                {isBoxAnimating(box.id) ? (
                  <div className="flex items-center">
                    {animationState.phase === "shaking" && (
                      <>
                        <Gift className="h-4 w-4 mr-2 animate-bounce" />
                        Preparing...
                      </>
                    )}
                    {animationState.phase === "opening" && (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Opening...
                      </>
                    )}
                    {animationState.phase === "revealing" && (
                      <>
                        <Trophy className="h-4 w-4 mr-2 animate-pulse" />
                        Revealing...
                      </>
                    )}
                  </div>
                ) : (
                  `Open ${box.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
