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
    <div className="sticky top-6 flex flex-col gap-4 rounded-lg bg-muted px-4 py-4 shadow-md md:top-8 lg:top-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-0.5">
          <h2 className="text-lg font-semibold leading-snug text-foreground">
            {t("summary_title")}
          </h2>
          <p className="text-base text-muted-foreground">
            {t("subtotal_label", { count: totalItems })}
          </p>
        </div>
        <Button
          type="button"
          variant="chocolate-outline"
          size="default"
          className="shrink-0 px-4 text-base"
          onClick={onClearClick}
        >
          {t("clear_all")}
        </Button>
      </div>

      <div className="space-y-2 border-t border-border pt-3">
        <div className="flex items-center justify-between gap-3 text-base text-muted-foreground">
          <span>{t("subtotal_money")}</span>
          <span className="tabular-nums font-medium text-foreground">
            {costFormat(totalAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-2 text-lg font-semibold text-foreground">
          <span>{t("total_money")}</span>
          <span className="tabular-nums text-xl">{costFormat(totalAmount)}</span>
        </div>
      </div>

      <Button
        type="button"
        variant="default"
        size="xl"
        className="w-full"
        onClick={onContinueClick}
      >
        {t("btn.continue")}
      </Button>
    </div>
  );
}
