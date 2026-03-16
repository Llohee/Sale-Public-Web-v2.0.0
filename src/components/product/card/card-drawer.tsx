"use client";

import { cn } from "@/share/lib/utils";
import { Minus, Plus } from "lucide-react";
import { ProductDetail } from "@/services/product/product.schema";
import { Button } from "@/share/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/share/ui/drawer";
import { useCart } from "@/providers/cart-provider";
import { PRODUCT_SIZES, type ProductSize } from "@/types/cart";
import { useState } from "react";

interface AddToCartDrawerProps {
  product: ProductDetail;
  trigger: React.ReactNode;
}

export function AddToCartDrawer({ product, trigger }: AddToCartDrawerProps) {
  const price = product.price ?? 0;
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<ProductSize>("M");
  const [quantity, setQuantity] = useState(1);

  const sizeMod =
    PRODUCT_SIZES.find((s) => s.value === size)?.priceModifier ?? 0;
  const lineTotal = (price + sizeMod) * quantity;

  const handleAddToCart = () => {
    addItem({ product, size, quantity });
    setOpen(false);
    setQuantity(1);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="bottom">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="rounded-t-3xl bg-background">
        <DrawerHeader>
          <DrawerTitle>{product.name}</DrawerTitle>
          <p className="text-sm text-muted-foreground">
            Chọn size và số lượng
          </p>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSize(s.value as ProductSize)}
                  className={cn(
                    "rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors",
                    size === s.value
                      ? "border-oregon-500 bg-oregon-100 text-oregon-900 dark:bg-oregon-800 dark:text-oregon-50"
                      : "border-border bg-muted/50 hover:bg-muted",
                  )}
                >
                  {s.label}
                  {s.priceModifier > 0 && ` +$${s.priceModifier}`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">Số lượng</p>
            <div className="flex items-center gap-2 rounded-full border bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-8 items-center justify-center rounded-full hover:bg-muted"
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-8 items-center justify-center rounded-full hover:bg-muted"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
          <p className="text-lg font-semibold">
            Tổng: ${lineTotal.toFixed(2)}
          </p>
        </div>
        <DrawerFooter>
          <Button
            variant="dive"
            size="xl"
            className="w-full"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng
          </Button>
          <DrawerClose asChild>
            <Button variant="default">Đóng</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
