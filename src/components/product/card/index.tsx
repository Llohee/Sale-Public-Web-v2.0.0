"use client";

import Image from "next/image";
import { cn } from "@/share/lib/utils";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductDetail } from "@/services/product/product.schema";
import { AddToCartDrawer } from "./card-drawer";

interface ProductCardProps {
  product: ProductDetail;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const t = useTranslations("ProductPage");
  const price = product.price ?? 0;

  return (
    <div
      className={cn(
        "relative group max-w-[220px] flex h-full flex-col overflow-hidden rounded-2xl bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5",
        className,
      )}
    >
      <Link href={`/product/${product.id}`} className="block flex-1">
        <div className="p-3 flex items-center justify-center">
          <Image
            src={product.imageUrl}
            alt={product.name}
            className="min-h-[200px] object-cover rounded-xl"
            width={200}
            height={200}
          />
        </div>
        <div className="px-3">
          <div className="font-bold text-xl leading-8">{product.name}</div>
        </div>
      </Link>

      <div className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1 px-3 py-2 items-start justify-start">
            <div className="text-xs text-muted-foreground">
              {t("addToCart")}
            </div>
            <div className="text-lg font-bold tracking-tight text-foreground">
              ${price.toFixed(2)}
            </div>
          </div>

          <AddToCartDrawer
            product={product}
            trigger={
              <button
                type="button"
                className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-[20px_0px_10px_00px] bg-oregon-700 px-3 text-base font-medium text-white hover:bg-oregon-600"
              >
                <Plus className="size-8" />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
