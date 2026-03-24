'use client'

import * as React from 'react'
import Image from 'next/image'
import type { ComboDetail } from '@/services/combo/combo.schema'
import Modal from '@/share/components/modal'
import { useTranslations } from 'next-intl'
import { Badge } from '@/share/ui/badge'
import { ShoppingCart } from 'lucide-react'

type TriggerElementProps = {
  onClick?: React.MouseEventHandler<HTMLElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>
}

interface AddToCartModalProps {
  combo: ComboDetail
  trigger: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  belowContent?: React.ReactNode
  headerBadges?: React.ReactNode
  headerSubline?: React.ReactNode
  onAddToCart: () => void
}

export function AddToCartModal({
  combo,
  trigger,
  open,
  onOpenChange,
  children,
  belowContent,
  headerBadges,
  headerSubline,
  onAddToCart,
}: AddToCartModalProps) {
  const t = useTranslations('combo')
  const firstProductImage = combo.products[0]?.product.imageUrl?.trim()

  const handleOpen = React.useCallback(() => {
    onOpenChange(true)
  }, [onOpenChange])

  const triggerNode = React.useMemo(() => {
    if (!React.isValidElement<TriggerElementProps>(trigger)) {
      return (
        <span
          onClick={() => handleOpen()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              handleOpen()
            }
          }}
        >
          {trigger}
        </span>
      )
    }

    const currentProps = trigger.props

    return React.cloneElement<TriggerElementProps>(trigger, {
      onClick: (event) => {
        currentProps.onClick?.(event)
        if (!event.defaultPrevented) {
          handleOpen()
        }
      },
      onKeyDown: (event) => {
        currentProps.onKeyDown?.(event)
        if (!event.defaultPrevented && (event.key === 'Enter' || event.key === ' ')) {
          handleOpen()
        }
      },
    })
  }, [trigger, handleOpen])

  return (
    <>
      {triggerNode}
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={<span className='sr-only'>{combo.name}</span>}
        onConfirm={onAddToCart}
        confirmTitle={t('detail.add_to_order')}
        confirmIcon={<ShoppingCart className='size-5 shrink-0' aria-hidden />}
        contentClassName='max-w-4xl'
        showCancelButton={false}
        confirmFullWidth
      >
        <div className='flex flex-col gap-6 px-1'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-stretch'>
            <div className='min-w-0 space-y-6'>
              <div className='space-y-2'>
                <div className='flex flex-wrap items-center gap-2.5 md:gap-3'>
                  <span className='shrink-0 text-xl font-semibold text-foreground'>
                    {combo.name}
                  </span>
                  <Badge variant='outline' className='h-fit px-3'>
                    {combo.code}
                  </Badge>
                  {headerBadges}
                </div>
                {headerSubline ? <div>{headerSubline}</div> : null}
              </div>

              <div>{children}</div>
            </div>

            <div className='flex w-full justify-center md:h-full md:justify-end'>
              <div className='relative aspect-4/3 w-full max-w-[320px] overflow-hidden rounded-2xl bg-linear-to-br from-amber-50 to-amber-100 ring-1 ring-amber-900/10 md:h-full md:min-h-[220px] md:aspect-auto'>
                {firstProductImage ? (
                  <Image
                    src={firstProductImage}
                    alt={combo.name}
                    fill
                    className='object-cover'
                    sizes='320px'
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
          </div>
          {belowContent ? <div className='w-full'>{belowContent}</div> : null}
        </div>
      </Modal>
    </>
  )
}
