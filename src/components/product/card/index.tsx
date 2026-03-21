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
        "relative group flex w-full flex-col gap-2 drop-shadow-md overflow-hidden rounded-xl bg-white/70 transition-all duration-300 text-left cursor-pointer supports-backdrop-filter:backdrop-blur-md hover:ring-amber-900/15 sm:gap-3 sm:rounded-2xl",
        className,
      )}
    >
      <div className="flex items-center justify-center p-2.5 pb-0 sm:p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-linear-to-br from-oregon-400 to-oregon-600 ring-1 ring-amber-900/10 sm:rounded-xl">
          {hasImage && !imageErrored ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              fill
              onError={() => setImageErrored(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-amber-900/60 sm:gap-2">
              <ImageOff className="size-6 sm:size-8" />
              <span className="text-xs font-semibold tracking-wide sm:text-xs">
                {t("imageUnavailable", { default: "No image" })}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="px-3 sm:px-5">
        <div className="text-lg font-bold leading-snug sm:text-xl sm:leading-8">
          {product.name}
        </div>
        {product.description ? (
          <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-muted-foreground sm:mt-1 sm:text-sm">
            {product.description}
          </p>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-end">
        <div className="flex items-end justify-between gap-2 sm:gap-4">
          <div className="flex flex-col gap-0 px-3 py-1.5 sm:gap-0.5 sm:px-5 sm:py-2">
            <div className="text-xs text-muted-foreground sm:text-sm">
              {t("addToCart")}
            </div>
            <div className="text-lg font-bold tracking-tight text-oregon-900 sm:text-lg">
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
                className="inline-flex h-14 min-w-13 shrink-0 items-center justify-center gap-2 rounded-[16px_0px_8px_0] bg-oregon-700 px-2.5 text-sm font-medium text-white hover:bg-oregon-600 sm:h-18 sm:min-w-0 sm:rounded-[20px_0px_10px_00px] sm:px-3 sm:text-base"
              >
                <Plus className="size-6 sm:size-8" />
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}
