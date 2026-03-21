"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Coffee,
  CreditCard,
  MapPin,
  Wallet,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/share/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { getCartItemLineTotal } from "@/types/cart";
import {
  OrderSnapshotItem,
  PaymentSuccessOrderModal,
} from "./view";
import { LAST_ORDER_SNAPSHOT_KEY } from "@/constants/order";

interface PaymentSuccessViewProps {
  amount?: string;
  paidAt?: string;
  paymentMethod?: string;
  location?: string;
}

interface OrderSnapshot {
  items: OrderSnapshotItem[];
  amount: string;
  totalItems: number;
  paidAt: string;
  paymentMethod: string;
  location: string;
}

export function PaymentSuccessView({
  amount,
  paidAt,
  paymentMethod,
  location,
}: PaymentSuccessViewProps) {
  const t = useTranslations("order.success");
  const locale = useLocale();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [orderSnapshot] = useState<OrderSnapshot | null>(() => {
    if (typeof window === "undefined") return null;

    const raw = sessionStorage.getItem(LAST_ORDER_SNAPSHOT_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as OrderSnapshot;
    } catch {
      return null;
    }
  });

  const displayAmount = amount ?? orderSnapshot?.amount;
  const displayPaidAt = paidAt ?? orderSnapshot?.paidAt;
  const displayPaymentMethod = paymentMethod ?? orderSnapshot?.paymentMethod;
  const displayLocation = location ?? orderSnapshot?.location;

  const formattedPaidAt = displayPaidAt
    ? new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(displayPaidAt))
    : t("fallbacks.time");
  const infoItems = [
    {
      icon: Wallet,
      label: t("fields.amount"),
      value: displayAmount ? `$${displayAmount}` : t("fallbacks.amount"),
    },
    {
      icon: CalendarClock,
      label: t("fields.paid_at"),
      value: formattedPaidAt,
    },
    {
      icon: CreditCard,
      label: t("fields.payment_method"),
      value: displayPaymentMethod ?? t("fallbacks.payment_method"),
    },
    {
      icon: MapPin,
      label: t("fields.location"),
      value: displayLocation ?? t("fallbacks.location"),
    },
  ];
  const reviewItems = useMemo(
    () => orderSnapshot?.items ?? [],
    [orderSnapshot],
  );
  const reviewTotal =
    orderSnapshot?.amount ??
    amount ??
    reviewItems
      .reduce((sum, item) => sum + getCartItemLineTotal(item), 0)
      .toFixed(2);

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 rounded-[2.5rem] bg-white/80 px-6 py-10 text-center shadow-sm ring-1 ring-amber-900/10 supports-backdrop-filter:backdrop-blur-md sm:px-10 sm:py-12">
        <div className="flex size-20 items-center justify-center rounded-full bg-oregon-50 text-oregon-700 shadow-sm ring-1 ring-oregon-700/10">
          <CheckCircle2 className="size-10" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-oregon-700/60">
            {t("eyebrow")}
          </p>
          <h1 className="text-3xl font-extrabold text-oregon-900 sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-oregon-700/75 sm:text-base">
            {t("description")}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 rounded-[2rem] bg-amber-50/55 p-4 text-left ring-1 ring-amber-900/10 sm:grid-cols-2 sm:p-5">
          {infoItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-amber-900/10"
              >
                <div className="mt-0.5 rounded-full bg-oregon-50 p-2 text-oregon-700">
                  <Icon className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-oregon-700/55">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-oregon-900 sm:text-base">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/product" className="w-full sm:w-auto">
            <Button variant="dive" size="lg" className="w-full rounded-full px-8">
              <Coffee className="size-4" />
              {t("browse")}
            </Button>
          </Link>
          <Button
            variant="chocolate-outline"
            size="lg"
            className="w-full rounded-full px-8 sm:w-auto"
            onClick={() => setReviewOpen(true)}
          >
            {t("review_order")}
          </Button>
        </div>
      </div>

      <PaymentSuccessOrderModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        items={reviewItems}
        total={reviewTotal}
      />
    </div>
  );
}
