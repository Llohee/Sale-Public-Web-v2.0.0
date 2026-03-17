"use client";

import { Button } from "@/share/ui/button";
import { useCart } from "@/providers/cart-provider";
import { PRODUCT_SIZES, type ProductSize } from "@/types/cart";
import { Link, useRouter } from "@/i18n/navigation";
import { ChevronLeft, ImageOff, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { ProductDetail } from "@/services/product/product.schema";
import { cn } from "@/share/lib/utils";

interface ProductDetailViewProps {
  product: ProductDetail;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const t = useTranslations("product.detail");
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<ProductSize>("M");
  const hasImage = !!product.imageUrl?.trim();
  const [imageErrored, setImageErrored] = useState(false);
  const { addItem } = useCart();
  const unitPrice = product.price ?? 0;
  const sizeMod =
    PRODUCT_SIZES.find((s) => s.value === size)?.priceModifier ?? 0;
  const lineTotal = (unitPrice + sizeMod) * quantity;

  const handleAddToOrder = () => {
    addItem({ product, size, quantity });
  };

  return (
    <div className="container mx-auto flex flex-col gap-6 mt-4">
      <Button variant="default" size="sm" onClick={() => router.back()}>
        <ChevronLeft className="size-5" />
        <span className="text-sm font-semibold">{t("back")}</span>
      </Button>
      <div className="relative flex w-full shrink-0 justify-center px-4 pb-0 pt-4 sm:basis-[420px] sm:justify-start sm:px-0 sm:pt-0">
        <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-2xl bg-muted sm:max-w-[420px] sm:rounded-3xl sm:shadow-lg sm:ring-1 sm:ring-black/5">
          <Link
            href="/product"
            aria-label={t("back")}
            className="absolute left-3 top-5 z-10 inline-flex h-12 items-center gap-2 rounded-full bg-white/90 px-4 text-foreground shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white sm:hidden"
          >
            <ChevronLeft className="size-5" />
          </Link>

          {hasImage && !imageErrored ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
              width={320}
              height={320}
              sizes="(max-width: 640px) 90vw, 420px"
              onError={() => setImageErrored(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-50 to-amber-100 text-amber-900/60">
              <div className="flex flex-col items-center justify-center gap-2">
                <ImageOff className="size-10" />
                <span className="text-sm font-semibold tracking-wide">
                  {t("imageUnavailable")}
                </span>
              </div>
            </div>
          )}

          {/* Mobile overlay title */}
          <div className="absolute inset-x-0 bottom-0 sm:hidden">
            <div className="min-h-28 rounded-t-[2.5rem] bg-oregon-900/35 px-5 py-8 text-oregon-50 shadow-md ring-1 ring-white/10 backdrop-blur-sm">
              <p className="text-lg font-extrabold leading-tight">
                {product.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 rounded-t-3xl bg-background px-6 pb-8 pt-6 text-oregon-900 sm:rounded-3xl sm:bg-[#fffaf5] sm:px-10 sm:py-10 sm:shadow-lg sm:ring-1 sm:ring-amber-900/10">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="hidden text-3xl font-extrabold text-oregon-900 sm:block sm:text-3xl">
              {product.name}
            </h1>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-extrabold text-oregon-800/90 sm:text-lg">
                {t("descriptionLabel")}
              </p>
              {product.description && (
                <p className="text-lg font-medium leading-relaxed text-oregon-700/80 line-clamp-3 sm:text-lg">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          {/* Size */}
          <div className="flex items-start gap-4">
            <p className="shrink-0 pt-2 text-lg font-extrabold text-oregon-800/90 sm:text-lg">
              {t("sizeLabel")}
            </p>
            <div className="flex flex-1 flex-wrap gap-2">
              {PRODUCT_SIZES.map((s) => (
                <Button
                  key={s.value}
                  type="button"
                  size="sm"
                  aria-pressed={size === s.value}
                  onClick={() => setSize(s.value as ProductSize)}
                  variant={size === s.value ? "chocolate" : "chocolate-outline"}
                  className={cn(
                    "h-auto rounded-full px-5 py-2.5 text-base font-semibold sm:text-base",
                  )}
                >
                  <span className="inline-flex items-center justify-center gap-1">
                    {s.label}
                    {s.priceModifier > 0 && (
                      <span
                        className={cn(
                          "text-sm sm:text-xs",
                          size === s.value
                            ? "text-white/80"
                            : "text-oregon-700/70",
                        )}
                      >
                        +${s.priceModifier.toFixed(2)}
                      </span>
                    )}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-lg font-extrabold text-oregon-800/90 sm:text-lg">
              {t("quantityLabel")}
            </span>
            <div className="flex items-center gap-1 rounded-full border border-oregon-700/20 bg-white p-1 shadow-sm">
              <Button
                type="button"
                size="icon-sm"
                variant="chocolate-outline"
                aria-label={t("decrease")}
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="rounded-full bg-transparent text-oregon-800 hover:bg-oregon-50 disabled:opacity-40"
              >
                <Minus className="size-4" />
              </Button>
              <div className="min-w-12 px-3 text-center text-base font-bold text-oregon-900 sm:text-sm">
                {quantity}
              </div>
              <Button
                type="button"
                size="icon-sm"
                variant="chocolate-outline"
                aria-label={t("increase")}
                onClick={() => setQuantity((q) => q + 1)}
                className="rounded-full bg-transparent text-oregon-800 hover:bg-oregon-50"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          {/* Price + Add to order */}
          <div className="flex flex-row items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-base font-bold text-oregon-700/90 sm:text-base">
                {t("totalLabel")}
              </p>
              <p className="text-4xl font-extrabold text-oregon-900 sm:text-4xl">
                ${lineTotal.toFixed(2)}
              </p>
            </div>
            <Button
              variant="dive"
              size="xl"
              className="w-auto rounded-full px-10 py-5 text-lg font-semibold sm:text-lg"
              onClick={handleAddToOrder}
            >
              {t("addToOrder")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
