"use client";

import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/share/lib/utils";
import { ImageOff, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductDetail } from "@/services/product/product.schema";
import { AddToCartDrawer } from "./card-drawer";
import { useMemo, useState } from "react";
import { costFormat } from "@/util/format";

interface ProductCardProps {
  product: ProductDetail;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const t = useTranslations("ProductPage");
  const router = useRouter();
  const price = product.price ?? 0;
  const hasImage = !!product.imageUrl?.trim();
  const [imageErrored, setImageErrored] = useState(false);
  const imageSrc = product.imageUrl?.trim() ?? "";
  const imageAlt = useMemo(
    () => product.name || "Product image",
    [product.name],
  );

  return (
    <div
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

        router.push(`/product/${product.id}`);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/product/${product.id}`);
        }
      }}
      className={cn(
        "relative group flex w-full flex-col gap-1.5 overflow-hidden rounded-xl bg-white shadow-[0_16px_36px_rgba(15,23,42,0.2)] transition-all duration-300 text-left cursor-pointer supports-backdrop-filter:backdrop-blur-md hover:ring-amber-900/15 sm:gap-2 sm:rounded-2xl",
        className,
      )}
    >
      <div className="flex items-center justify-center p-0 sm:p-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-linear-to-br from-oregon-400 to-oregon-600 ring-1 ring-amber-900/10 sm:w-full sm:rounded-xl">
          {hasImage && !imageErrored ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
              loading="lazy"
              onError={() => setImageErrored(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-amber-900/60 sm:gap-2">
              <ImageOff className="size-6 sm:size-8" />
              <span className="text-xs font-semibold tracking-wide sm:text-xs">
                {t("no_image")}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="min-w-0 px-2.5 sm:px-4">
        <div className="truncate text-base font-bold leading-snug sm:text-xl">
          {product.name}
        </div>
        <p className="mt-0.5 line-clamp-2 min-h-11 wrap-break-word text-xs leading-snug text-muted-foreground sm:mt-1 sm:min-h-12 sm:text-sm">
          {product.description?.trim() ? product.description : "\u00A0"}
        </p>
      </div>
      <div className="flex shrink-0 flex-col">
        <div className="flex items-end justify-between gap-1.5 sm:gap-3">
          <div className="flex flex-col gap-0.5 px-2.5 py-1 sm:gap-0.5 sm:px-4 sm:py-1.5">
            <div className="text-[11px] text-muted-foreground sm:text-sm">
              {t("addToCart")}
            </div>
            <div className="text-base font-bold tracking-tight text-oregon-900 sm:text-lg">
              {costFormat(price)}
            </div>
          </div>

          <AddToCartDrawer
            product={product}
            trigger={
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") e.stopPropagation();
                }}
                className="inline-flex h-12 min-w-11 shrink-0 items-center justify-center gap-2 rounded-[14px_0px_8px_0] bg-oregon-700 px-2 text-sm font-medium text-white hover:bg-oregon-600 sm:h-18 sm:min-w-0 sm:rounded-[20px_0px_10px_00px] sm:px-3 sm:text-base"
              >
                <Plus className="size-5 sm:size-8" />
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}
