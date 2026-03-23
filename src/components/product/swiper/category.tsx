'use client';

import {
  CATEGORY_SWIPER_AUTOPLAY_DELAY_MS,
  CATEGORY_SWIPER_FREE_MODE_MOMENTUM_RATIO,
  CATEGORY_SWIPER_FREE_MODE_MOMENTUM_VELOCITY_RATIO,
  CATEGORY_SWIPER_LOOP_MIN_SLIDES,
  CATEGORY_SWIPER_MOBILE_MAX_WIDTH_PX,
  CATEGORY_SWIPER_SLIDE_TO_SPEED_MS,
  CATEGORY_SWIPER_SPACE_BETWEEN,
  PRODUCT_LIST_SWIPER_RESISTANCE_RATIO,
  PRODUCT_LIST_SWIPER_WRAPPER_EASING,
} from '@/constants/product';
import { cn } from '@/share/lib/utils';
import { Button } from '@/share/ui/button';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';
import { Autoplay, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const PRODUCT_CATEGORY_FILTER_PARAM_KEY = 'productCategoryId';

const PRODUCT_CATEGORY_FILTER_REMOVE_KEYS = [
  'category',
  'productCategoryCode',
  'page',
] as const;

export function normalizeProductCategoryFilterValue(
  value: string | undefined | null,
): string | undefined {
  return value?.trim() || undefined;
}

function indexOfProductCategoryFilterOption(
  options: readonly { value: string }[],
  selectedCategoryId: string | undefined,
): number {
  return options.findIndex(
    (o) => normalizeProductCategoryFilterValue(o.value) === selectedCategoryId,
  );
}

export type CategoryFilterOption = {
  value: string;
  label: string;
};

type CategoryFilterSwiperProps = {
  options: CategoryFilterOption[];
  selectedCategoryId: string | undefined;
  categoriesRegionLabel: string;
  updateParam: (key: string, value?: string, options?: { removeKeys?: string[] }) => void;
};

export function CategoryFilterSwiper({
  options,
  selectedCategoryId,
  categoriesRegionLabel,
  updateParam,
}: CategoryFilterSwiperProps) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isMobileStrip, setIsMobileStrip] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      `(max-width: ${CATEGORY_SWIPER_MOBILE_MAX_WIDTH_PX}px)`,
    );
    const update = () => setIsMobileStrip(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const stripAutoplayActive =
    isMobileStrip && selectedCategoryId === undefined;

  const autoplayConfig = useMemo(
    () =>
      stripAutoplayActive
        ? {
            delay: CATEGORY_SWIPER_AUTOPLAY_DELAY_MS,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }
        : false,
    [stripAutoplayActive],
  );

  const loopEnabled =
    options.length > CATEGORY_SWIPER_LOOP_MIN_SLIDES &&
    stripAutoplayActive;

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    const idx = indexOfProductCategoryFilterOption(options, selectedCategoryId);
    if (idx >= 0) {
      swiper.slideTo(idx, CATEGORY_SWIPER_SLIDE_TO_SPEED_MS);
    }
  }, [selectedCategoryId, options]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper?.autoplay) return;
    if (stripAutoplayActive) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
  }, [stripAutoplayActive]);

  return (
    <div
      role='region'
      aria-label={categoriesRegionLabel}
      className='relative w-full min-w-0 overflow-x-hidden overflow-y-visible py-2 sm:py-3'
    >
      <Swiper
        modules={[Autoplay, FreeMode]}
        slidesPerView='auto'
        spaceBetween={CATEGORY_SWIPER_SPACE_BETWEEN}
        noSwiping={false}
        grabCursor
        passiveListeners
        roundLengths
        resistanceRatio={PRODUCT_LIST_SWIPER_RESISTANCE_RATIO}
        style={
          {
            '--swiper-wrapper-transition-timing-function':
              PRODUCT_LIST_SWIPER_WRAPPER_EASING,
          } as CSSProperties
        }
        freeMode={{
          enabled: true,
          momentum: true,
          momentumRatio: CATEGORY_SWIPER_FREE_MODE_MOMENTUM_RATIO,
          momentumVelocityRatio: CATEGORY_SWIPER_FREE_MODE_MOMENTUM_VELOCITY_RATIO,
          momentumBounce: true,
          momentumBounceRatio: 0.92,
          minimumVelocity: 0.015,
        }}
        autoplay={autoplayConfig}
        loop={loopEnabled}
        watchOverflow={false}
        className='category-filter-swiper w-full min-w-0 touch-pan-x [&_.swiper]:min-w-0 [&_.swiper-scrollbar]:hidden'
        wrapperClass='!flex items-center'
        onSwiper={(instance) => {
          swiperRef.current = instance;
        }}
      >
        {options.map((option) => {
          const optionValue = normalizeProductCategoryFilterValue(option.value);
          const selected = selectedCategoryId === optionValue;

          return (
            <SwiperSlide key={option.value || 'all'} className='w-auto! py-1!'>
              <Button
                variant={selected ? 'chocolate' : 'chocolate-outline'}
                size='lg'
                className={cn('touch-pan-x rounded-[33px] px-3 py-1.5 sm:px-4 sm:py-2')}
                onClick={() =>
                  updateParam(PRODUCT_CATEGORY_FILTER_PARAM_KEY, optionValue, {
                    removeKeys: [...PRODUCT_CATEGORY_FILTER_REMOVE_KEYS],
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
  );
}
