"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useFilter } from "@/providers/filter-provider";
import {
  useGetAllProductCategories,
  useGetAllProducts,
} from "@/services/product/product.query-options";
import type { ProductDetail } from "@/services/product/product.schema";
import SearchInput from "@/share/components/input/search";
import { cn } from "@/share/lib/utils";
import { Button } from "@/share/ui/button";
import { useTranslations } from "next-intl";
import { ProductCard } from "./card";
import { LoadingPage } from "@/share/components/full-page/loading";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";

export function ProductsWrapper() {
  const t = useTranslations("ProductPage");
  const { filter, onSearchChange, updateParam } = useFilter();
  const selectedCategoryId = filter.productCategoryId?.trim() || undefined;
  const categorySwiperRef = useRef<SwiperClass | null>(null);
  /** Autoplay category strip chỉ trên mobile (dưới breakpoint `md`). */
  const [isMobileCategoryStrip, setIsMobileCategoryStrip] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileCategoryStrip(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const {
    data: productCategories,
    isLoading: isLoadingProductCategories,
    isError: isErrorProductCategories,
    isSuccess: isSuccessProductCategories,
  } = useGetAllProductCategories();
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    isSuccess: isSuccessProducts,
  } = useGetAllProducts(filter);

  const filterOptions = useMemo(() => {
    const categories = productCategories?.data ?? [];

    return [
      { value: "", label: t("filter.all") },
      ...categories.map((c) => ({
        value: c.id,
        label: c.name,
      })),
    ];
  }, [productCategories, t]);

  useEffect(() => {
    const swiper = categorySwiperRef.current;
    if (!swiper) return;
    const idx = filterOptions.findIndex(
      (o) => (o.value?.trim() || undefined) === selectedCategoryId,
    );
    if (idx >= 0) {
      swiper.slideTo(idx, 300);
    }
  }, [selectedCategoryId, filterOptions]);

  useEffect(() => {
    const swiper = categorySwiperRef.current;
    if (!swiper?.autoplay) return;
    if (isMobileCategoryStrip) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
  }, [isMobileCategoryStrip]);

  if (isLoadingProducts || isLoadingProductCategories) {
    return <LoadingPage />;
  }

  if (isErrorProducts || isErrorProductCategories) {
    return <div>Error loading products</div>;
  }

  if (isSuccessProducts && isSuccessProductCategories) {
    return (
      <div className="flex min-h-0 w-full flex-col">
        <div className="relative flex h-[min(38vh,240px)] min-h-[200px] shrink-0 items-center justify-center overflow-hidden sm:h-[min(42vh,320px)] sm:min-h-[260px] md:h-[380px] md:min-h-0 lg:h-[400px]">
          <Image
            src="/images/background.jpg"
            alt="Hero banner"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 backdrop-blur-xs bg-linear-to-t from-oregon-900/70 via-oregon-900/30 to-amber-50/0" />
          <div className="container relative mx-auto px-4 py-6 sm:py-10 md:py-12 lg:py-14">
            <div className="flex flex-col gap-2 sm:gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-50/80 sm:text-xs">
                  Order Coffee
                </p>
                <h1 className="text-2xl font-extrabold tracking-tight text-amber-50 sm:text-4xl md:text-5xl">
                  {t("title")}
                </h1>
                <p className="mt-1 text-xs text-amber-50/90 sm:mt-2 sm:text-sm md:text-base">
                  {t("subtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="container mx-auto px-4 py-8">
            <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:gap-x-6">
              <div className="order-2 min-w-0 max-w-full shrink-0 overflow-hidden md:order-1">
                <Swiper
                  modules={[Autoplay, FreeMode]}
                  slidesPerView="auto"
                  spaceBetween={10}
                  freeMode={{ enabled: true, momentumRatio: 0.65 }}
                  autoplay={
                    isMobileCategoryStrip
                      ? {
                          delay: 2800,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true,
                        }
                      : false
                  }
                  loop={filterOptions.length > 4 && isMobileCategoryStrip}
                  watchOverflow
                  className="category-filter-swiper w-full [&_.swiper-scrollbar]:hidden"
                  wrapperClass="!flex items-center"
                  onSwiper={(instance) => {
                    categorySwiperRef.current = instance;
                  }}
                >
                  {filterOptions.map((option) => {
                    const optionValue = option.value?.trim() || undefined;
                    const selected = selectedCategoryId === optionValue;

                    return (
                      <SwiperSlide
                        key={option.value || "all"}
                        className="w-auto!"
                      >
                        <Button
                          variant={selected ? "chocolate" : "chocolate-outline"}
                          size="lg"
                          className={cn("rounded-[33px] px-4 py-2")}
                          onClick={() =>
                            updateParam("productCategoryId", optionValue, {
                              removeKeys: ["category", "productCategoryCode"],
                            })
                          }
                        >
                          {option.label}
                        </Button>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              <div
                className="hidden shrink-0 md:order-2 md:block md:w-60"
                aria-hidden
              />
              <div className="order-1 md:order-3 min-w-0 flex-1 w-full">
                <SearchInput
                  value={filter.keyword}
                  onChange={onSearchChange}
                  placeholder={t("filter.search_placeholder")}
                  className="w-full"
                />
              </div>
            </div>

            <div className="relative overflow-hidden py-6">
              <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                spaceBetween={14}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 20 },
                  1280: { slidesPerView: 4, spaceBetween: 20 },
                }}
                watchOverflow={false}
                loop={false}
                rewind={products.data.length > 1}
                autoplay={
                  products.data.length > 1
                    ? {
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                className="w-full"
              >
                {products.data.map((product: ProductDetail) => (
                  <SwiperSlide key={product.id} className="h-auto!">
                    <ProductCard
                      product={product}
                      className="scale-[0.9] origin-top sm:scale-100"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
