import { ProductDetailPageClient } from "@/components/product/detail";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product ${id}`,
    description: "",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetailPageClient productId={id} />;
}
