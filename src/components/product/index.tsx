"use client";

import { useFilter } from "@/providers/filter-provider";
import {
  useGetAllProductCategories,
  useGetAllProducts,
} from "@/services/product/product.query-options";
import type { ProductDetail } from "@/services/product/product.schema";
import SearchInput from "@/share/components/input/search";
import { VercelTabs } from "@/share/ui/vercel-tabs";
import { useTranslations } from "next-intl";
import { ProductCard } from "./card";

export function ProductsWrapper() {
  const t = useTranslations("ProductPage");
  const { filter, updateParam, onSearchChange } = useFilter();

  const {
    data: productCategories,
    isLoading: isLoadingProductCategories,
    isError: isErrorProductCategories,
    isSuccess: isSuccessProductCategories,
  } = useGetAllProductCategories();
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    isSuccess: isSuccessProducts,
  } = useGetAllProducts(filter);

  if (isLoadingProducts || isLoadingProductCategories) {
    return <div>Loading...</div>;
  }

  if (isErrorProducts || isErrorProductCategories) {
    return <div>Error loading products</div>;
  }

  if (isSuccessProducts && isSuccessProductCategories) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 pb-6">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t("title")}
            </h1>
            <SearchInput
              value={filter.keyword}
              onChange={onSearchChange}
              placeholder={t("filter.search_placeholder")}
            />

            <VercelTabs
              tabs={productCategories?.data.map((category) => ({
                label: category.name,
                value: category.id,
                content: <div>Content for {category.name}</div>,
              }))}
              defaultTab="Overview"
            />

            <div className="flex flex-wrap gap-8 items-center justify-center">
              {products?.data.map((product: ProductDetail) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
