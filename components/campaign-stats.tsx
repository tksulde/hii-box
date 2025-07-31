import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Package, Gift, Coins, TrendingUp, Users, Target } from "lucide-react";

export interface CampaignStats {
  total_boxes: number;
  available_boxes: number;
  opened_boxes: number;
  completion_percentage: number;
  next_box_position: number;
  reward_distribution: {
    apecoin: number;
    standard_nft: number;
    [key: string]: number;
  };
}

export function CampaignStatsComponent({
  stats,
  loading,
}: {
  stats: CampaignStats;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="card-shadow border-border/50 animate-pulse"
            >
              <CardContent className="p-8">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="card-shadow border-border/50 animate-pulse"
            >
              <CardContent className="p-8">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          {[1].map((i) => (
            <Card
              key={i}
              className="card-shadow border-border/50 animate-pulse"
            >
              <CardContent className="p-8">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case "apecoin":
        return <Coins className="h-4 w-4" />;
      case "standard_nft":
        return <Gift className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getRewardTypeLabel = (type: string) => {
    switch (type) {
      case "apecoin":
        return "APE Rewards";
      case "standard_nft":
        return "NFT Rewards";
      default:
        return type.replace("_", " ").toUpperCase();
    }
  };

  return (
    <div className="space-y-8 mb-12">
      {/* Main Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Boxes
            </CardTitle>
            <Package className="h-4 w-4 text-green-600 " />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(stats.total_boxes)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Campaign total</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Boxes
            </CardTitle>
            <Gift className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatNumber(stats.available_boxes)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ready to open</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Opened Boxes
            </CardTitle>
            <Users className="h-4 w-4 text-green-600 " />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatNumber(stats.opened_boxes)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">By community</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Next Box */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card className="card-shadow border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Campaign Progress
            </CardTitle>
            <CardDescription>Overall completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span className="font-medium">
                  {(stats.completion_percentage * 100).toFixed(2)}%
                </span>
              </div>
              <Progress
                value={stats.completion_percentage * 100}
                className="h-2"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {formatNumber(stats.opened_boxes)} of{" "}
              {formatNumber(stats.total_boxes)} boxes opened
            </div>
          </CardContent>
        </Card>

        {/* <Card className="card-shadow border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Next Box Position
            </CardTitle>
            <CardDescription>Queue position for next box</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              #{formatNumber(stats.next_box_position)}
            </div>
            <p className="text-sm text-muted-foreground">
              Next box will be at position{" "}
              {formatNumber(stats.next_box_position)}
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* Reward Distribution */}
      {/* <Card className="card-shadow border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Reward Distribution
          </CardTitle>
          <CardDescription>
            Breakdown of rewards given out so far
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats?.reward_distribution).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg"
              >
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  {getRewardTypeIcon(type)}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {getRewardTypeLabel(type)}
                  </p>
                  <p className="text-2xl font-bold">{formatNumber(count)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Total Rewards Distributed
              </span>
              <Badge variant="secondary" className="text-sm">
                {formatNumber(
                  Object.values(stats.reward_distribution).reduce(
                    (sum, count) => sum + count,
                    0
                  )
                )}{" "}
                rewards
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
