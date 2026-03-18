"use client";

import { Button } from "@/share/ui/button";
import { useCart } from "@/providers/cart-provider";
import { PRODUCT_SIZES, type ProductSize } from "@/types/cart";
import { Link, useRouter } from "@/i18n/navigation";
import { useGetAllProducts } from "@/services/product/product.query-options";
import { ChevronLeft, ImageOff, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { ProductDetail } from "@/services/product/product.schema";
import { cn } from "@/share/lib/utils";
import { RelatedProducts } from "./related-products";
import { Badge } from "@/share/ui/badge";

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
  const { data: allProducts } = useGetAllProducts({ limit: 10, offset: 0 });
  const sizeMod =
    PRODUCT_SIZES.find((s) => s.value === size)?.priceModifier ?? 0;
  const lineTotal = (unitPrice + sizeMod) * quantity;
  const relatedProducts = useMemo(
    () =>
      (allProducts?.data ?? []).filter(
        (item) =>
          item.id !== product.id &&
          item.productCategoryId === product.productCategoryId,
      ),
    [allProducts?.data, product.id, product.productCategoryId],
  );

  const handleAddToOrder = () => {
    addItem({ product, size, quantity });
    router.push("/order");
  };

  return (
    <div className="container mx-auto py-28 flex flex-col gap-8">
      <div className="grid grid-cols-12 gap-4">
        <div className="flex flex-col gap-6 sm:gap-8 col-span-7">
          <Button
            variant="default"
            size="sm"
            onClick={() => router.back()}
            className="hidden sm:inline-flex"
          >
            <ChevronLeft className="size-5" />
            <span className="text-sm font-semibold">{t("back")}</span>
          </Button>
          <div className="grid grid-cols-2 h-full gap-8">
            <div className="flex flex-col gap-8 h-full justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-end gap-4">
                  <h1 className="text-5xl font-extrabold text-oregon-800 truncate">
                    {product.name}
                  </h1>
                </div>
                <p className="text-2xl font-extrabold text-oregon-900">
                  ${lineTotal.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-start gap-2">
                  <p className="text-md leading-none text-oregon-900 sm:text-lg">
                    {t("sizeLabel")}
                  </p>
                  <div className="flex flex-1 flex-wrap gap-3">
                    {PRODUCT_SIZES.map((s) => (
                      <Button
                        key={s.value}
                        type="button"
                        size="sm"
                        aria-pressed={size === s.value}
                        onClick={() => setSize(s.value as ProductSize)}
                        variant={
                          size === s.value ? "chocolate" : "chocolate-outline"
                        }
                        className={cn(
                          "rounded-full px-8 text-md font-semibold",
                        )}
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          {s.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <span className="text-lg leading-none text-oregon-900 sm:text-lg">
                    {t("quantityLabel")}
                  </span>
                  <div className="flex items-center gap-3 bg-white">
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
                    <div className="text-center text-xl font-bold text-oregon-900">
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
                <Button
                  variant="dive"
                  size="xl"
                  className="w-full rounded-full px-8 py-2 text-lg font-semibold gap-4"
                  onClick={handleAddToOrder}
                >
                  <ShoppingCart className="size-5" />
                  {t("addToOrder")}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Badge variant="outline" className="text-md px-3 h-fit">
                {product.productCategoryName}
              </Badge>
              <p className="text-lg font-medium italic leading-relaxed text-oregon-700/80 sm:text-lg">
                {product.description}
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-full h-full overflow-hidden rounded-2xl bg-muted sm:rounded-3xl sm:shadow-lg sm:ring-1 sm:ring-black/5 lg:max-w-none col-span-5">
          {hasImage && !imageErrored ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              fill
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

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
