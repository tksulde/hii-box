/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface BoxOpenType {
  open: boolean;
  onClose: () => void;
  onSelectBox: any;
  boxIds: string[];
}

export function BoxOpenDialog({
  open,
  onClose,
  onSelectBox,
  boxIds,
}: BoxOpenType) {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = async () => {
    if (!selectedBox) return;
    setSubmitting(true);
    await onSelectBox(selectedBox);
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose} aria-describedby={undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Box to Open</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[320px] w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 m-3">
            {boxIds.map((boxId, index) => (
              <Card
                key={index + 1}
                className={`border-muted/40 hover:shadow-md cursor-pointer transition-all ${
                  selectedBox === boxId ? "ring-2 ring-green-500" : ""
                }`}
                onClick={() => setSelectedBox(boxId)}
              >
                <CardHeader>
                  <CardTitle>HII BOX #{boxId}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ready to open 🗝️
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button onClick={handleOpen} disabled={!selectedBox || submitting}>
            {submitting ? "Opening..." : "Open Selected Box"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
