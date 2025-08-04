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
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface TwitterTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onVerify: (username: string) => Promise<void>; // ✅ FIXED HERE
  verificationUrl: string;
}

export function TwitterTaskDialog({
  open,
  onClose,
  onVerify,
  verificationUrl,
}: TwitterTaskDialogProps) {
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDone = async () => {
    if (!username.trim()) return;
    setSubmitting(true);
    await onVerify(username.trim()); // ✅ Pass username
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Twitter Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Enter your Twitter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(verificationUrl, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Follow @HiiLink
          </Button>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleDone}
            disabled={!username.trim() || submitting}
          >
            {submitting ? "Verifying..." : "Done"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
