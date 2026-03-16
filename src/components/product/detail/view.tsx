"use client";

import { Button } from "@/share/ui/button";
import { useCart } from "@/providers/cart-provider";
import { PRODUCT_SIZES, type ProductSize } from "@/types/cart";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ProductDetail } from "@/services/product/product.schema";
import { cn } from "@/share/lib/utils";

interface ProductDetailViewProps {
  product: ProductDetail;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<ProductSize>("M");
  const { addItem } = useCart();
  const unitPrice = product.price ?? 0;
  const sizeMod = PRODUCT_SIZES.find((s) => s.value === size)?.priceModifier ?? 0;
  const lineTotal = (unitPrice + sizeMod) * quantity;

  const handleAddToOrder = () => {
    addItem({ product, size, quantity });
  };

  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between px-4 py-3">
        <Link
          href="/product"
          className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted/80"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </Link>
      </header>

      <div className="relative flex shrink-0 justify-center px-4 pb-0">
        <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            width={320}
            height={320}
          />
        </div>
      </div>

      <div className="flex-1 rounded-t-3xl bg-oregon-950 px-6 pb-8 pt-6 text-oregon-50 dark:bg-oregon-900/95">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        {product.description && (
          <p className="mt-2 text-sm leading-relaxed text-oregon-200/90 line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Size */}
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-oregon-100">Size</p>
          <div className="flex flex-wrap gap-2">
            {PRODUCT_SIZES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSize(s.value as ProductSize)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors",
                  size === s.value
                    ? "border-oregon-400 bg-oregon-800/80 text-oregon-50"
                    : "border-oregon-700/50 bg-oregon-900/30 text-oregon-200 hover:bg-oregon-800/50"
                )}
              >
                {s.label}
                {s.priceModifier > 0 && (
                  <span className="ml-1 text-oregon-300">+${s.priceModifier.toFixed(2)}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm font-medium text-oregon-100">Số lượng</span>
          <div className="flex items-center gap-2 rounded-full border border-oregon-700/50 bg-oregon-900/30 p-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-8 items-center justify-center rounded-full text-oregon-200 hover:bg-oregon-800/50 hover:text-oregon-50"
              aria-label="Giảm"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-[2rem] text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex size-8 items-center justify-center rounded-full text-oregon-200 hover:bg-oregon-800/50 hover:text-oregon-50"
              aria-label="Tăng"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* Price + Add to order */}
        <div className="mt-6 flex flex-col gap-3">
          <div>
            <p className="text-xs font-medium text-oregon-200/90">Tổng</p>
            <p className="text-2xl font-bold">${lineTotal.toFixed(2)}</p>
          </div>
          <Button
            variant="dive"
            size="xl"
            className="w-full rounded-xl py-6 text-base font-semibold"
            onClick={handleAddToOrder}
          >
            Thêm vào đơn hàng
          </Button>
        </div>
      </div>
    </div>
  );
}
