"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/card";
import type { ProductDetail } from "@/services/product/product.schema";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";

interface RelatedProductsProps {
  products: ProductDetail[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const t = useTranslations("product.detail");
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!products.length) return;
    if (!swiper) return;
    if (isPaused) return;

    const intervalId = window.setInterval(() => {
      swiper.slideNext();
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [products.length, swiper, isPaused]);

  if (!products.length) return null;

  return (
    <section className="flex flex-col gap-6 pb-8 pt-2">
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-2xl font-extrabold text-oregon-900">
          {t("relatedTitle")}
        </h2>
        <p className="text-sm text-oregon-700/70">{t("relatedSubtitle")}</p>
      </div>
      <div
        className="relative overflow-hidden px-1 py-3"
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
      >
        <Swiper
          loop
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          onSwiper={(instance) => {
            setSwiper(instance);
          }}
          className="w-full"
        >
          {products.map((item) => (
            <SwiperSlide key={item.id} className="h-auto!">
              <ProductCard
                product={item}
                className="scale-[0.96] origin-top sm:scale-100"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

