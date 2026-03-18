"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useFilter } from "@/providers/filter-provider";
import {
  useGetAllProductCategories,
  useGetAllProducts,
} from "@/services/product/product.query-options";
import type { ProductDetail } from "@/services/product/product.schema";
import SearchInput from "@/share/components/input/search";
import { VercelTabs } from "@/share/ui/vercel-tabs";
import { useTranslations } from "next-intl";
import { ProductCard } from "./card";
import { LoadingPage } from "@/share/components/full-page/loading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/share/ui/carousel";

export function ProductsWrapper() {
  const t = useTranslations("ProductPage");
  const { filter, onSearchChange } = useFilter();
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
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

  useEffect(() => {
    if (!carouselApi) return;
    if (isPaused) return;
    if (!isSuccessProducts || !isSuccessProductCategories) return;

    const intervalId = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    carouselApi,
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
          {/* <div className="absolute inset-0 bg-gradient-to-b from-oregon-900/70 via-oregon-900/30 to-amber-50/0" /> */}
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

        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <SearchInput
                  value={filter.keyword}
                  onChange={onSearchChange}
                  placeholder={t("filter.search_placeholder")}
                  className="max-w-md"
                />
              </div>
              <div className="flex items-center gap-3">
                <VercelTabs
                  tabs={productCategories?.data.map((category) => ({
                    label: category.name,
                    value: category.id,
                    content: <></>,
                  }))}
                  defaultTab="Overview"
                />
              </div>

              <Carousel
                className="px-1 py-3"
                opts={{ loop: true }}
                setApi={setCarouselApi}
              >
                <CarouselContent
                  className="gap-5"
                  onPointerEnter={() => setIsPaused(true)}
                  onPointerLeave={() => setIsPaused(false)}
                >
                  {products?.data.map((product: ProductDetail) => (
                    <CarouselItem
                      key={product.id}
                      className="basis-[calc(100%-3rem)] shrink-0 sm:basis-[calc(50%-0.625rem)] lg:basis-[calc(33.333%-0.875rem)] xl:basis-[calc(25%-0.9375rem)]"
                    >
                      <ProductCard product={product} />
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}
