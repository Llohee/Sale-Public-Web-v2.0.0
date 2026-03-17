"use client";

import Image from "next/image";
import { cn } from "@/share/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { ImageOff, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductDetail } from "@/services/product/product.schema";
import { AddToCartDrawer } from "./card-drawer";
import { useMemo, useRef, useState } from "react";

interface ProductCardProps {
  product: ProductDetail;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const t = useTranslations("ProductPage");
  const router = useRouter();
  const drawerJustClosedRef = useRef(false);
  const price = product.price ?? 0;
  const hasImage = !!product.imageUrl?.trim();
  const [imageErrored, setImageErrored] = useState(false);
  const imageSrc = product.imageUrl?.trim() ?? "";
  const imageAlt = useMemo(
    () => product.name || "Product image",
    [product.name],
  );

  return (
    <button
      type="button"
      onClick={(e) => {
        const target = e.target as Node;
        if (
          target &&
          "closest" in target &&
          typeof (target as Element).closest === "function" &&
          (target as Element).closest?.(
            '[data-slot="drawer-overlay"], [data-slot="drawer-portal"], [data-slot="drawer-content"]',
          )
        ) {
          return;
        }
        if (drawerJustClosedRef.current) {
          drawerJustClosedRef.current = false;
          return;
        }
        router.push(`/product/${product.id}`);
      }}
      className={cn(
        "relative group max-w-[220px] flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white/70 shadow-sm ring-1 ring-amber-900/10 transition-all duration-300 text-left cursor-pointer supports-[backdrop-filter]:backdrop-blur-md hover:shadow-md hover:ring-amber-900/15",
        className,
      )}
    >
      <div className="p-3 flex items-center justify-center flex-1">
        <div className="relative h-[200px] w-[200px] overflow-hidden rounded-[30px] bg-linear-to-br from-amber-50 to-amber-100 ring-1 ring-amber-900/10">
          {hasImage && !imageErrored ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              width={200}
              height={200}
              onError={() => setImageErrored(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-amber-900/60">
              <ImageOff className="size-8" />
              <span className="text-xs font-semibold tracking-wide">
                {t("imageUnavailable", { default: "No image" })}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="px-5">
        <div className="font-bold text-xl leading-8">{product.name}</div>
      </div>
      <div className="flex flex-col gap-5 flex-1 mt-2">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5 px-5 py-2 items-start justify-start">
            <div className="text-sm text-muted-foreground">
              {t("addToCart")}
            </div>
            <div className="text-lg font-bold tracking-tight text-oregon-900">
              ${price.toFixed(2)}
            </div>
          </div>

          <AddToCartDrawer
            product={product}
            onClose={() => {
              drawerJustClosedRef.current = true;
              setTimeout(() => {
                drawerJustClosedRef.current = false;
              }, 100);
            }}
            trigger={
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") e.stopPropagation();
                }}
                className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-[20px_0px_10px_00px] bg-oregon-700 px-3 text-base font-medium text-white hover:bg-oregon-600"
              >
                <Plus className="size-8" />
              </span>
            }
          />
        </div>
      </div>
    </button>
  );
}
