"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/share/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/share/ui/dialog";
import { cn } from "@/share/lib/utils";

type ConfirmModalProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  cancelTitle?: string;
  confirmTitle?: string;
  icon?: React.ReactNode;
  contentClassName?: string;
}>;

export default function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  cancelTitle,
  confirmTitle,
  icon,
  contentClassName,
}: ConfirmModalProps) {
  const t = useTranslations("form");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-md p-0", contentClassName)}>
        <div className="flex justify-end p-4 pb-0">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-muted"
            aria-label={cancelTitle ?? t("btn.cancel")}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-2">
          <DialogHeader className="items-center text-center">
            {icon ? <div className="mb-2 flex justify-center">{icon}</div> : null}
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="chocolate-outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              {cancelTitle ?? t("btn.cancel")}
            </Button>
            <Button
              type="button"
              variant="default"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmTitle ?? t("btn.leave")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
