"use client";

import { Button } from "@/share/ui/button";
import { costFormat } from "@/util/format";
import { useTranslations } from "next-intl";

type OrderCreateTotalProps = {
  totalItems: number;
  totalAmount: number;
  onClearClick: () => void;
  onContinueClick: () => void;
};

export function OrderCreateTotal({
  totalItems,
  totalAmount,
  onClearClick,
  onContinueClick,
}: OrderCreateTotalProps) {
  const t = useTranslations("order");

  return (
    <div className="sticky top-0 z-30 mb-4 flex flex-col gap-3 rounded-lg border border-border/50 bg-muted/95 px-3 py-3 shadow-md backdrop-blur-sm supports-backdrop-filter:bg-muted/85 max-lg:pt-[max(0.5rem,env(safe-area-inset-top,0px))] lg:static lg:z-auto lg:mb-0 lg:gap-4 lg:border-0 lg:bg-muted lg:px-4 lg:py-4 lg:pt-4 lg:backdrop-blur-none lg:shadow-md">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1 space-y-0.5">
          <h2 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
            {t("summary_title")}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {t("subtotal_label", { count: totalItems })}
          </p>
        </div>
        <Button
          type="button"
          variant="chocolate-outline"
          size="default"
          className="shrink-0 px-3 text-sm sm:px-4 sm:text-base"
          onClick={onClearClick}
        >
          {t("clear_all")}
        </Button>
      </div>

      <div className="space-y-2 border-border">
        <div className="flex items-center justify-between gap-3 border-t border-border pt-2 text-base font-semibold text-foreground sm:text-lg">
          <span>{t("total_money")}</span>
          <span className="tabular-nums text-lg sm:text-xl">{costFormat(totalAmount)}</span>
        </div>
      </div>

      <Button
        type="button"
        variant="default"
        size="xl"
        className="w-full text-base sm:text-lg"
        onClick={onContinueClick}
      >
        {t("btn.continue")}
      </Button>
    </div>
  );
}
