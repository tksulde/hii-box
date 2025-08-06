/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Gift } from "lucide-react";
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
import { getHIIBOXContract } from "@/lib/hii-box-contract-helper";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GradientText from "@/components/gradient-text";

interface UserStats {
  keysEarned: number;
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
    [key: string]: any;
  };
  reward_tier?: string;
  opened_at: string;
  status: string;
  txHash?: string;
}

interface Boxes {
  boxes: MyBox[];
  total_owned: number;
}

export default function Dashboard() {
  const { address } = useAccount();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isBoxLoading, setIsBoxLoading] = useState(false);
  const [isMyBoxLoading, setIsMyBoxLoading] = useState(false);
  const [isMyBoxOpenedLoading, setIsBoxOpenedLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [isBurning, setIsBurning] = useState<string>("");

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
  });
  const [myBoxes, setMyBoxes] = useState<Boxes>({
    total_owned: 0,
    boxes: [],
  });

  const [myBoxesOpened, setMyBoxesOpened] = useState<Boxes>({
    total_owned: 0,
    boxes: [],
  });

  const [notBurnedBoxes, setNotBurnedBoxes] = useState<Array<string>>([]);

  async function userStatsUpdate() {
    const { data } = await get_request("/user/me");
    console.log("userStatsUpdate", data);
    setUserStats((prev) => ({ ...prev, keysEarned: data.key_count }));
    setIsLoading(false);
  }

  async function boxStatsUpdate() {
    const res = await get_request("/boxes/stats");
    setBoxStats(res.data);
    setIsBoxLoading(false);
  }

  async function myBoxOwnedUpdate() {
    const res = await get_request("/user/my-owned");
    setMyBoxes(res.data);
    setIsBoxLoading(false);
  }

  async function myBoxOpenedUpdate() {
    const res = await get_request("/user/my-opened");
    setMyBoxesOpened(res.data);
    setIsBoxOpenedLoading(false);
  }

  async function userSocialUpdate() {
    const res = await get_request("/user/socials");
    setSocials(res.data);
    setIsSocialLoading(false);
  }

  async function getBoxes() {
    if (!address) return;
    try {
      setIsMyBoxLoading(true);
      setNotBurnedBoxes([]);

      const { hiiboxReadContract } = await getHIIBOXContract();
      const balanceBN = await hiiboxReadContract.balanceOf(address);
      const balance = Number(balanceBN);

      const boxIds: string[] = [];

      for (let i = 0; i < balance; i++) {
        try {
          const tokenId = await hiiboxReadContract.tokenOfOwnerByIndex(
            address,
            i
          );
          boxIds.push(tokenId.toString());
        } catch (err) {
          console.error(`Failed to get token at index ${i}:`, err);
        }
      }

      setNotBurnedBoxes(boxIds);
    } catch (err) {
      console.error("❌ getBoxes failed:", err);
    } finally {
      setIsMyBoxLoading(false);
    }
  }

  async function burnBox(boxId: string) {
    if (!address || !boxId) return;

    setIsBurning(boxId);

    try {
      const { hiiboxWriteContract } = await getHIIBOXContract();
      const tx = await hiiboxWriteContract.safeTransferFrom(
        address,
        "0xC7a6939038234CBc7ab2D26e7a593785e522E12c",
        boxId
      );

      await tx.wait();

      myBoxOpenedUpdate();
      myBoxOwnedUpdate();

      toast.success(`Box #${boxId} burned successfully 🔥`, {
        icon: <Key className="h-4 w-4" />,
      });
    } catch (e: any) {
      if (e.code === "ACTION_REJECTED") {
        toast.error("User rejected the transaction");
      } else {
        toast.error("Box burn failed.");
        console.error("❌ burnBox error:", e);
      }
    } finally {
      setIsBurning("");
      setTimeout(() => getBoxes(), 1500);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    setIsBoxLoading(true);
    setIsSocialLoading(true);
    setIsBoxOpenedLoading(true);

    if (!address || status !== "authenticated") {
      return;
    }

    getBoxes();
    userStatsUpdate();
    userSocialUpdate();
    myBoxOpenedUpdate();
    myBoxOwnedUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, status]);

  useEffect(() => {
    boxStatsUpdate();
  }, []);

  return (
    <div className="w-full">
      <div className="py-10 md:py-30 flex flex-col items-center justify-center text-center text-6xl md:text-8xl font-bold tracking-tight ">
        <h1>Hii Box</h1>
        <h1>Opening</h1>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-between gap-12">
        <CampaignStatsComponent stats={boxStats} loading={isBoxLoading} />
        <div className="max-w-3xl mx-auto">
          <ThreeBoxCanvasHero />
        </div>
      </div>

      {address && status == "authenticated" && (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
                    {isMyBoxOpenedLoading ? (
                      <Skeleton className="w-8 h-9" />
                    ) : (
                      myBoxesOpened.total_owned
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total opened
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="my-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {isMyBoxLoading
                  ? [1, 2, 3].map((index) => (
                      <Skeleton key={index} className="w-[318px] h-[158px]" />
                    ))
                  : notBurnedBoxes.map((boxId, index) => (
                      <Card
                        key={index}
                        className={`card-shadow border-border/50 transition-colors card-shadow`}
                      >
                        <CardContent className="flex items-center justify-between gap-6">
                          <div className="relative overflow-hidden rounded-lg aspect-[3/3]">
                            <Image
                              src="/hii-box.avif" // ← replace with your actual box image path
                              alt={`Box ${boxId}`}
                              className="object-cover w-full h-full "
                              width={400}
                              height={400}
                            />
                          </div>
                          <div className="flex flex-col w-full justify-center items-center">
                            <div className="text-lg font-bold text-center">
                              <GradientText
                                colors={[
                                  "#40ffaa",
                                  "#4079ff",
                                  "#40ffaa",
                                  "#4079ff",
                                  "#40ffaa",
                                ]}
                                animationSpeed={5}
                                showBorder={false}
                                className="rounded-xs"
                              >
                                HII BOX #{boxId}
                              </GradientText>
                            </div>
                            <Button
                              className="mt-2 w-full"
                              onClick={() => burnBox(boxId)}
                              disabled={isBurning === boxId}
                            >
                              {isBurning === boxId
                                ? "Depositing..."
                                : "Deposit"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
              </div>
            </div>

            <TaskList
              userAddress={address}
              socials={socials}
              isSocialLoading={isSocialLoading}
              onTaskComplete={() => {
                userSocialUpdate();
              }}
            />
          </TabsContent>

          <TabsContent value="boxes" className="animate-fade-in">
            <div className="max-w-lg w-full mx-auto">
              <BoxOpening
                availableKeys={userStats.keysEarned}
                boxBalance={myBoxes.total_owned}
                myBoxes={myBoxes.boxes}
                onBoxOpened={() => {
                  userStatsUpdate();
                  boxStatsUpdate();
                  myBoxOpenedUpdate();
                  myBoxOwnedUpdate();
                }}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="rewards"
            className="animate-fade-in min-h-[50svh]"
          >
            <RewardHistory myBoxes={myBoxesOpened.boxes} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
