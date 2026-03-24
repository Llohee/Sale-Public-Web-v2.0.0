'use client'

import Image from 'next/image'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import type { ComboDetail } from '@/services/combo/combo.schema'
import { Button } from '@/share/ui/button'
import { Badge } from '@/share/ui/badge'
import { Textarea } from '@/share/ui/textarea'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/share/ui/drawer'
import { useCart } from '@/providers/cart-provider'
import { useEffect, useMemo, useState } from 'react'
import { COMBO_DEFAULT_QUANTITY } from '@/constants/combo'
import { AddToCartModal } from './modal'
import { useTranslations } from 'next-intl'
import { costFormat, dateFormat } from '@/util/format'
import { cn } from '@/share/lib/utils'
import { ComboDetailItems } from '../detail/items'

interface AddToCartDrawerProps {
  combo: ComboDetail
  trigger: React.ReactNode
  onClose?: () => void
}

export function AddToCartDrawer({
  combo,
  trigger,
  onClose,
}: AddToCartDrawerProps) {
  const t = useTranslations('combo')
  const tOrder = useTranslations('order')
  const { addComboItem } = useCart()
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(COMBO_DEFAULT_QUANTITY)
  const [note, setNote] = useState('')
  const [imageErrored, setImageErrored] = useState(false)
  const imageSrc = combo.products[0]?.product.imageUrl?.trim() ?? ''
  const imageAlt = combo.name || t('banner.alt')
  const [isDesktop, setIsDesktop] = useState(false)

  const comboBasePrice = useMemo(
    () =>
      combo.products.reduce(
        (sum, item) => sum + (item.product.price ?? 0) * item.quantityRequired,
        0
      ),
    [combo.products]
  )
  const comboUnitPrice = Math.max(0, comboBasePrice - combo.discountAmount)
  const lineTotal = comboUnitPrice * quantity
  const comboDateRange = `${dateFormat(combo.startDate)} - ${
    combo.endDate ? dateFormat(combo.endDate) : t('detail.unlimited')
  }`

  const resetSelection = () => {
    setQuantity(COMBO_DEFAULT_QUANTITY)
    setNote('')
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      resetSelection()
      onClose?.()
    }
    setOpen(next)
  }

  const handleAddToCart = () => {
    addComboItem({ combo, quantity, note: note.trim() ? note.trim() : undefined })
    setOpen(false)
    resetSelection()
  }

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const renderSummaryContent = ({ desktop = false }: { desktop?: boolean } = {}) => (
    <div className='space-y-3.5'>
      {!desktop ? (
        <div className='flex flex-wrap items-center gap-2'>
          <Badge variant='outline' className='h-fit'>
            {combo.active ? t('detail.status_active') : t('detail.status_inactive')}
          </Badge>
          <Badge variant='outline' className='h-fit'>
            {comboDateRange}
          </Badge>
        </div>
      ) : null}

      {combo.description ? (
        <p className='text-sm italic leading-relaxed text-oregon-700/80'>
          {combo.description}
        </p>
      ) : null}

      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div className='flex flex-col items-start gap-2'>
          <p className='text-sm font-medium'>{t('detail.quantity')}</p>
          <div className='flex items-center gap-3 bg-white'>
            <Button
              type='button'
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              size='icon-sm'
              variant='chocolate-outline'
              aria-label={t('detail.quantity')}
              disabled={quantity <= 1}
              className='rounded-full'
            >
              <Minus className='size-4' />
            </Button>
            <span className='min-w-8 text-center text-lg font-bold tabular-nums text-oregon-900'>
              {quantity}
            </span>
            <Button
              type='button'
              onClick={() => setQuantity((current) => current + 1)}
              size='icon-sm'
              variant='chocolate-outline'
              aria-label={t('detail.quantity')}
              className='rounded-full'
            >
              <Plus className='size-4' />
            </Button>
          </div>
        </div>
      </div>

      <p className='hidden text-lg font-semibold sm:block'>
        {t('detail.total')}: {costFormat(lineTotal)}
      </p>
    </div>
  )

  const renderExpandedContent = () => (
    <div className='space-y-5'>
      <div className='space-y-2'>
        <p className='text-xs font-semibold uppercase tracking-wide text-oregon-700/60'>
          {tOrder('note_label')}
        </p>
        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={tOrder('note_placeholder')}
          className='min-h-20 w-full resize-y rounded-lg border-oregon-700/10 bg-amber-50/35 text-sm text-oregon-900 placeholder:text-oregon-700/35 focus-visible:border-oregon-700/25 focus-visible:ring-oregon-700/10'
        />
      </div>

      <ComboDetailItems products={combo.products} compact />
    </div>
  )

  if (isDesktop) {
    return (
      <AddToCartModal
        combo={combo}
        trigger={trigger}
        open={open}
        onOpenChange={handleOpenChange}
        belowContent={renderExpandedContent()}
        headerBadges={
          <Badge variant='outline' className='h-fit'>
            {combo.active ? t('detail.status_active') : t('detail.status_inactive')}
          </Badge>
        }
        headerSubline={
          <Badge variant='outline' className='h-fit'>
            {comboDateRange}
          </Badge>
        }
        onAddToCart={handleAddToCart}
      >
        {renderSummaryContent({ desktop: true })}
      </AddToCartModal>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction='bottom'>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className='flex max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-0.5rem))] flex-col overflow-hidden rounded-t-3xl bg-background before:border-0 data-[vaul-drawer-direction=bottom]:mt-10!'>
        <DrawerHeader className='shrink-0'>
          <div className='flex w-full items-center justify-between gap-3'>
            <DrawerTitle>{combo.name}</DrawerTitle>
            <Badge variant='outline' className='h-fit border-0 px-3'>
              {combo.code}
            </Badge>
          </div>
        </DrawerHeader>

        <div className='min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 [-webkit-overflow-scrolling:touch]'>
          {imageSrc ? (
            <div className='pb-4'>
              <div className='relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-linear-to-br from-amber-50 to-amber-100'>
                {!imageErrored ? (
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes='340px'
                    className='object-cover'
                    onError={() => setImageErrored(true)}
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-amber-900/60'>
                    <span className='text-sm font-semibold tracking-wide'>
                      {t('card.no_image')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <div className='pb-4 space-y-5'>
            {renderSummaryContent()}
            {renderExpandedContent()}
          </div>
        </div>

        <DrawerFooter className='shrink-0 gap-3 border-t border-border/30 bg-background pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]'>
          <div className='flex w-full items-center justify-between gap-3'>
            <p className='flex min-w-0 flex-none flex-col text-sm font-semibold text-oregon-900'>
              <span className='text-xs font-normal text-oregon-700/60'>
                {t('detail.total')}
              </span>
              <span className='text-lg font-extrabold text-oregon-900'>
                {costFormat(lineTotal)}
              </span>
            </p>
            <Button
              type='button'
              variant='default'
              aria-label={t('card.add_to_order_aria')}
              className={cn(
                'h-14 w-14 shrink-0 border-0 p-0 shadow-none sm:shadow-md',
                'rounded-[18px_0px_18px_0] ring-1 ring-amber-950/15',
                'hover:bg-oregon-600 hover:shadow-none hover:-translate-y-px active:translate-y-0 sm:hover:shadow-lg',
                '[&_svg]:size-6'
              )}
              onClick={handleAddToCart}
            >
              <ShoppingCart aria-hidden />
              <span className='sr-only'>{t('detail.add_to_order')}</span>
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
