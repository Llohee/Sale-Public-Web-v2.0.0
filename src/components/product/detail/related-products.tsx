"use client";

import { ProductCard } from "@/components/product/card";
import type { ProductDetail } from "@/services/product/product.schema";
import { useTranslations } from "next-intl";

interface RelatedProductsProps {
  products: ProductDetail[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const t = useTranslations("product.detail");

  if (!products.length) return null;

  return (
    <section className="flex flex-col gap-6 pb-8 pt-2">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-2xl font-extrabold text-oregon-900">
          {t("relatedTitle")}
        </h2>
        <p className="text-sm text-oregon-700/70">{t("relatedSubtitle")}</p>
      </div>
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 py-3 scroll-px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {products.map((item) => (
          <div
            key={item.id}
            className="w-[calc(100%-3rem)] shrink-0 snap-start sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)] xl:w-[calc(25%-0.9375rem)]"
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

