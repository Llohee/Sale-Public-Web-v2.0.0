export const PRODUCT_SIZES = [
  { value: "S", label: "S", priceModifier: 0 },
  { value: "M", label: "M", priceModifier: 0.5 },
  { value: "L", label: "L", priceModifier: 1 },
] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number]["value"];

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  size: ProductSize;
  note?: string;
  quantity: number;
  note?: string;
}

export function getCartItemLineTotal(item: CartItem): number {
  const sizeMod = PRODUCT_SIZES.find((s) => s.value === item.size)?.priceModifier ?? 0;
  return (item.unitPrice + sizeMod) * item.quantity;
}
