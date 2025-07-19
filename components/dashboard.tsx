"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { ConnectButton } from "@/components/connect-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/task-list";
import { BoxOpening } from "@/components/box-opening";
import { RewardHistory } from "@/components/reward-history";
import { Key, Gift, Trophy, Coins } from "lucide-react";
import { NetworkSwitcher } from "@/components/network-switcher";
import { ModeToggle } from "./theme-toggle";

interface UserStats {
  keysEarned: number;
  boxesOpened: number;
  totalRewards: number;
  completedTasks: number;
}

export function Dashboard() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [userStats, setUserStats] = useState<UserStats>({
    keysEarned: 3,
    boxesOpened: 1,
    totalRewards: 50,
    completedTasks: 4,
  });

  useEffect(() => {
    // Fetch user stats from API
    const fetchUserStats = async () => {
      try {
        const response = await fetch(`/api/user/${address}/stats`);
        const stats = await response.json();
        setUserStats(stats);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      }
    };

    if (address) {
      fetchUserStats();
    }
  }, [address]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back, collector
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <NetworkSwitcher />
            <ConnectButton />
            <ModeToggle />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="card-shadow border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Keys Available
              </CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
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
              <Gift className="h-4 w-4 text-muted-foreground" />
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
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userStats.totalRewards}</div>
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
              <Trophy className="h-4 w-4 text-muted-foreground" />
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

        {/* Main Content */}
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
      </div>
    </div>
  );
}
