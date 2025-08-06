"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export interface SocialTask {
  id: string;
  label: string;
  platform: string;
  url: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onVerify: (username: string | null) => Promise<void>;
  tasks: SocialTask[];
  task: SocialTask;
}

export function SocialTaskDialog({ open, onClose, onVerify, task }: Props) {
  const [username, setUsername] = useState("");
  const [visited, setVisited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setUsername("");
      setVisited(false);
    }
  }, [open]);

  const handleVisit = () => {
    window.open(task.url, "_blank");
    setVisited(true);
  };

  const handleDone = async () => {
    setLoading(true);
    await onVerify(username || null);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Social Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Enter your Twitter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={handleVisit}
          >
            <div className="flex gap-2 items-center">
              <ExternalLink className="h-4 w-4" />
              {task.label}
            </div>
            {visited && <CheckCircle className="h-4 w-4 text-green-500" />}
          </Button>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleDone}
            disabled={
              loading || !visited || (task.platform === "twitter" && !username)
            }
          >
            {loading ? "Verifying..." : "Done"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
