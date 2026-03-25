"use client";

import { useRouter } from "@/i18n/navigation";
import type { ComboDetail } from "@/services/combo/combo.schema";
import { costFormat } from "@/util/format";
import { cn } from "@/share/lib/utils";
import { ImageOff, Plus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AddToCartDrawer } from "./card-drawer";

type ComboCardProps = {
  combo: ComboDetail;
  className?: string;
};

export function ComboCard({ combo, className }: ComboCardProps) {
  const t = useTranslations("combo");
  const router = useRouter();
  const [imageErrored, setImageErrored] = useState(false);
  const firstProductImage = combo.products[0]?.product.imageUrl?.trim() ?? "";
  const hasImage = !!firstProductImage;
  const imageAlt = useMemo(() => combo.name || t("banner.alt"), [combo.name, t]);
  const comboTotal = useMemo(
    () =>
      Math.max(
        0,
        combo.products.reduce(
          (sum, item) =>
            sum + (item.product.price ?? 0) * item.quantityRequired,
          0,
        ) - combo.discountAmount,
      ),
    [combo.discountAmount, combo.products],
  );

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={(event) => {
        const target = event.target as Node;
        if (
          target &&
          "closest" in target &&
          typeof (target as Element).closest === "function" &&
          (target as Element).closest?.(
            '[data-slot="dialog-overlay"], [data-slot="dialog-portal"], [data-slot="dialog-content"], [data-slot="drawer-overlay"], [data-slot="drawer-portal"], [data-slot="drawer-content"]',
          )
        ) {
          return;
        }

        router.push(`/combo/${combo.id}`);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/combo/${combo.id}`);
        }
      }}
      className={cn(
        "relative group flex w-full flex-col gap-1 overflow-hidden rounded-xl bg-white shadow-[0_16px_36px_rgba(15,23,42,0.2)] transition-all duration-300 text-left cursor-pointer supports-backdrop-filter:backdrop-blur-md hover:ring-amber-900/15 sm:gap-2 sm:rounded-2xl",
        className,
      )}
    >
      <div className="flex items-center justify-center p-0 sm:p-3">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-xl bg-linear-to-br from-oregon-400 to-oregon-600 ring-1 ring-amber-900/10 sm:aspect-square sm:w-full sm:rounded-xl">
          {hasImage && !imageErrored ? (
            <Image
              src={firstProductImage}
              alt={imageAlt}
              fill
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
              loading="lazy"
              onError={() => setImageErrored(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-amber-900/60 sm:gap-2">
              <ImageOff className="size-6 sm:size-8" />
              <span className="text-xs font-semibold tracking-wide sm:text-xs">
                {t("card.no_image")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="min-w-0 px-4 pb-0.5 pt-1 sm:pb-0 sm:pt-0">
        <div className="truncate text-lg font-bold leading-tight sm:text-xl sm:leading-snug">
          {combo.name}
        </div>
        <p className="mt-0.5 line-clamp-2 min-h-10 wrap-break-word text-sm leading-snug text-muted-foreground sm:mt-1 sm:min-h-12 sm:text-sm">
          {combo.description?.trim() ? combo.description : "\u00A0"}
        </p>
      </div>

      <div className="flex shrink-0 flex-col">
        <div className="flex items-end justify-between gap-2 sm:gap-3">
          <div className="flex flex-col gap-0.5 px-2.5 pb-1 pt-0 sm:gap-0.5 sm:py-1.5">
            <div className="text-xs text-muted-foreground sm:text-sm">
              {t("card.total_label")}
            </div>
            <div className="text-lg font-bold tracking-tight text-oregon-900">
              {costFormat(comboTotal)}
            </div>
          </div>
          <AddToCartDrawer
            combo={combo}
            trigger={
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ")
                    event.stopPropagation();
                }}
                className="inline-flex h-14 min-w-14 shrink-0 items-center justify-center gap-2 rounded-[16px_0px_10px_0] bg-oregon-700 px-2.5 text-sm font-medium text-white hover:bg-oregon-600 sm:h-18 sm:min-w-0 sm:rounded-[20px_0px_10px_00px] sm:px-3 sm:text-base"
              >
                <Plus className="size-7 sm:size-8" />
              </span>
            }
          />
        </div>
      </div>
    </article>
  );
}
