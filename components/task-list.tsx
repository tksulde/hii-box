"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  CheckCircle,
  Circle,
  ExternalLink,
  Twitter,
  MessageCircle,
  Heart,
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
  verificationUrl?: string;
}

interface TaskListProps {
  userAddress?: string;
  onTaskComplete: () => void;
}

export function TaskList({ userAddress, onTaskComplete }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setTasks([
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
        title: "Follow @HiiBox on Twitter",
        description: "Follow our official Twitter account for updates",
        type: "social",
        reward: 1,
        completed: true,
        verificationUrl: "https://twitter.com/HiiBox",
      },
      {
        id: "3",
        title: "Retweet Launch Post",
        description: "Share our campaign launch announcement",
        type: "social",
        reward: 1,
        completed: true,
        verificationUrl: "https://twitter.com/HiiBox/status/123456789",
      },
      {
        id: "4",
        title: "Join Discord Server",
        description: "Join the official Hii Box Discord community",
        type: "social",
        reward: 1,
        completed: true,
        verificationUrl: "https://discord.gg/hiibox",
      },
      {
        id: "5",
        title: "Hold Mutant Ape NFT",
        description: "Own at least 1 Mutant Ape Yacht Club NFT",
        type: "nft",
        reward: 2,
        completed: false,
      },
      {
        id: "6",
        title: "Make ApeChain Transaction",
        description: "Complete at least 1 transaction on ApeChain network",
        type: "onchain",
        reward: 2,
        completed: true,
      },
    ]);
  }, []);

  const handleTaskVerification = async (task: Task) => {
    if (!userAddress) return;

    setLoading(task.id);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t))
      );
      onTaskComplete();

      toast.success("Task completed! 🎉", {
        description: `You earned ${task.reward} key${
          task.reward > 1 ? "s" : ""
        }`,
        icon: <Key className="h-4 w-4" />,
        duration: 4000,
      });
    } catch (error) {
      toast.error("Verification failed", {
        description: "Please complete the task requirements first.",
        duration: 4000,
      });
    } finally {
      setLoading(null);
    }
  };

  const getTaskIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-5 w-5 text-green-600" />;

    switch (type) {
      case "social":
        return <Twitter className="h-5 w-5 text-muted-foreground" />;
      case "nft":
        return <Heart className="h-5 w-5 text-muted-foreground" />;
      case "onchain":
        return <MessageCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

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
                  <div className="mt-1">
                    {getTaskIcon(task.type, task.completed)}
                  </div>
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
                  <Badge variant="secondary" className="text-xs">
                    {task.reward} Key{task.reward > 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
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
                  onClick={() => handleTaskVerification(task)}
                  disabled={task.completed || loading === task.id}
                  variant={task.completed ? "secondary" : "default"}
                  size="sm"
                >
                  {loading === task.id
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
    </div>
  );
}
