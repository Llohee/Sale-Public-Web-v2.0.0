"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/card";
import type { ProductDetail } from "@/services/product/product.schema";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/share/ui/carousel";

interface RelatedProductsProps {
  products: ProductDetail[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const t = useTranslations("product.detail");
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!products.length) return;
    if (!carouselApi) return;
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [products.length, carouselApi, isPaused]);

  if (!products.length) return null;

  return (
    <section className="flex flex-col gap-6 pb-8 pt-2">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-2xl font-extrabold text-oregon-900">
          {t("relatedTitle")}
        </h2>
        <p className="text-sm text-oregon-700/70">{t("relatedSubtitle")}</p>
      </div>
      <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="px-1 py-3">
        <CarouselContent
          className="gap-5"
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => setIsPaused(false)}
        >
          {products.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-[calc(100%-3rem)] shrink-0 sm:basis-[calc(50%-0.625rem)] lg:basis-[calc(33.333%-0.875rem)] xl:basis-[calc(25%-0.9375rem)]"
            >
              <ProductCard product={item} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          variant="chocolate-outline"
          size="icon-sm"
          className="hidden rounded-full sm:flex -left-3"
        />
        <CarouselNext
          variant="chocolate-outline"
          size="icon-sm"
          className="hidden rounded-full sm:flex -right-3"
        />
      </Carousel>
    </section>
  );
}

