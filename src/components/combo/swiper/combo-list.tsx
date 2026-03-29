'use client';

import {
  COMBO_SWIPER_FALLBACK_SLIDES_PER_VIEW,
  COMBO_SWIPER_LAYOUT_BY_BREAKPOINT,
} from '@/constants/combo';
import {
  PRODUCT_LIST_SWIPER_LONG_SWIPES_MS,
  PRODUCT_LIST_SWIPER_LONG_SWIPES_RATIO,
  PRODUCT_LIST_SWIPER_RESISTANCE_RATIO,
  PRODUCT_LIST_SWIPER_TOUCH_RATIO,
  PRODUCT_LIST_SWIPER_TOUCH_THRESHOLD_PX,
  PRODUCT_LIST_SWIPER_TRANSITION_MS,
  PRODUCT_LIST_SWIPER_WRAPPER_EASING,
} from '@/constants/product';
import type { ComboDetail } from '@/services/combo/combo.schema';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Swiper as SwiperClass } from 'swiper';
import { Progress } from '@/share/ui/progress';
import 'swiper/css';
import 'swiper/css/autoplay';
// kept for legacy styling; safe even without FreeMode module
import 'swiper/css/free-mode';
import { Swiper, SwiperSlide } from 'swiper/react';
import { combosForDisplay } from './combos';
import { ComboCard } from '../card';

type ComboListSectionProps = {
  combos: ComboDetail[];
};

type SwiperLayout = {
  slidesPerView: number;
  spaceBetween: number;
};

function layoutForViewport(width: number, comboCount: number): SwiperLayout {
  for (const row of COMBO_SWIPER_LAYOUT_BY_BREAKPOINT) {
    if (width >= row.minWidth) {
      return { slidesPerView: row.slidesPerView, spaceBetween: row.spaceBetween };
    }
  }

  return {
    slidesPerView: comboCount > 1 ? COMBO_SWIPER_FALLBACK_SLIDES_PER_VIEW : 1,
    spaceBetween: 0,
  };
}

function useWindowInnerWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let raf = 0;

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };

    schedule();
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return width;
}

export function ComboListSection({ combos }: ComboListSectionProps) {
  const t = useTranslations('combo');
  const swiperRef = useRef<SwiperClass | null>(null);
  const viewportWidth = useWindowInnerWidth();
  const list = useMemo(() => combosForDisplay(combos), [combos]);
  const comboCount = list.length;
  const [progressPercent, setProgressPercent] = useState(0);

  const layout = useMemo(
    () => layoutForViewport(viewportWidth, comboCount),
    [viewportWidth, comboCount]
  );

  const loopEnabled = comboCount > Math.ceil(layout.slidesPerView);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const rafId = requestAnimationFrame(() => {
      if (swiper.destroyed) return;
      swiper.update();
      const clampedProgress = Math.min(1, Math.max(0, swiper.progress || 0));
      setProgressPercent(Math.round(clampedProgress * 100));
    });

    return () => cancelAnimationFrame(rafId);
  }, [viewportWidth, comboCount, layout.slidesPerView, layout.spaceBetween]);

  if (!list.length) return null;

  const updateProgressBySwiper = (swiper: SwiperClass) => {
    const clampedProgress = Math.min(1, Math.max(0, swiper.progress || 0));
    setProgressPercent(Math.round(clampedProgress * 100));
  };

  return (
    <section className='min-w-0 px-0'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold text-oregon-900 sm:text-2xl'>{t('section.title')}</h2>
      </div>
      <div className='relative max-w-full min-w-0 overflow-x-hidden overflow-y-visible bg-white pb-4 pt-2 sm:pb-5 sm:pt-3'>
        <Progress value={progressPercent} className='mb-3'/>
        <Swiper
          slidesPerView={layout.slidesPerView}
          spaceBetween={layout.spaceBetween}
          speed={PRODUCT_LIST_SWIPER_TRANSITION_MS}
          watchOverflow={false}
          loop={loopEnabled}
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
          style={
            {
              '--swiper-wrapper-transition-timing-function': PRODUCT_LIST_SWIPER_WRAPPER_EASING,
            } as CSSProperties
          }
          className='combo-list-swiper w-full touch-pan-x'
          onSwiper={(instance) => {
            swiperRef.current = instance;
            requestAnimationFrame(() => {
              if (instance.destroyed) return;
              instance.update();
              updateProgressBySwiper(instance);
            });
          }}
          onSlideChange={(swiper) => updateProgressBySwiper(swiper)}
        >
          {list.map((combo) => (
            <SwiperSlide key={combo.id} className='h-auto! px-3 sm:px-0'>
              <ComboCard combo={combo} className='bg-stone-100 shadow-none'/>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
