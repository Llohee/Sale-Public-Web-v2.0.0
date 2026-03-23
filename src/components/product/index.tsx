'use client';

import { BANNER_BACKGROUND_URL, PRODUCT_LIST_PAGE_SIZE } from '@/constants/product';
import { useFilter } from '@/providers/filter-provider';
import {
  useGetAllProductCategories,
  useInfiniteProductList,
} from '@/services/product/product.query-options';
import { LoadingPage } from '@/share/components/full-page/loading';
import NotFoundPage from '@/share/components/full-page/404';
import { HeroBanner } from '@/share/ui/hero-banner';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
  CategoryFilterSwiper,
  normalizeProductCategoryFilterValue,
} from './swiper/category';
import { ProductListSwiper } from './swiper/product-list';

export function ProductsWrapper() {
  const t = useTranslations('ProductPage');
  const { filter, updateParam } = useFilter();
  const selectedCategoryId = normalizeProductCategoryFilterValue(
    filter.productCategoryId,
  );

  const productListFilter = useMemo(() => ({ ...filter, limit: PRODUCT_LIST_PAGE_SIZE }), [filter]);

  const {
    data: productCategories,
    isLoading: isLoadingProductCategories,
    isError: isErrorProductCategories,
    isSuccess: isSuccessProductCategories,
  } = useGetAllProductCategories();

  const {
    data: productsPages,
    isPending: isPendingProducts,
    isError: isErrorProducts,
    isSuccess: isSuccessProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProductList(productListFilter);

  const flatProducts = useMemo(
    () => productsPages?.pages.flatMap((p) => p.data) ?? [],
    [productsPages]
  );

  const filterOptions = useMemo(() => {
    const categories = productCategories?.data ?? [];
    const categoryOptions = categories
      .filter((c) => c.id?.trim())
      .map((c) => ({
        value: c.id,
        label: c.name,
      }));

    return [
      { value: '', label: t('filter.all') },
      ...categoryOptions,
    ];
  }, [productCategories, t]);

  const shouldShowInitialLoading =
    (isPendingProducts && !productsPages) || (isLoadingProductCategories && !productCategories);

  if (shouldShowInitialLoading) {
    return <LoadingPage />;
  }

  if (isErrorProducts || isErrorProductCategories) {
    return <NotFoundPage />;
  }

  if (!isSuccessProducts || !isSuccessProductCategories) {
    return null;
  }

  return (
    <div className='flex min-h-0 min-w-0 w-full flex-col'>
      <HeroBanner
        src={BANNER_BACKGROUND_URL}
        alt="Hero banner"
        eyebrow="Order Coffee"
        title={t('title')}
        subtitle={t('subtitle')}
      />
      <div className='w-full min-w-0'>
        <div className='min-w-0 px-4 py-5 sm:py-6 flex flex-col gap-5 sm:gap-6'>
          <div className='container mx-auto min-w-0 px-0'>
            <CategoryFilterSwiper
              options={filterOptions}
              selectedCategoryId={selectedCategoryId}
              categoriesRegionLabel={t('filter.categories_region')}
              updateParam={updateParam}
            />
          </div>
          <ProductListSwiper
            products={flatProducts}
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      </div>
    </div>
  );
}
