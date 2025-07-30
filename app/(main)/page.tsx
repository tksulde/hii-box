"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Gift, Trophy, Coins } from "lucide-react";
import { TaskList } from "@/components/task-list";
import { useSession } from "next-auth/react";
import { get_request } from "@/services/crud";

interface UserStats {
  keysEarned: number;
  boxesOpened: number;
  totalRewards: number;
  completedTasks: number;
}

export default function Dashboard() {
  const { address } = useAccount();
  const { data: session } = useSession();
  console.log("session:", session);

  useEffect(() => {
    if (!address) {
      return;
    }

    async function getUserStats() {
      const res = await get_request("/user/me");
      console.log(res.data);
    }

    getUserStats();
  }, [address]);

  const [userStats, setUserStats] = useState<UserStats>({
    keysEarned: 3,
    boxesOpened: 1,
    totalRewards: 50,
    completedTasks: 4,
  });

  // const { data } = useSession();

  return (
    <div className="w-full">
      <div className="py-30 flex flex-col items-center justify-center text-center text-8xl font-bold tracking-tight mb-2">
        <h1>Hii Box</h1>
        <h1>Opening</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="card-shadow border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Keys Available
            </CardTitle>
            <Key className="h-4 w-4 text-green-600 " />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.keysEarned}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to use</p>
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
            <div className="text-3xl font-bold">{userStats.boxesOpened}</div>
            <p className="text-xs text-muted-foreground mt-1">Total opened</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              APE Earned
            </CardTitle>
            <Coins className="h-4 w-4 text-green-600 " />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.totalRewards}</div>
            <p className="text-xs text-muted-foreground mt-1">Total rewards</p>
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
      <div className="w-full ">
        <TaskList
          userAddress={address}
          onTaskComplete={() => {
            setUserStats((prev) => ({
              ...prev,
              keysEarned: prev.keysEarned + 1,
              completedTasks: prev.completedTasks + 1,
            }));
          }}
        />
      </div>

      {/* <div>
        <Tabs defaultValue="tasks" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger
              value="tasks"
              className="data-[state=active]:bg-background"
            >
              Tasks & Keys
            </TabsTrigger>
            <TabsTrigger
              value="boxes"
              className="data-[state=active]:bg-background"
            >
              Open Boxes
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="data-[state=active]:bg-background"
            >
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="animate-fade-in">
            <TaskList
              userAddress={address}
              onTaskComplete={() => {
                setUserStats((prev) => ({
                  ...prev,
                  keysEarned: prev.keysEarned + 1,
                  completedTasks: prev.completedTasks + 1,
                }));
              }}
            />
          </TabsContent>

          <TabsContent value="boxes" className="animate-fade-in">
            <BoxOpening
              availableKeys={userStats.keysEarned}
              onBoxOpened={(reward) => {
                setUserStats((prev) => ({
                  ...prev,
                  keysEarned: prev.keysEarned - 1,
                  boxesOpened: prev.boxesOpened + 1,
                  totalRewards:
                    prev.totalRewards +
                    (reward.type === "ape" ? reward.amount ?? 0 : 0),
                }));
              }}
            />
          </TabsContent>

          <TabsContent value="rewards" className="animate-fade-in">
            <RewardHistory userAddress={address} />
          </TabsContent>
        </Tabs>
      </div> */}
    </div>
  );
}
