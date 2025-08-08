/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { post_request } from "@/services/crud";
import {
  SocialTask,
  SocialTaskDialog,
} from "@/components/social-handle-dialog";
import { FaTwitter, FaDiscord, FaTelegramPlane } from "react-icons/fa";
import {
  CheckCircle,
  MessageCircle,
  Circle,
  ExternalLink,
  Key,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  type: "nft" | "social" | "onchain";
  reward: number;
  completed: boolean;
  requirements?: any;
  platform?: string;
  verificationUrl?: string;
}

interface TaskListProps {
  userAddress?: string;
  onTaskComplete: () => void;
  socials: { platform: string; social_task_id: number }[];
  isSocialLoading: boolean;
}

const initialTasks: Task[] = [
  {
    id: "101",
    title: "Hold The Mich Khan or Bichka NFT",
    description:
      "Earn keys by holding either NFT. The Mich Khan = 10 keys, Bichka = 5 keys per NFT. Keys are calculated automatically.",
    type: "nft",
    reward: 0, // Real reward handled on backend (nftCount * multiplier)
    completed: false,
  },
  // Twitter Follows
  {
    id: "1",
    title: "Follow @HiiLink",
    description: "Follow @HiiLink on X",
    type: "social",
    reward: 2,
    completed: false,
    verificationUrl: "https://x.com/hiilink",
    platform: "twitter",
  },
  {
    id: "2",
    title: "Follow @hiisverHQ",
    description: "Follow @hiisverHQ on X",
    type: "social",
    reward: 2,
    completed: false,
    verificationUrl: "https://x.com/hiisverHQ",
    platform: "twitter",
  },
  {
    id: "3",
    title: "Follow @themichkhan",
    description: "Follow @themichkhan on X",
    type: "social",
    reward: 2,
    completed: false,
    verificationUrl: "https://x.com/themichkhan",
    platform: "twitter",
  },
  {
    id: "4",
    title: "Follow @bananatheart",
    description: "Follow @bananatheart on X",
    type: "social",
    reward: 2,
    completed: false,
    verificationUrl: "https://x.com/bananatheart",
    platform: "twitter",
  },
  {
    id: "5",
    title: "Follow @LavaMAYC",
    description: "Follow @LavaMAYC on X",
    type: "social",
    reward: 2,
    completed: false,
    verificationUrl: "https://x.com/LavaMAYC",
    platform: "twitter",
  },
  {
    id: "6",
    title: "Follow @marce_wnl",
    description: "Follow @marce_wnl on X",
    type: "social",
    reward: 2,
    completed: false,
    verificationUrl: "https://x.com/marce_wnl",
    platform: "twitter",
  },
  {
    id: "7",
    title: "Follow @GoblinMemeBNB",
    description: "Follow @GoblinMemeBNB on X",
    type: "social",
    reward: 2,
    completed: false,
    verificationUrl: "https://x.com/GoblinMemeBNB",
    platform: "twitter",
  },

  // Twitter Retweets
  {
    id: "8",
    title: "Retweet @hiisverHQ",
    description: "Retweet this post by @hiisverHQ",
    type: "social",
    reward: 2,
    completed: false,
    verificationUrl: "https://x.com/hiisverHQ/status/1953447038126854409",
    platform: "twitter",
  },
  {
    id: "9",
    title: "Retweet @GoblinMemeBNB",
    description: "Retweet this post by @GoblinMemeBNB",
    type: "social",
    reward: 3,
    completed: false,
    verificationUrl: "https://x.com/GoblinMemeBNB/status/1936995627222884490",
    platform: "twitter",
  },
  {
    id: "10",
    title: "Retweet @HiiLink",
    description: "Retweet this post by @HiiLink",
    type: "social",
    reward: 3,
    completed: false,
    verificationUrl: "https://x.com/hiilink/status/1937795484812501279",
    platform: "twitter",
  },
  {
    id: "11",
    title: "Retweet @themichkhan",
    description: "Retweet this post by @themichkhan",
    type: "social",
    reward: 3,
    completed: false,
    verificationUrl: "https://x.com/themichkhan/status/1938065716084903980",
    platform: "twitter",
  },
  {
    id: "12",
    title: "Retweet @GoblinMemeBNB",
    description: "Retweet this post by @GoblinMemeBNB",
    type: "social",
    reward: 3,
    completed: false,
    verificationUrl: "https://x.com/GoblinMemeBNB/status/1951282604617113626",
    platform: "twitter",
  },
  {
    id: "13",
    title: "Retweet @HiiLink",
    description: "Retweet this post by @HiiLink",
    type: "social",
    reward: 3,
    completed: false,
    verificationUrl: "https://x.com/hiilink/status/1925877017670561869",
    platform: "twitter",
  },

  // Twitter Comments
  {
    id: "14",
    title: "Comment on @HiiLink",
    description: "Comment on this tweet from @HiiLink",
    type: "social",
    reward: 4,
    completed: false,
    verificationUrl: "https://x.com/hiilink/status/1925877017670561869",
    platform: "twitter",
  },
  {
    id: "15",
    title: "Comment on @GoblinMemeBNB",
    description: "Comment on this tweet from @GoblinMemeBNB",
    type: "social",
    reward: 4,
    completed: false,
    verificationUrl: "https://x.com/GoblinMemeBNB/status/1953317643156680840",
    platform: "twitter",
  },
  {
    id: "16",
    title: "Comment on @hiisverHQ",
    description: "Comment on this tweet from @hiisverHQ",
    type: "social",
    reward: 4,
    completed: false,
    verificationUrl: "https://x.com/hiisverHQ/status/1953456095181050001",
    platform: "twitter",
  },
  {
    id: "17",
    title: "Comment on @GoblinMemeBNB",
    description: "Comment on this tweet from @GoblinMemeBNB",
    type: "social",
    reward: 4,
    completed: false,
    verificationUrl: "https://x.com/GoblinMemeBNB/status/1936995627222884490",
    platform: "twitter",
  },

  // Telegram Joins
  {
    id: "18",
    title: "Join GoblinMemeBNB Telegram",
    description: "Join the GoblinMemeBNB Telegram group",
    type: "social",
    reward: 5,
    completed: false,
    verificationUrl: "https://t.me/GoblinMemeBNB",
    platform: "telegram",
  },
  {
    id: "19",
    title: "Join HiiLink Telegram",
    description: "Join the HiiLink Telegram group",
    type: "social",
    reward: 5,
    completed: false,
    verificationUrl: "https://t.me/hiilinkHQ",
    platform: "telegram",
  },

  // Discord Join
  {
    id: "20",
    title: "Join Discord Server",
    description: "Join the official Discord server",
    type: "social",
    reward: 5,
    completed: false,
    verificationUrl: "https://discord.gg/vPPy4SQ2Rt",
    platform: "discord",
  },
];

