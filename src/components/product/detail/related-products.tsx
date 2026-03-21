"use client";

import { ProductCard } from "@/components/product/card";
import type { ProductDetail } from "@/services/product/product.schema";
import { useTranslations } from "next-intl";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
      <div className="relative overflow-hidden px-1 py-3">
        <Swiper
          modules={[Autoplay]}
          loop={false}
          rewind={products.length > 1}
          slidesPerView={1}
          spaceBetween={20}
          speed={420}
          watchOverflow={false}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            waitForTransition: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
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

