"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Gift, Trophy, Coins } from "lucide-react";
import { TaskList } from "@/components/task-list";
import { useSession } from "next-auth/react";
import { get_request } from "@/services/crud";
import { BoxOpening } from "@/components/box-opening";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RewardHistory } from "@/components/reward-history";
import {
  CampaignStats,
  CampaignStatsComponent,
} from "@/components/campaign-stats";
import ThreeBoxCanvasHero from "@/components/box-canvas-hero";

interface UserStats {
  keysEarned: number;
  boxesOpened: number;
  totalRewards: number;
  completedTasks: number;
}

interface Social {
  id: number;
  platform: string;
  created_at: string;
}

export interface MyBox {
  id: number;
  reward_type: string;
  reward_description: string;
  reward_data: {
    amount?: number;
    currency?: string;
    tier?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  reward_tier?: string;
  opened_at: string;
  status: string;
  txHash?: string;
}

interface Boxes {
  user: {
    id: number;
    total_boxes_opened: number;
    wallet_address: string;
  };
  boxes: MyBox[];
  pagination: {
    has_more: boolean;
    limit: number;
    offset: number;
    total: number;
  };
}

export default function Dashboard() {
  const { address } = useAccount();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isBoxLoading, setIsBoxLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const [socials, setSocials] = useState<Social[]>([]);
  const [boxStats, setBoxStats] = useState<CampaignStats>({
    total_boxes: 0,
    available_boxes: 0,
    opened_boxes: 0,
    opening_percentage: 0,
    next_box_position: 0,
    reward_distribution: {
      apecoin: 0,
      standard_nft: 0,
    },
  });
  const [userStats, setUserStats] = useState<UserStats>({
    keysEarned: 0,
    boxesOpened: 1,
    totalRewards: 50,
    completedTasks: 4,
  });
  const [myBoxes, setMyBoxes] = useState<Boxes>({
    user: {
      id: 0,
      total_boxes_opened: 0,
      wallet_address: "",
    },
    boxes: [],
    pagination: {
      has_more: false,
      limit: 0,
      offset: 0,
      total: 0,
    },
  });

  async function userStatsUpdate() {
    const res = await get_request("/user/me");
    setUserStats((prev) => ({ ...prev, keysEarned: res.data.key_count }));
    setIsLoading(false);
  }

  async function boxStatsUpdate() {
    const res = await get_request("/boxes/stats");
    setBoxStats(res.data);
    setIsBoxLoading(false);
  }

  async function myBoxUpdate() {
    const res = await get_request("/boxes/my-opened");
    setMyBoxes(res.data);
    setIsBoxLoading(false);
  }

  async function userSocialUpdate() {
    const res = await get_request("/user/socials");
    setSocials(res.data);
    setIsSocialLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    setIsBoxLoading(true);
    setIsSocialLoading(true);

    if (!address || status !== "authenticated") {
      return;
    }

    userStatsUpdate();
    userSocialUpdate();
    myBoxUpdate();
  }, [address, status]);

  useEffect(() => {
    boxStatsUpdate();
  }, []);

  return (
    <div className="w-full">
      <div className="py-30 flex flex-col items-center justify-center text-center text-6xl md:text-8xl font-bold tracking-tight ">
        <h1>Hii Box</h1>
        <h1>Opening</h1>
      </div>

      <div className="flex justify-between gap-12">
        <CampaignStatsComponent stats={boxStats} loading={isBoxLoading} />
        <div className="max-w-3xl mx-auto">
          <ThreeBoxCanvasHero />
        </div>
      </div>

      {(address || status == "authenticated") && (
        <Tabs defaultValue="tasks" className="space-y-8 w-full">
          <TabsList className="border-muted/50 border bg-background w-full h-[48px]">
            <TabsTrigger value="tasks" className="">
              Tasks & Keys
            </TabsTrigger>
            <TabsTrigger value="boxes" className="">
              Open Boxes
            </TabsTrigger>
            <TabsTrigger value="rewards" className="">
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="card-shadow border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Keys Available
                  </CardTitle>
                  <Key className="h-4 w-4 text-green-600 " />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="w-8 h-9" />
                  ) : (
                    <div className="text-3xl font-bold">
                      {userStats.keysEarned}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Ready to use
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Boxes Opened
                  </CardTitle>
                  <Gift className="h-4 w-4 text-green-600 " />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {userStats.boxesOpened}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total opened
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    APE Earned
                  </CardTitle>
                  <Coins className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {userStats.totalRewards}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total rewards
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Progress
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-green-600 " />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {userStats.completedTasks}/12
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tasks completed
                  </p>
                </CardContent>
              </Card>
            </div>

            <TaskList
              userAddress={address}
              socials={socials}
              isSocialLoading={isSocialLoading}
              onTaskComplete={() => {
                setUserStats((prev) => ({
                  ...prev,
                  keysEarned: prev.keysEarned + 1,
                  completedTasks: prev.completedTasks + 1,
                }));
                userSocialUpdate();
              }}
            />
          </TabsContent>

          <TabsContent value="boxes" className="animate-fade-in">
            <div className="max-w-lg w-full mx-auto">
              <BoxOpening
                availableKeys={userStats.keysEarned}
                onBoxOpened={() => {
                  userStatsUpdate();
                  boxStatsUpdate();
                  myBoxUpdate();
                }}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="rewards"
            className="animate-fade-in min-h-[50svh]"
          >
            <RewardHistory myBoxes={myBoxes.boxes} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