export function TaskList({
  userAddress,
  onTaskComplete,
  socials,
  isSocialLoading,
}: TaskListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SocialTask | null>(null);

  const tasks: Task[] = useMemo(() => {
    return initialTasks.map((task) => ({
      ...task,
      completed: socials.some((s) => s.social_task_id.toString() === task.id),
    }));
  }, [socials]);

  const handleSocial = async (
    platform: string,
    handle: string,
    id: string
  ): Promise<any> => {
    const { data } = await post_request("/user/socials", {
      platform,
      handle,
      social_task_id: id,
    });
    return { message: data.message || "Social task verified" };
  };

  const checkNFT = async (): Promise<any> => {
    const { data, status } = await post_request("/user/nfts/check-nfts", {});
    return {
      message: data?.message || data.detail || "NFT ownership verified",
      status,
    };
  };

  const handleTaskVerification = async (
    task: Task,
    username: string,
    id?: string
  ) => {
    if (!userAddress) return;
    setLoading(task.id);
    try {
      if (task.type === "social" && task.platform) {
        const { message } = await handleSocial(
          task.platform,
          username,
          id ?? ""
        );
        toast.success(`${message} 🎉`, {
          icon: <Key className="h-4 w-4" />,
        });
        onTaskComplete();
      } else if (task.type === "nft") {
        const { message, status } = await checkNFT();
        if (status < 300) {
          toast.success(`${message} 🎉`, {
            icon: <Key className="h-4 w-4" />,
          });
          onTaskComplete();
        } else {
          toast.info(`${message}`);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Verification failed", {
        description: "Please complete the task requirements first.",
      });
    } finally {
      setLoading(null);
    }
  };

  const getTaskIcon = (task: Task) => {
    if (task.completed)
      return <CheckCircle className="h-5 w-5 text-green-600" />;

    if (task.type === "social") {
      switch (task.platform) {
        case "twitter":
          return <FaTwitter className="h-5 w-5 text-blue-500" />;
        case "discord":
          return <FaDiscord className="h-5 w-5 text-indigo-500" />;
        case "telegram":
          return <FaTelegramPlane className="h-5 w-5 text-sky-500" />;
        default:
          return <Circle className="h-5 w-5 text-gray-500" />;
      }
    }

    switch (task.type) {
      case "nft":
        return (
          <div className="w-5 h-5 relative">
            <video
              width="28"
              height="28"
              loop
              autoPlay
              muted
              className="w-8 h-8 absolute top-0 left-0 object-cover"
            >
              <source src="/ApeCoin.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case "onchain":
        return <MessageCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  const handleVerifyClick = (task: Task) => {
    if (task.type === "social" && task.platform) {
      setSelectedTask({
        id: task.id,
        label: task.title,
        platform: task.platform,
        url: task.verificationUrl ?? "#",
      });
      setSocialDialogOpen(true);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="card-shadow border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">
                Task Progress
              </CardTitle>
              <CardDescription className="mt-1">
                Complete tasks to earn keys and unlock rewards
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {completedTasks} of {totalTasks}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress
            value={(completedTasks / totalTasks) * 100}
            className="w-full h-2"
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className={`card-shadow border-border/50 transition-colors ${
              task.completed ? "bg-muted/20" : "hover:border-border"
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">{getTaskIcon(task)}</div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium">
                      {task.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-base">
                      {task.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {task.type.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div>
                  {task.verificationUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(task.verificationUrl, "_blank")
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  )}
                </div>
                <Button
                  onClick={() =>
                    task.type === "social"
                      ? handleVerifyClick(task)
                      : handleTaskVerification(task, "")
                  }
                  disabled={
                    task.completed || loading === task.id || isSocialLoading
                  }
                  variant={task.completed ? "secondary" : "default"}
                  size="sm"
                >
                  {loading === task.id || isSocialLoading
                    ? "Verifying..."
                    : task.completed
                    ? "Completed"
                    : "Verify"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTask && (
        <SocialTaskDialog
          open={socialDialogOpen}
          onClose={() => setSocialDialogOpen(false)}
          task={selectedTask}
          tasks={[selectedTask]} // for dialog prop signature
          onVerify={async (username) => {
            await handleTaskVerification(
              tasks.find((t) => t.id === selectedTask.id)!,
              username!,
              selectedTask.id
            );
            setSocialDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
