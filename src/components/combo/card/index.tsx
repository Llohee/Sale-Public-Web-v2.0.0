'use client'

import { useRouter } from '@/i18n/navigation'
import type { ComboDetail } from '@/services/combo/combo.schema'
import { costFormat } from '@/util/format'
import { ImageOff, Plus } from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AddToCartDrawer } from './card-drawer'

type ComboCardProps = {
  combo: ComboDetail
}

export function ComboCard({ combo }: ComboCardProps) {
  const t = useTranslations('combo')
  const router = useRouter()
  const [imageErrored, setImageErrored] = useState(false)
  const firstProductImage = combo.products[0]?.product.imageUrl?.trim() ?? ''
  const hasImage = !!firstProductImage
  const imageAlt = useMemo(() => combo.name || t('banner.alt'), [combo.name, t])
  const comboTotal = useMemo(
    () =>
      Math.max(
        0,
        combo.products.reduce(
          (sum, item) => sum + (item.product.price ?? 0) * item.quantityRequired,
          0
        ) - combo.discountAmount
      ),
    [combo.discountAmount, combo.products]
  )

  return (
    <article
      role='button'
      tabIndex={0}
      onClick={(event) => {
        const target = event.target as Node
        if (
          target &&
          'closest' in target &&
          typeof (target as Element).closest === 'function' &&
          (target as Element).closest?.(
            '[data-slot="dialog-overlay"], [data-slot="dialog-portal"], [data-slot="dialog-content"], [data-slot="drawer-overlay"], [data-slot="drawer-portal"], [data-slot="drawer-content"]'
          )
        ) {
          return
        }

        router.push(`/combo/${combo.id}`)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          router.push(`/combo/${combo.id}`)
        }
      }}
      className='relative group flex h-full flex-col gap-1.5 overflow-hidden rounded-xl bg-stone-100 shadow-none transition-all duration-300 text-left cursor-pointer hover:ring-amber-900/15 sm:gap-2 sm:rounded-2xl'
    >
      <div className='flex items-center justify-center p-0 sm:p-3'>
        <div className='relative aspect-square w-full overflow-hidden rounded-t-xl bg-linear-to-br from-oregon-400 to-oregon-600 ring-1 ring-amber-900/10 sm:w-full sm:rounded-xl'>
          {hasImage && !imageErrored ? (
            <Image
              src={firstProductImage}
              alt={imageAlt}
              fill
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
              sizes='(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px'
              loading='lazy'
              onError={() => setImageErrored(true)}
            />
          ) : (
            <div className='absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-amber-900/60 sm:gap-2'>
              <ImageOff className='size-6 sm:size-8' />
              <span className='text-xs font-semibold tracking-wide'>{t('card.no_image')}</span>
            </div>
          )}
        </div>
      </div>

      <div className='px-2.5 sm:px-4'>
        <p className='line-clamp-1 text-base font-bold leading-snug text-oregon-900 sm:text-xl sm:leading-8'>
          {combo.name}
        </p>
        <p className='mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground sm:text-sm'>
          {combo.description}
        </p>
      </div>

      <div className='mt-auto flex items-end justify-between gap-1.5 sm:gap-3'>
        <div className='flex flex-col gap-0.5 px-2.5 py-1 sm:px-4 sm:py-1.5'>
          <p className='text-[11px] text-muted-foreground sm:text-sm'>{t('card.total_label')}</p>
          <p className='text-base font-bold tracking-tight text-oregon-900 sm:text-lg'>
            {costFormat(comboTotal)}
          </p>
        </div>
        <AddToCartDrawer
          combo={combo}
          trigger={
            <span
              role='button'
              tabIndex={0}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') event.stopPropagation()
              }}
              className='inline-flex h-12 min-w-11 shrink-0 items-center justify-center gap-2 rounded-[18px_0px_14px_0] bg-oregon-700 px-2 text-sm font-medium text-white hover:bg-oregon-600 sm:h-18 sm:min-w-0 sm:rounded-[24px_0px_18px_0] sm:px-3 sm:text-base'
            >
              <Plus className='size-5 sm:size-8' />
            </span>
          }
        />
      </div>
    </article>
  )
}
