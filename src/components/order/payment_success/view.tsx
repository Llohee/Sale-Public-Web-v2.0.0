"use client";

import Image from "next/image";
import { ImageOff, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/share/ui/dialog";
import { getCartItemLineTotal, type CartItem } from "@/types/cart";
import { PaymentSuccessOrderDrawer } from "./drawer";

export interface OrderSnapshotItem extends CartItem {
  note?: string;
}

interface PaymentSuccessOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: OrderSnapshotItem[];
  total: string;
}

export function PaymentSuccessOrderModal({
  open,
  onOpenChange,
  items,
  total,
}: PaymentSuccessOrderModalProps) {
  const t = useTranslations("order.success");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const modalBody = (
    <div className="mt-6 space-y-4">
      {items.length > 0 ? (
        <>
          {items.map((item) => {
            const hasImage = !!item.imageUrl?.trim();

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[2rem] bg-amber-50/45 p-4 ring-1 ring-amber-900/10 sm:flex-row sm:items-start"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.5rem] bg-linear-to-br from-amber-50 to-amber-100 ring-1 ring-amber-900/10">
                  {hasImage ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-amber-900/55">
                      <ImageOff className="size-6" />
                      <span className="text-[10px] font-semibold">
                        {t("no_image")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-oregon-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-oregon-700/75">
                      {t("size_label")} {item.size} • {t("quantity_label")}{" "}
                      {item.quantity}
                    </p>
                  </div>

                  {item.note ? (
                    <div className="rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-amber-900/10">
                      <p className="text-xs font-semibold uppercase tracking-wide text-oregon-700/55">
                        {t("note_label")}
                      </p>
                      <p className="mt-1 text-sm text-oregon-900">
                        {item.note}
                      </p>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-oregon-700/70">
                      {t("line_total_label")}
                    </span>
                    <span className="text-lg font-extrabold text-oregon-900">
                      ${getCartItemLineTotal(item).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="rounded-[2rem] bg-oregon-50/70 px-5 py-4 ring-1 ring-amber-900/10">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-oregon-700/60">
                {t("fields.amount")}
              </span>
              <span className="text-2xl font-extrabold text-oregon-900">
                ${total}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[2rem] bg-amber-50/45 px-5 py-8 text-center text-sm text-oregon-700/70 ring-1 ring-amber-900/10">
          {t("empty_review")}
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-3rem)] max-w-4xl max-h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] p-0 sm:w-[calc(100vw-5rem)] sm:rounded-[2.5rem]">
          <div className="flex justify-end p-4 pb-0">
            <DialogClose
              className="inline-flex size-10 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-muted"
              aria-label={t("close")}
            >
              <X className="size-4" />
            </DialogClose>
          </div>

          <div className="max-h-[calc(100vh-7rem)] overflow-y-auto px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-2xl font-extrabold text-oregon-900">
                {t("review_title")}
              </DialogTitle>
              <DialogDescription className="text-sm text-oregon-700/70">
                {t("review_description")}
              </DialogDescription>
            </DialogHeader>

            {modalBody}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <PaymentSuccessOrderDrawer open={open} onOpenChange={onOpenChange}>
      {modalBody}
    </PaymentSuccessOrderDrawer>
  );
}
