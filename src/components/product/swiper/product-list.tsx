"use client";

import type { ProductDetail } from "@/services/product/product.schema";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/free-mode";
import { Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  PRODUCT_LIST_SWIPER_AUTOPLAY_DELAY_MS,
  PRODUCT_LIST_SWIPER_FREE_MODE_MINIMUM_VELOCITY,
  PRODUCT_LIST_SWIPER_FREE_MODE_MOMENTUM_RATIO,
  PRODUCT_LIST_SWIPER_FREE_MODE_MOMENTUM_VELOCITY_RATIO,
  PRODUCT_LIST_SWIPER_LONG_SWIPES_MS,
  PRODUCT_LIST_SWIPER_LONG_SWIPES_RATIO,
  PRODUCT_LIST_SWIPER_LAYOUT_BY_BREAKPOINT,
  PRODUCT_LIST_SWIPER_RESISTANCE_RATIO,
  PRODUCT_LIST_SWIPER_TOUCH_RATIO,
  PRODUCT_LIST_SWIPER_TOUCH_THRESHOLD_PX,
  PRODUCT_LIST_SWIPER_TRANSITION_MS,
  PRODUCT_LIST_SWIPER_WRAPPER_EASING,
} from "@/constants/product";
import { Progress } from "@/share/ui/progress";
import { ProductCard } from "../card";

type SwiperLayout = {
  slidesPerView: number;
  spaceBetween: number;
};

function layoutForViewport(width: number, productCount: number): SwiperLayout {
  for (const row of PRODUCT_LIST_SWIPER_LAYOUT_BY_BREAKPOINT) {
    if (width >= row.minWidth) {
      return {
        slidesPerView: row.slidesPerView,
        spaceBetween: row.spaceBetween,
      };
    }
  }
  return {
    slidesPerView: productCount > 1 ? 1.35 : 1,
    spaceBetween: 0,
  };
}

function useWindowInnerWidth(): number {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    schedule();
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return width;
}

function refreshSwiperLayout(swiper: SwiperClass): number {
  return requestAnimationFrame(() => {
    if (swiper.destroyed || !swiper.el || !swiper.wrapperEl) return;
    swiper.update();
    if (swiper.destroyed || !swiper.slides) return;
    swiper.updateSlides();
    swiper.updateProgress();
  });
}

type ProductListSwiperProps = {
  products: ProductDetail[];
  totalElements: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export function ProductListSwiper({
  products,
  totalElements,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: ProductListSwiperProps) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const isUserSwipingRef = useRef(false);
  const viewportWidth = useWindowInnerWidth();
  const productCount = products.length;
  const [progressPercent, setProgressPercent] = useState(0);

  const layout = useMemo(
    () => layoutForViewport(viewportWidth, productCount),
    [viewportWidth, productCount],
  );

  const loopEnabled =
    !hasNextPage && productCount > Math.ceil(layout.slidesPerView);
  const normalizedTotal = Math.max(totalElements, productCount, 1);

  const canFetchNext = hasNextPage && !isFetchingNextPage;
  const tryFetchNext = useCallback(() => {
    if (canFetchNext) fetchNextPage();
  }, [canFetchNext, fetchNextPage]);
  const updateProgressBySwiper = useCallback(
    (swiper: SwiperClass) => {
      if (swiper.isEnd && !hasNextPage) {
        setProgressPercent(100);
        return;
      }
      const clampedProgress = Math.min(1, Math.max(0, swiper.progress || 0));
      const loadedShare = Math.min(productCount / normalizedTotal, 1);
      const nextPercent = hasNextPage
        ? clampedProgress * loadedShare * 100
        : clampedProgress * 100;
      setProgressPercent(Math.min(100, Math.max(0, nextPercent)));
    },
    [hasNextPage, normalizedTotal, productCount],
  );

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    const rafId = refreshSwiperLayout(swiper);
    return () => cancelAnimationFrame(rafId);
  }, [viewportWidth, productCount, layout.slidesPerView, layout.spaceBetween]);

  return (
    <div className="relative flex flex-col gap-4 overflow-x-hidden overflow-y-visible bg-white pb-4 pt-2 sm:pb-5 sm:pt-3">
      <Progress value={progressPercent} />
      <Swiper
        modules={[FreeMode]}
        slidesPerView={layout.slidesPerView}
        spaceBetween={layout.spaceBetween}
        speed={PRODUCT_LIST_SWIPER_TRANSITION_MS}
        watchOverflow={false}
        // loop={loopEnabled}
        rewind={false}
        observer
        observeParents
        grabCursor
        passiveListeners
        roundLengths
        touchRatio={PRODUCT_LIST_SWIPER_TOUCH_RATIO}
        threshold={PRODUCT_LIST_SWIPER_TOUCH_THRESHOLD_PX}
        followFinger
        shortSwipes
        longSwipes
        longSwipesRatio={PRODUCT_LIST_SWIPER_LONG_SWIPES_RATIO}
        resistanceRatio={PRODUCT_LIST_SWIPER_RESISTANCE_RATIO}
        longSwipesMs={PRODUCT_LIST_SWIPER_LONG_SWIPES_MS}
        freeMode={{
          enabled: true,
          sticky: true,
          momentum: true,
          momentumRatio: PRODUCT_LIST_SWIPER_FREE_MODE_MOMENTUM_RATIO,
          momentumVelocityRatio:
            PRODUCT_LIST_SWIPER_FREE_MODE_MOMENTUM_VELOCITY_RATIO,
          momentumBounce: false,
          minimumVelocity: PRODUCT_LIST_SWIPER_FREE_MODE_MINIMUM_VELOCITY,
        }}
        style={
          {
            "--swiper-wrapper-transition-timing-function":
              PRODUCT_LIST_SWIPER_WRAPPER_EASING,
          } as CSSProperties
        }
        // autoplay={{
        //   delay: PRODUCT_LIST_SWIPER_AUTOPLAY_DELAY_MS,
        //   disableOnInteraction: false,
        //   pauseOnMouseEnter: true,
        //   waitForTransition: true,
        // }}
        className="product-list-swiper w-full touch-pan-x"
        onSwiper={(instance) => {
          swiperRef.current = instance;
          requestAnimationFrame(() => {
            if (instance.destroyed) return;
            instance.update();
            updateProgressBySwiper(instance);
          });
        }}
        onSlideChange={(swiper) => {
          updateProgressBySwiper(swiper);
        }}
        onReachEnd={tryFetchNext}
        onSlideChangeTransitionEnd={(swiper) => {
          if (swiper.isEnd) tryFetchNext();
        }}
        onTouchStart={() => {
          isUserSwipingRef.current = true;
        }}
        onTouchEnd={(swiper) => {
          if (!isUserSwipingRef.current) return;
          isUserSwipingRef.current = false;
          if (swiper.isEnd) tryFetchNext();
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="h-auto! px-3 sm:px-0">
            <ProductCard
              product={product}
              className="origin-top bg-stone-100 shadow-none"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
