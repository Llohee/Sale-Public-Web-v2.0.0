"use client";

import { BANNER_BACKGROUND_URL, PRODUCT_LIST_PAGE_SIZE } from "@/constants/product";
import { useFilter } from "@/providers/filter-provider";
import {
  useGetAllProductCategories,
  useInfiniteProductList,
} from "@/services/product/product.query-options";
import type { ProductDetail } from "@/services/product/product.schema";
import { LoadingPage } from "@/share/components/full-page/loading";
import NotFoundPage from "@/share/components/full-page/404";
import { cn } from "@/share/lib/utils";
import { Button } from "@/share/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/free-mode";
import { Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "./card";

export function ProductsWrapper() {
  const t = useTranslations("ProductPage");
  const { filter, updateParam } = useFilter();
  const selectedCategoryId = filter.productCategoryId?.trim() || undefined;
  const categorySwiperRef = useRef<SwiperClass | null>(null);
  const productSwiperRef = useRef<SwiperClass | null>(null);
  const isUserSwipingProductRef = useRef(false);
  /** Autoplay category strip chỉ trên mobile (dưới breakpoint `md`). */
  const [isMobileCategoryStrip, setIsMobileCategoryStrip] = useState(false);
  const [productViewportWidth, setProductViewportWidth] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileCategoryStrip(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setProductViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const productListFilter = useMemo(
    () => ({ ...filter, limit: PRODUCT_LIST_PAGE_SIZE }),
    [filter],
  );

  const {
    data: productCategories,
    isLoading: isLoadingProductCategories,
    isError: isErrorProductCategories,
    isSuccess: isSuccessProductCategories,
  } = useGetAllProductCategories();
  const {
    data: productsPages,
    isPending: isPendingProducts,
    isError: isErrorProducts,
    isSuccess: isSuccessProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProductList(productListFilter);

  const flatProducts = useMemo(
    () => productsPages?.pages.flatMap((p) => p.data) ?? [],
    [productsPages],
  );

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
  const productsCount = flatProducts.length;

  const productSwiperConfig = useMemo(() => {
    if (productViewportWidth >= 1280) return { slidesPerView: 4, spaceBetween: 32 };
    if (productViewportWidth >= 1024) return { slidesPerView: 3, spaceBetween: 28 };
    if (productViewportWidth >= 640) return { slidesPerView: 2, spaceBetween: 24 };
    return { slidesPerView: productsCount > 1 ? 1.2 : 1, spaceBetween: 8 };
  }, [productViewportWidth, productsCount]);

  const productLoopEnabled =
    !hasNextPage &&
    flatProducts.length > Math.ceil(productSwiperConfig.slidesPerView);
  const shouldShowInitialLoading =
    (isPendingProducts && !productsPages) ||
    (isLoadingProductCategories && !productCategories);

  useEffect(() => {
    const swiper = productSwiperRef.current;
    if (!swiper) return;
    requestAnimationFrame(() => {
      swiper.update();
      swiper.updateSlides();
      swiper.updateProgress();
    });
  }, [productViewportWidth, productsCount, productSwiperConfig.slidesPerView, productSwiperConfig.spaceBetween]);

  useEffect(() => {
    const swiper = categorySwiperRef.current;
    if (!swiper) return;
    if (selectedCategoryId !== undefined) return;
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
    const shouldAutoplay =
      isMobileCategoryStrip && selectedCategoryId === undefined;
    if (shouldAutoplay) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
  }, [isMobileCategoryStrip, selectedCategoryId]);

  if (shouldShowInitialLoading) {
    return <LoadingPage />;
  }

  if (isErrorProducts || isErrorProductCategories) {
    return <NotFoundPage />;
  }

  if (isSuccessProducts && isSuccessProductCategories) {
    return (
      <div className="flex min-h-0 min-w-0 w-full flex-col">
        <div className="relative flex h-[min(38vh,240px)] min-h-[200px] shrink-0 items-center justify-center overflow-hidden sm:h-[min(42vh,320px)] sm:min-h-[260px] md:h-[380px] md:min-h-0 lg:h-[400px]">
          <Image
            src={BANNER_BACKGROUND_URL}
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

        <div className="w-full min-w-0">
          <div className="container mx-auto min-w-0 px-4 py-5 sm:py-6">
            <div
              role="region"
              aria-label={t("filter.categories_region")}
              className="relative w-full min-w-0 overflow-x-hidden overflow-y-visible py-2 sm:py-3"
            >
              <Swiper
                modules={[Autoplay, FreeMode]}
                slidesPerView="auto"
                spaceBetween={6}
                noSwiping={false}
                freeMode={{ enabled: true, momentumRatio: 0.65 }}
                autoplay={
                  isMobileCategoryStrip && selectedCategoryId === undefined
                    ? {
                        delay: 2200,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                loop={
                  filterOptions.length > 4 &&
                  isMobileCategoryStrip &&
                  selectedCategoryId === undefined
                }
                watchOverflow={false}
                className="category-filter-swiper w-full min-w-0 touch-pan-x [&_.swiper]:min-w-0 [&_.swiper-scrollbar]:hidden"
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
                      className="w-auto! py-1!"
                    >
                      <Button
                        variant={selected ? "chocolate" : "chocolate-outline"}
                        size="lg"
                        className={cn(
                          "touch-pan-x rounded-[33px] px-3 py-1.5 sm:px-4 sm:py-2",
                        )}
                        onClick={() =>
                          updateParam("productCategoryId", optionValue, {
                            removeKeys: [
                              "category",
                              "productCategoryCode",
                              "page",
                            ],
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

            <div className="relative max-w-full min-w-0 overflow-x-hidden overflow-y-visible pb-4 pt-2 sm:pb-5 sm:pt-3">
              <Swiper
                modules={[Autoplay]}
                slidesPerView={productSwiperConfig.slidesPerView}
                spaceBetween={productSwiperConfig.spaceBetween}
                speed={420}
                watchOverflow={false}
                loop={productLoopEnabled}
                rewind={false}
                observer
                observeParents
                autoplay={{
                  delay: 2400,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  waitForTransition: true,
                }}
                className="product-list-swiper w-full"
                onSwiper={(instance) => {
                  productSwiperRef.current = instance;
                  requestAnimationFrame(() => {
                    instance.update();
                  });
                }}
                onReachEnd={() => {
                  if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                  }
                }}
                onSlideChangeTransitionEnd={(swiper) => {
                  if (
                    swiper.isEnd &&
                    hasNextPage &&
                    !isFetchingNextPage
                  ) {
                    fetchNextPage();
                  }
                }}
                onTouchStart={() => {
                  isUserSwipingProductRef.current = true;
                }}
                onTouchEnd={(instance) => {
                  if (!isUserSwipingProductRef.current) return;
                  isUserSwipingProductRef.current = false;
                  if (!instance.isEnd) return;
                  if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                  }
                }}
              >
                {flatProducts.map((product: ProductDetail) => (
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
