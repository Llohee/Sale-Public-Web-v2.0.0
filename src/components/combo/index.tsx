'use client';

import { BANNER_BACKGROUND_URL } from '@/constants/product';
import { useGetAllCombos } from '@/services/combo/combo.query-options';
import NotFoundPage from '@/share/components/full-page/404';
import { LoadingPage } from '@/share/components/full-page/loading';
import { HeroBanner } from '@/share/ui/hero-banner';
import { useTranslations } from 'next-intl';
import { ComboSection } from './swiper';

export function ComboWrapper() {
  const t = useTranslations('combo');
  const { data, isPending, isError, isSuccess } = useGetAllCombos();

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <NotFoundPage />;
  }

  if (!isSuccess) {
    return null;
  }

  return (
    <div className='flex min-h-0 min-w-0 w-full flex-col'>
      <HeroBanner
        src={BANNER_BACKGROUND_URL}
        alt={t('banner.alt')}
        eyebrow={t('banner.eyebrow')}
        title={t('banner.title')}
        subtitle={t('banner.subtitle')}
      />
      <div className='w-full min-w-0'>
        <div className='container mx-auto min-w-0 px-4 py-5 sm:py-6'>
          <ComboSection combos={data.data ?? []} />
        </div>
      </div>
    </div>
  );
}
