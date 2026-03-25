'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { TypewriterText } from '@/share/components/typewriter-text';
import { Button } from '@/share/ui/button';

type Props = {
  error: Error;
  reset(): void;
};

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations('common.error');
  const router = useRouter();
  const [isFirstLineDone, setIsFirstLineDone] = useState(false);
  const firstLine = t('line1');
  const secondLine = t('line2');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='min-h-dvh px-6 py-10'>
      <div className='mx-auto flex min-h-[calc(90dvh-5rem)] w-full max-w-sm flex-col items-center justify-center gap-4 text-center'>
        <div className='flex w-full flex-col items-center gap-2'>
          <div className='flex w-full justify-center'>
            <Image
              src='/images/error.svg'
              alt={t('image_alt')}
              width={340}
              height={440}
              priority
              className='h-auto w-full max-w-[330px] object-contain'
            />
          </div>
          <div className='flex min-h-16 flex-col gap-2 text-center text-base leading-relaxed font-medium text-stone-900/90'>
            <p>
              <TypewriterText
                text={firstLine}
                speed={25}
                cursorClassName='ml-0.5'
                onComplete={() => setIsFirstLineDone(true)}
              />
            </p>
            <p>
              {isFirstLineDone ? (
                <TypewriterText text={secondLine} speed={25} cursorClassName='ml-0.5' />
              ) : null}
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <Button
            type='button'
            variant='chocolate'
            size='lg'
            className='w-full'
            onClick={() => router.replace('/')}
          >
            {t('home')}
          </Button>
          <Button
            type='button'
            variant='chocolate-outline'
            size='lg'
            className='w-full'
            onClick={reset}
          >
            {t('retry')}
          </Button>
        </div>
      </div>
    </div>
  );
}
