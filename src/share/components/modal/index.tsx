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

import ConfirmModal from "./confirm";

type ModalProps = Readonly<
  React.ComponentProps<typeof Dialog> & {
    title: string;
    description?: string;
    onConfirm: () => void;
    children: React.ReactNode;
    showCloseButton?: boolean;
    isConfirmClose?: boolean;
    confirmTitle?: string;
    cancelTitle?: string;
    confirmDisabled?: boolean;
    contentClassName?: string;
    showCancelButton?: boolean;
    confirmFullWidth?: boolean;
  }
>;

export default function Modal({
  open,
  title,
  description,
  onOpenChange,
  onConfirm,
  children,
  confirmTitle,
  showCloseButton = true,
  isConfirmClose = true,
  cancelTitle,
  confirmDisabled,
  contentClassName,
  showCancelButton = true,
  confirmFullWidth = false,
}: ModalProps) {
  const t = useTranslations("form");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const requestClose = React.useCallback(() => {
    if (isConfirmClose) {
      setConfirmOpen(true);
      return;
    }

    onOpenChange?.(false);
  }, [isConfirmClose, onOpenChange]);

  const handleDialogOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        onOpenChange?.(true);
        return;
      }

      requestClose();
    },
    [onOpenChange, requestClose],
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className={cn("max-w-2xl p-0", contentClassName)}
          onClick={(event) => event.stopPropagation()}
        >
          {showCloseButton ? (
            <div className="flex justify-end p-4 pb-0">
              <button
                type="button"
                onClick={requestClose}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-muted"
                aria-label={cancelTitle ?? t("btn.cancel")}
              >
                <X className="size-4" />
              </button>
            </div>
          ) : null}

          <div className="px-6 pb-6 pt-2">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
              {description ? (
                <DialogDescription className="text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              ) : null}
            </DialogHeader>

            <div className="mt-6">{children}</div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {showCancelButton ? (
                <Button
                  type="button"
                  variant="chocolate-outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={requestClose}
                >
                  {cancelTitle ?? t("btn.cancel")}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="default"
                size="lg"
                className={cn("w-full", !confirmFullWidth && "sm:w-auto")}
                onClick={onConfirm}
                disabled={confirmDisabled}
              >
                {confirmTitle ?? t("btn.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("confirm.title")}
        description={t("confirm.description")}
        onConfirm={() => {
          setConfirmOpen(false);
          onOpenChange?.(false);
        }}
      />
    </>
  );
}
