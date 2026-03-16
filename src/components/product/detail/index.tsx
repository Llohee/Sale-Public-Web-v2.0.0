"use client";

import { ProductDetailView } from "@/components/product/detail/view";
import { useGetProductById } from "@/services/product/product.query-options";
import { notFound } from "next/navigation";

export function ProductDetailPageClient({ productId }: { productId: string }) {
  const { data, isLoading, isError } = useGetProductById(productId);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (isError || !data?.data) {
    notFound();
  }

  return <ProductDetailView product={data.data} />;
}
