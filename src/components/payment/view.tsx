"use client";

import { PAYMENT_STATUS } from "@/constants/payment";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/share/ui/button";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  Clock3Icon,
  Coffee,
  HomeIcon,
  XCircleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface PaymentWrapperProps {
  status: (typeof PAYMENT_STATUS)[number];
  orderCode: string;
  message: string;
  amount: string;
  currency: string;
}

export function PaymentWrapper({
  status,
  orderCode,
  message,
  amount,
  currency,
}: PaymentWrapperProps) {
  const t = useTranslations("payment");
  const router = useRouter();
  const [remainingSeconds, setRemainingSeconds] = useState(10);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      router.push("/");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [remainingSeconds, router]);

  const statusConfig: Record<
    (typeof PAYMENT_STATUS)[number],
    {
      title: string;
      description: string;
      cardClassName: string;
      iconWrapClassName: string;
      buttonClassName: string;
      icon: ReactNode;
    }
  > = {
    INITIALIZED: {
      title: t("status.initialized.title"),
      description: t("status.initialized.description"),
      cardClassName: "bg-oregon-900",
      iconWrapClassName: "bg-oregon-700 text-oregon-50",
      buttonClassName: "bg-oregon-400 hover:bg-oregon-300 text-white",
      icon: <Clock3Icon className="size-8" />,
    },
    PENDING: {
      title: t("status.pending.title"),
      description: t("status.pending.description"),
      cardClassName: "bg-oregon-800",
      iconWrapClassName: "bg-oregon-600 text-oregon-50",
      buttonClassName: "bg-oregon-300 hover:bg-oregon-200 text-oregon-900",
      icon: <Clock3Icon className="size-8" />,
    },
    COMPLETED: {
      title: t("status.completed.title"),
      description: t("status.completed.description"),
      cardClassName: "bg-oregon-800",
      iconWrapClassName: "bg-oregon-300 text-oregon-900",
      buttonClassName: "bg-oregon-300 hover:bg-oregon-200 text-oregon-900",
      icon: <CheckCircle2Icon className="size-8" />,
    },
    FAILED: {
      title: t("status.failed.title"),
      description: t("status.failed.description"),
      cardClassName: "bg-oregon-900",
      iconWrapClassName: "bg-oregon-700 text-oregon-50",
      buttonClassName: "bg-oregon-500 hover:bg-oregon-400 text-white",
      icon: <XCircleIcon className="size-8" />,
    },
    CANCELED: {
      title: t("status.canceled.title"),
      description: t("status.canceled.description"),
      cardClassName: "bg-oregon-900",
      iconWrapClassName: "bg-oregon-700 text-oregon-50",
      buttonClassName: "bg-oregon-500 hover:bg-oregon-400 text-white",
      icon: <AlertCircleIcon className="size-8" />,
    },
    EXPIRED: {
      title: t("status.expired.title"),
      description: t("status.expired.description"),
      cardClassName: "bg-oregon-900",
      iconWrapClassName: "bg-oregon-700 text-oregon-50",
      buttonClassName: "bg-oregon-500 hover:bg-oregon-400 text-white",
      icon: <AlertCircleIcon className="size-8" />,
    },
  };

  const currentStatus = statusConfig[status] ?? statusConfig.PENDING;

  return (
    <div className="container mx-auto flex min-h-screen w-full items-center justify-center px-4 py-10">
      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-[2rem] px-8 py-12 text-center shadow-2xl ${currentStatus.cardClassName}`}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-10 top-10 size-2 rounded-full bg-white/40" />
          <div className="absolute left-24 top-20 size-1.5 rounded-full bg-oregon-300/80" />
          <div className="absolute right-20 top-14 size-2 rounded-full bg-white/35" />
          <div className="absolute right-10 top-28 size-1.5 rounded-full bg-oregon-300/80" />
          <div className="absolute left-20 bottom-28 size-1.5 rounded-full bg-white/35" />
          <div className="absolute right-24 bottom-24 size-2 rounded-full bg-oregon-300/80" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`flex size-20 mb-2 items-center justify-center rounded-full ${currentStatus.iconWrapClassName}`}
          >
            {currentStatus.icon}
          </div>

          <h1 className="mt-3 text-4xl font-extrabold text-white">
            {currentStatus.title}
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/75">
            {message || currentStatus.description}
          </p>

          <div className="mt-10 flex flex-col gap-2 w-full rounded-2xl bg-oregon-50/10 p-4 text-left ring-1 ring-oregon-100/30 backdrop-blur-sm">
            <div className="flex gap-2 items-center justify-between">
              <p className="text-sm font-medium tracking-wider text-white/60">
                {t("fields.order_code")}
              </p>
              <p className="break-all text-sm font-semibold text-white">
                {orderCode}
              </p>
            </div>
            <div className="flex gap-2 items-center justify-between">
              <p className="text-sm font-medium tracking-wider text-white/60">
                {t("fields.amount")}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{amount}</p>
            </div>
            <div className="flex gap-2 items-center justify-between">
              <p className="text-sm font-medium tracking-wider text-white/60">
                {t("fields.currency")}
              </p>
              <p className="mt-1 text-sm font-bold text-white">{currency}</p>
            </div>
          </div>
          <div className="mt-2 px-2 text-sm text-white/75 flex w-full items-end justify-end italic">
            {t.rich("notice.redirect_home", {
              seconds: remainingSeconds,
              count: (chunks) => (
                <span className="tabular-nums font-semibold not-italic text-oregon-200 ml-1">
                  {chunks}
                </span>
              ),
            })}
          </div>
          <div className="flex flex-1 w-full flex-col gap-2  mt-18 ">
            <Button
              variant="default"
              size="lg"
              className={`w-full ${currentStatus.buttonClassName}`}
              onClick={() => router.push("/")}
            >
              <HomeIcon className="size-4" />
              {t("btn.home")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
