"use client";

import { useRef } from "react";
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
import { Button } from "@/share/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductsWrapper() {
  const t = useTranslations("ProductPage");
  const { filter, onSearchChange } = useFilter();
  const sliderRef = useRef<HTMLDivElement>(null);

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

  if (isLoadingProducts || isLoadingProductCategories) {
    return <LoadingPage />;
  }

  if (isErrorProducts || isErrorProductCategories) {
    return <div>Error loading products</div>;
  }

  if (isSuccessProducts && isSuccessProductCategories) {
    const scrollSlider = (direction: "left" | "right") => {
      const container = sliderRef.current;
      if (!container) return;

      const cardWidth = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    };

    return (
      <div className="flex min-h-screen flex-col ">
        <div className="relative overflow-hidden !h-[400px] flex items-center justify-center">
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
              <div className="flex items-center justify-between gap-3">
                <VercelTabs
                  tabs={productCategories?.data.map((category) => ({
                    label: category.name,
                    value: category.id,
                    content: <></>,
                  }))}
                  defaultTab="Overview"
                />
                <div className="hidden items-center gap-2 sm:flex">
                  <Button
                    type="button"
                    variant="chocolate-outline"
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => scrollSlider("left")}
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="chocolate-outline"
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => scrollSlider("right")}
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
              <div
                ref={sliderRef}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 py-3 scroll-px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {products?.data.map((product: ProductDetail) => (
                  <div
                    key={product.id}
                    className="w-[calc(100%-3rem)] shrink-0 snap-start sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)] xl:w-[calc(25%-0.9375rem)]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
