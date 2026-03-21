"use client";

import * as React from "react";
import { useEffect, useState } from "react";
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/share/ui/drawer";
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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const cancelLabel = cancelTitle ?? t("btn.cancel");
  const actionLabel = confirmTitle ?? t("btn.leave");

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const cancelButton = (
    <Button
      type="button"
      variant="chocolate-outline"
      size="lg"
      className="w-full rounded-full sm:w-auto"
      onClick={() => onOpenChange(false)}
    >
      {cancelLabel}
    </Button>
  );

  const confirmButton = (
    <Button
      type="button"
      variant="default"
      size="lg"
      className="w-full rounded-full sm:w-auto"
      onClick={handleConfirm}
    >
      {actionLabel}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("max-w-md p-0", contentClassName)}>
          <div className="flex justify-end p-4 pb-0">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-muted"
              aria-label={cancelLabel}
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
              {cancelButton}
              {confirmButton}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="rounded-t-3xl bg-background before:border-0">
        <DrawerHeader className="space-y-3 text-left">
          {icon ? <div className="flex justify-center">{icon}</div> : null}
          <DrawerTitle className="text-left text-xl font-semibold text-oregon-900">
            {title}
          </DrawerTitle>
          <DrawerDescription className="text-left text-sm leading-relaxed text-oregon-700/80">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex flex-col gap-3 pt-2">
          {cancelButton}
          {confirmButton}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
