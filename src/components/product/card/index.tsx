"use client";

import { cn } from "@/share/lib/utils";
import { Link } from "@/i18n/navigation";
import { Plus, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductDetail } from "@/services/product/product.schema";

interface ProductCardProps {
  product: ProductDetail;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const t = useTranslations("ProductPage");

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/20",
        className,
      )}
    >
      <div className="relative p-4 pb-0">
        <div className="relative mx-auto aspect-square w-full max-w-[140px] overflow-hidden rounded-full bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
          />
          <div className="absolute right-1 top-1 flex items-center gap-0.5 rounded-full bg-foreground/90 px-1.5 py-0.5 text-[10px] font-medium text-background">
            <Star className="size-3 fill-current" aria-hidden />
            {/* {product.rating ?? 0} */}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="font-semibold text-foreground">{product.name}</h3>
        {/* {product.subtitle && (
          <p className="text-xs text-muted-foreground">{product.subtitle}</p>
        )} */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <span className="text-base font-semibold text-foreground">
            ${product.price?.toFixed(2) ?? 0}
          </span>
          <Link
            href={`/product/${product.id}`}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-900 text-amber-50 shadow-sm hover:bg-amber-950 hover:shadow-md [&_svg]:size-4"
            aria-label={t("addToCart")}
          >
            <Plus aria-hidden />
          </Link>
        </div>
      </div>
    </Link>
  );
}
