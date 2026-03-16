"use client";

import Image from "next/image";
import { cn } from "@/share/lib/utils";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductDetail } from "@/services/product/product.schema";

interface ProductCardProps {
  product: ProductDetail;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const t = useTranslations("ProductPage");
  const price = product.price ?? 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        "group flex h-full flex-col gap-4 overflow-hidden rounded-[28px] border border-border/50 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5",
        className,
      )}
    >
      <div className="relative px-5 pt-5">
        <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-[24px] bg-linear-to-br from-amber-100 via-orange-50 to-stone-100">
          <div className="absolute inset-x-12 bottom-4 h-4 rounded-full bg-black/10 blur-xl" />
          <div className="absolute inset-11">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 pb-4">
        <div className="space-y-1.5">
          <h3 className="line-clamp-1 text-base font-semibold text-foreground">
            {product.name}
          </h3>
          {/* {product.subtitle && (
          <p className="text-xs text-muted-foreground">{product.subtitle}</p>
          )} */}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{t("addToCart")}</span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              ${price.toFixed(2)}
            </span>
          </div>

          <span
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-900 text-amber-50 shadow-sm transition-colors group-hover:bg-amber-950 [&_svg]:size-4"
            aria-hidden
          >
            <Plus />
          </span>
        </div>
      </div>
    </Link>
  );
}
