"use client";

import { ProductDetailView } from "@/components/product/detail/view";
import { useGetProductById } from "@/services/product/product.query-options";
import { notFound } from "next/navigation";
import { LoadingPage } from "@/share/components/full-page/loading";

export function ProductDetailPageClient({ productId }: { productId: string }) {
  const { data, isLoading, isError } = useGetProductById(productId);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingPage />
      </div>
    );
  }

  if (isError || !data?.data) {
    notFound();
  }

  return <ProductDetailView product={data.data} />;
}
