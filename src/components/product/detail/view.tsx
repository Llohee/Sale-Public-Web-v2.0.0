'use client';

import { Button } from '@/share/ui/button';
import { useCart } from '@/providers/cart-provider';
import { PRODUCT_SIZES, type ProductSize } from '@/types/cart';
import { useRouter } from '@/i18n/navigation';
import { useGetAllProducts } from '@/services/product/product.query-options';
import { ChevronLeft, ImageOff, Minus, Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import type { ProductDetail } from '@/services/product/product.schema';
import { cn } from '@/share/lib/utils';
import { RelatedProducts } from './related-products';
import { Badge } from '@/share/ui/badge';
import { Textarea } from '@/share/ui/textarea';

interface ProductDetailViewProps {
  product: ProductDetail;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const t = useTranslations('product.detail');
  const tOrderEmpty = useTranslations('order.empty');
  const tOrder = useTranslations('order');
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<ProductSize>('M');
  const [note, setNote] = useState('');
  const hasImage = !!product.imageUrl?.trim();
  const [imageErrored, setImageErrored] = useState(false);
  const { addItem } = useCart();
  const unitPrice = product.price ?? 0;
  const { data: allProducts } = useGetAllProducts({ limit: 10, offset: 0 });
  const sizeMod = PRODUCT_SIZES.find((s) => s.value === size)?.priceModifier ?? 0;
  const lineTotal = (unitPrice + sizeMod) * quantity;
  const relatedProducts = useMemo(
    () =>
      (allProducts?.data ?? []).filter(
        (item) => item.id !== product.id && item.productCategoryId === product.productCategoryId
      ),
    [allProducts?.data, product.id, product.productCategoryId]
  );

  const handleAddToOrder = () => {
    addItem({ product, size, quantity, note: note.trim() ? note.trim() : undefined });
    router.push('/order');
  };

  return (
    <div className='container mx-auto px-4 pt-6 pb-16 md:pt-28 md:pb-28 flex flex-col gap-6 md:gap-8'>
      <div className='shrink-0'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => router.back()}
          className='inline-flex rounded-full bg-white/90 shadow-sm ring-1 ring-black/5 backdrop-blur-sm md:rounded-lg md:bg-background md:shadow-none md:ring-0 md:backdrop-blur-none'
        >
          <ChevronLeft className='size-5' />
          <span className='text-sm font-semibold'>{t('back')}</span>
        </Button>
      </div>
      <div className='p-5 md:bg-transparent md:p-0 md:shadow-none md:ring-0'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4'>
          <div className='flex flex-col gap-6 md:gap-8 col-span-12 md:col-span-7 order-2 md:order-1'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
              <div className='flex flex-col gap-5 md:gap-8 h-full justify-between'>
                <div className='flex flex-row items-end justify-between gap-6 md:flex-col md:items-start md:gap-1'>
                  <div className='flex min-w-0 w-full flex-row items-end justify-between gap-4'>
                    <h1 className='min-w-0 flex-1 text-4xl md:text-5xl font-extrabold text-oregon-800 truncate'>
                      {product.name}
                    </h1>
                    <div className='md:hidden shrink-0'>
                      <Badge variant='outline' className='text-md px-3 h-fit w-fit'>
                        {product.productCategoryName}
                      </Badge>
                    </div>
                  </div>
                  <p className='hidden md:block shrink-0 text-xl md:text-2xl font-extrabold text-oregon-900'>
                    ${lineTotal.toFixed(2)}
                  </p>
                </div>
                <div className='md:hidden flex flex-col gap-2'>
                  <p className='text-lg font-medium italic leading-relaxed text-oregon-700/80 md:text-lg'>
                    {product.description}
                  </p>
                </div>
                <div className='flex flex-row items-start w-full justify-between gap-6 md:flex-col md:gap-6'>
                  <div className='w-fit flex flex-col items-start gap-2 min-w-0'>
                    <p className='text-md leading-none text-oregon-900 md:text-lg'>
                      {t('sizeLabel')}
                    </p>
                    <div className='inline-flex flex-nowrap items-center justify-start gap-3'>
                      {PRODUCT_SIZES.map((s) => (
                        <Button
                          key={s.value}
                          type='button'
                          size='sm'
                          aria-pressed={size === s.value}
                          onClick={() => setSize(s.value as ProductSize)}
                          variant={size === s.value ? 'chocolate' : 'chocolate-outline'}
                          className={cn(
                            'shrink-0 rounded-full px-6 md:px-8 text-sm md:text-md font-semibold'
                          )}
                        >
                          <span className='inline-flex items-center justify-center gap-1'>
                            {s.label}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className='w-fit flex flex-col items-center gap-2 min-w-0 md:flex-row md:items-center md:gap-3'>
                    <span className='text-base leading-none text-oregon-900 md:text-lg text-center'>
                      {t('quantityLabel')}
                    </span>
                    <div className='inline-flex items-center justify-center gap-3 bg-white'>
                      <Button
                        type='button'
                        size='icon-sm'
                        variant='chocolate-outline'
                        aria-label={t('decrease')}
                        disabled={quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className='rounded-full'
                      >
                        <Minus className='size-4' />
                      </Button>
                      <div className='text-center text-lg md:text-xl font-bold text-oregon-900'>
                        {quantity}
                      </div>
                      <Button
                        type='button'
                        size='icon-sm'
                        variant='chocolate-outline'
                        aria-label={t('increase')}
                        onClick={() => setQuantity((q) => q + 1)}
                        className='rounded-full'
                      >
                        <Plus className='size-4' />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className='w-full space-y-2 mt-2'>
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
                <div className='md:hidden flex w-full items-center justify-between gap-4'>
                  <div className='shrink-0 flex flex-col leading-tight'>
                    <span className='text-sm font-medium text-oregon-700/70'>
                      {t('totalLabel')}
                    </span>
                    <p className='text-xl font-extrabold text-oregon-900'>
                      ${lineTotal.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant='dive'
                    size='xl'
                    className='rounded-full px-6 py-2 text-base font-semibold gap-4 w-fit'
                    onClick={handleAddToOrder}
                  >
                    <ShoppingCart className='size-5' />
                    {t('addToOrder')}
                  </Button>
                </div>
                <Button
                  variant='dive'
                  size='xl'
                  className='hidden md:flex w-full rounded-full px-6 md:px-8 py-2 text-base md:text-lg font-semibold gap-4'
                  onClick={handleAddToOrder}
                >
                  <ShoppingCart className='size-5' />
                  {t('addToOrder')}
                </Button>
              </div>
              <div className='hidden md:flex flex-col gap-1'>
                <Badge variant='outline' className='text-md px-3 h-fit'>
                  {product.productCategoryName}
                </Badge>
                <p className='text-lg font-medium italic leading-relaxed text-oregon-700/80 md:text-lg'>
                  {product.description}
                </p>
              </div>
            </div>
          </div>
          <div className='relative w-full overflow-hidden rounded-lg bg-transparent md:rounded-3xl md:ring-1 md:ring-black/5 lg:max-w-none col-span-12 md:col-span-5 order-1 md:order-2 aspect-3/4 max-h-[360px] md:aspect-auto md:max-h-none md:h-full'>
            {hasImage && !imageErrored ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-300'
                fill
                onError={() => setImageErrored(true)}
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-linear-to-br from-amber-50 to-amber-100 text-amber-900/60'>
                <div className='flex flex-col items-center justify-center gap-2'>
                  <ImageOff className='size-10' />
                  <span className='text-sm font-semibold tracking-wide'>
                    {t('imageUnavailable')}
                  </span>
                  <Button
                    type='button'
                    variant='outline'
                    className='mt-2 rounded-full bg-white/70 px-4 text-amber-900'
                    onClick={() => router.push('/product')}
                  >
                    {tOrderEmpty('browse_products')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
