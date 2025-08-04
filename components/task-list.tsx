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
import { TwitterTaskDialog } from "@/components/twitter-handle-dialog";
import { FaTwitter, FaDiscord, FaTelegramPlane } from "react-icons/fa";
import {
  CheckCircle,
  Heart,
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
  socials: { platform: string }[];
  isSocialLoading: boolean;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Hold Bored Ape NFT",
    description: "Own at least 1 Bored Ape Yacht Club NFT in your wallet",
    type: "nft",
    reward: 3,
    completed: false,
  },
  {
    id: "2",
    title: "Follow @HiiLink on Twitter",
    description: "Follow our official Twitter account for updates",
    type: "social",
    reward: 1,
    completed: false,
    verificationUrl: "https://x.com/hiilink",
    platform: "twitter",
  },
  {
    id: "3",
    title: "Join Discord Server",
    description: "Join the official HiiLink Discord community",
    type: "social",
    reward: 1,
    completed: false,
    verificationUrl: "https://discord.gg/hiilink",
    platform: "discord",
  },
  {
    id: "4",
    title: "Join Telegram Group",
    description: "Join the HiiLink community on Telegram",
    type: "social",
    reward: 1,
    completed: false,
    verificationUrl: "https://telegram.me/hiilink",
    platform: "telegram",
  },
];

export function TaskList({
  userAddress,
  onTaskComplete,
  socials,
  isSocialLoading,
}: TaskListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showTwitterDialog, setShowTwitterDialog] = useState(false);
  const [twitterTask, setTwitterTask] = useState<Task | null>(null);

  const tasks: Task[] = useMemo(() => {
    return initialTasks.map((task) => ({
      ...task,
      completed: socials.some((s) => s.platform === task.platform),
    }));
  }, [socials]);

  const handleSocial = async (platform: string): Promise<string> => {
    const { data } = await post_request("/user/socials", { platform });
    return data?.message || "Social task verified";
  };

  const checkNFT = async (): Promise<any> => {
    const { data, status } = await post_request("/user/nfts/check-nfts", {});
    return {
      message: data?.message || data.detail || "NFT ownership verified",
      status,
    };
  };

  const handleTaskVerification = async (task: Task, username?: string) => {
    if (!userAddress) return;

    setLoading(task.id);

    try {
      if (task.type === "social" && task.platform) {
        await handleSocial(task.platform);
        toast.success(`Twitter task verified 🎉`, {
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
        return <Heart className="h-5 w-5 text-pink-500" />;
      case "onchain":
        return <MessageCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  const handleVerifyClick = (task: Task) => {
    if (task.platform === "twitter") {
      setTwitterTask(task);
      setShowTwitterDialog(true);
    } else {
      handleTaskVerification(task);
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
                  onClick={() => handleVerifyClick(task)}
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

      {twitterTask && (
        <TwitterTaskDialog
          open={showTwitterDialog}
          verificationUrl={twitterTask.verificationUrl ?? ""}
          onClose={() => setShowTwitterDialog(false)}
          onVerify={async (username: string) => {
            await handleTaskVerification(twitterTask, username);
            setShowTwitterDialog(false);
          }}
        />
      )}
    </div>
  );
}
