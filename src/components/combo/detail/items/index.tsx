'use client'

import type { ComboDetail } from '@/services/combo/combo.schema'
import { cn } from '@/share/lib/utils'
import { costFormat } from '@/util/format'
import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

type ComboDetailItemsProps = {
  products: ComboDetail['products']
  compact?: boolean
}

export function ComboDetailItems({
  products,
  compact = false,
}: ComboDetailItemsProps) {
  const t = useTranslations('combo')

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex flex-col items-center gap-1'>
        <h2
          className={cn(
            'font-extrabold text-oregon-900',
            compact ? 'text-xl' : 'text-2xl'
          )}
        >
          {t('detail.items_title')}
        </h2>
        <p className='text-sm text-oregon-700/70'>{t('detail.items_subtitle')}</p>
      </div>
      <div className={cn('grid grid-cols-1 sm:grid-cols-2', compact ? 'gap-2.5' : 'gap-3')}>
        {products.map((item) => (
          <article
            key={item.id}
            className={cn(
              'relative group flex transition-all duration-300 hover:ring-amber-900/15',
              compact
                ? 'gap-2.5 rounded-lg bg-linear-to-br from-slate-50 via-zinc-50 to-stone-100/80 p-2.5'
                : 'gap-3 rounded-xl bg-white p-3 shadow-[0_16px_36px_rgba(15,23,42,0.18)] sm:rounded-2xl'
            )}
          >
            <div
              className={cn(
                'relative shrink-0 overflow-hidden bg-linear-to-br from-oregon-400 to-oregon-600 ring-1 ring-amber-900/10',
                compact ? 'size-18 rounded-lg' : 'size-20 rounded-xl'
              )}
            >
              {item.product.imageUrl?.trim() ? (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                  sizes='96px'
                />
              ) : (
                <div className='absolute inset-0 flex flex-col items-center justify-center gap-1 text-amber-900/60'>
                  <ImageOff className='size-5' />
                  <span className='text-[10px] font-semibold'>{t('card.no_image')}</span>
                </div>
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <p
                className={cn(
                  'line-clamp-1 font-bold text-oregon-900',
                  compact ? 'text-sm' : 'text-base'
                )}
              >
                {item.product.name}
              </p>
              <p
                className={cn(
                  'line-clamp-2 leading-snug text-muted-foreground',
                  compact ? 'mt-0.5 text-[11px]' : 'mt-0.5 text-xs'
                )}
              >
                {item.product.description}
              </p>
              <div
                className={cn(
                  'mt-2 flex items-center justify-between',
                  compact ? 'text-xs' : 'text-sm'
                )}
              >
                <span className='font-medium text-muted-foreground'>
                  {t('detail.item_quantity')}: {item.quantityRequired}
                </span>
                <span
                  className={cn(
                    'font-bold text-oregon-900',
                    compact ? 'text-sm' : 'text-base'
                  )}
                >
                  {costFormat(item.product.price)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
