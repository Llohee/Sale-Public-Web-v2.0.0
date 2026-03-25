'use client';

import {
  PRODUCT_LIST_SWIPER_AUTOPLAY_DELAY_MS,
  PRODUCT_LIST_SWIPER_WRAPPER_EASING,
} from '@/constants/product';
import type { ComboDetail } from '@/services/combo/combo.schema';
import { useTranslations } from 'next-intl';
import { useMemo, type CSSProperties } from 'react';
import { combosForDisplay } from './combos';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ComboHeroSlide } from './combo-hero';

type ComboSectionProps = {
  combos: ComboDetail[];
};

export function ComboSection({ combos }: ComboSectionProps) {
  const t = useTranslations('combo');
  const list = useMemo(() => combosForDisplay(combos), [combos]);
  if (!list.length) return null;

  const loopEnabled = list.length > 1;

  return (
    <section
      className='relative min-w-0 w-full overflow-x-clip overflow-y-visible bg-transparent pt-0 sm:pt-3 md:bg-slate-50 md:pt-10 md:bg-[radial-gradient(circle_at_1px_1px,rgb(203_213_225/0.35)_1px,transparent_0)] md:bg-size-[20px_20px]'
      aria-label={t('section.title')}
    >
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        speed={520}
        loop={loopEnabled}
        watchOverflow
        grabCursor
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: PRODUCT_LIST_SWIPER_AUTOPLAY_DELAY_MS,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        style={
          {
            '--swiper-wrapper-transition-timing-function': PRODUCT_LIST_SWIPER_WRAPPER_EASING,
          } as CSSProperties
        }
        className='combo-hero-swiper w-full touch-pan-x pb-5 max-md:pb-4 sm:pb-7 [&_.swiper-pagination]:bottom-2! [&_.swiper-pagination-bullet]:mx-0.5 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-slate-300! [&_.swiper-pagination-bullet]:opacity-100! [&_.swiper-pagination-bullet-active]:w-8! [&_.swiper-pagination-bullet-active]:rounded-full! [&_.swiper-pagination-bullet-active]:bg-orange-500!'
      >
        {list.map((combo) => (
          <SwiperSlide key={combo.id} className='h-auto!'>
            <ComboHeroSlide combo={combo} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export { ComboListSection } from './combo-list';
