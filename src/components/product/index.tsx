"use client";

import { useEffect, useMemo, useState } from "react";
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
import "swiper/css";

export function ProductsWrapper() {
  const t = useTranslations("ProductPage");
  const { filter, onSearchChange, updateParam } = useFilter();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [isPaused, setIsPaused] = useState(false);

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
        value: c.code,
        label: c.name,
      })),
    ];
  }, [productCategories, t]);

  useEffect(() => {
    if (!swiper) return;
    if (isPaused) return;
    if (!isSuccessProducts || !isSuccessProductCategories) return;

    const intervalId = window.setInterval(() => {
      swiper.slideNext();
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    swiper,
    isPaused,
    isSuccessProducts,
    isSuccessProductCategories,
  ]);

  if (isLoadingProducts || isLoadingProductCategories) {
    return <LoadingPage />;
  }

  if (isErrorProducts || isErrorProductCategories) {
    return <div>Error loading products</div>;
  }

  if (isSuccessProducts && isSuccessProductCategories) {
    const selectedCategory = filter.productCategoryCode?.trim() || undefined;
    return (
      <div className="flex min-h-screen flex-col ">
        <div className="relative overflow-hidden h-[400px]! flex items-center justify-center">
          <Image
            src="/images/background.jpg"
            alt="Hero banner"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 backdrop-blur-xs bg-linear-to-t from-oregon-900/70 via-oregon-900/30 to-amber-50/0" />
          <div className="container mx-auto relative px-4 py-12 sm:py-14">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-50/80">
                  Order Coffee
                </p>
                <h1 className="text-4xl font-extrabold tracking-tight text-amber-50 sm:text-5xl">
                  {t("title")}
                </h1>
                <p className="mt-2 text-sm text-amber-50/90 sm:text-base">
                  {t("subtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="order-2 md:order-1 flex items-center justify-between gap-3">
                <div className="w-full flex flex-nowrap items-center gap-2.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {filterOptions.map((option) => {
                    const optionValue = option.value?.trim() || undefined;
                    const selected = selectedCategory === optionValue;

                    return (
                      <Button
                        key={option.value}
                        variant={selected ? "chocolate" : "chocolate-outline"}
                        size="lg"
                        className={cn("rounded-[33px] px-4 py-2")}
                        onClick={() => updateParam("category", optionValue)}
                      >
                        {option.label}
                      </Button>
                    );
                  })}
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <SearchInput
                    value={filter.keyword}
                    onChange={onSearchChange}
                    placeholder={t("filter.search_placeholder")}
                    className="w-full md:max-w-md"
                  />
                </div>
              </div>

              <div className="relative overflow-hidden py-3">
                <div
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
                    {products?.data.map((product: ProductDetail) => (
                      <SwiperSlide key={product.id} className="h-auto!">
                        <ProductCard
                          product={product}
                          className="scale-[0.96] origin-top sm:scale-100"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
