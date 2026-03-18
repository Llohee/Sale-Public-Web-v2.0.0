"use client";

import { cn } from "@/share/lib/utils";
import { Minus, Plus } from "lucide-react";
import { ProductDetail } from "@/services/product/product.schema";
import { Button } from "@/share/ui/button";
import { Badge } from "@/share/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/share/ui/drawer";
import { useCart } from "@/providers/cart-provider";
import { PRODUCT_SIZES, type ProductSize } from "@/types/cart";
import { useEffect, useState } from "react";
import { DEFAULT_QUANTITY, DEFAULT_SIZE } from "@/constants/product";
import { AddToCartModal } from "./modal";
import { useTranslations } from "next-intl";

interface AddToCartDrawerProps {
  product: ProductDetail;
  trigger: React.ReactNode;
  onClose?: () => void;
}

export function AddToCartDrawer({
  product,
  trigger,
  onClose,
}: AddToCartDrawerProps) {
  const t = useTranslations("product.add_to_cart");
  const price = product.price ?? 0;
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<ProductSize>(DEFAULT_SIZE);
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY);

  const resetSelection = () => {
    setSize(DEFAULT_SIZE);
    setQuantity(DEFAULT_QUANTITY);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      resetSelection();
      onClose?.();
    }
    setOpen(next);
  };
  const [isDesktop, setIsDesktop] = useState(false);

  const sizeMod =
    PRODUCT_SIZES.find((s) => s.value === size)?.priceModifier ?? 0;
  const lineTotal = (price + sizeMod) * quantity;

  const handleAddToCart = () => {
    addItem({ product, size, quantity });
    setOpen(false);
    resetSelection();
  };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const modalContent = (
    <div className="space-y-4">
      {product.description ? (
        <p className="text-sm italic leading-relaxed text-oregon-700/80">
          {product.description}
        </p>
      ) : null}
      <div>
        <p className="mb-2 text-sm font-medium">{t("size")}</p>
        <div className="flex flex-wrap gap-3">
          {PRODUCT_SIZES.map((s) => (
            <Button
              key={s.value}
              type="button"
              onClick={() => setSize(s.value as ProductSize)}
              aria-pressed={size === s.value}
              variant={size === s.value ? "chocolate" : "chocolate-outline"}
              className={cn("rounded-full px-8 text-md font-semibold")}
              size="sm"
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-sm font-medium">{t("quantity")}</p>
        <div className="flex items-center gap-3 bg-white">
          <Button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            size="icon-sm"
            variant="chocolate-outline"
            aria-label={t("decrease")}
            disabled={quantity <= 1}
            className="rounded-full"
          >
            <Minus className="size-4" />
          </Button>
          <span className="min-w-8 text-center text-lg font-bold text-oregon-900">
            {quantity}
          </span>
          <Button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            size="icon-sm"
            variant="chocolate-outline"
            aria-label={t("increase")}
            className="rounded-full"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <p className="text-lg font-semibold">
        {t("total", { total: lineTotal.toFixed(2) })}
      </p>
    </div>
  );

  if (isDesktop) {
    return (
      <AddToCartModal
        product={product}
        trigger={trigger}
        open={open}
        onOpenChange={handleOpenChange}
        onAddToCart={handleAddToCart}
      >
        {modalContent}
      </AddToCartModal>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction="bottom">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="rounded-t-3xl bg-background">
        <DrawerHeader>
          <div className="flex w-full items-center justify-between gap-3">
            <DrawerTitle>{product.name}</DrawerTitle>
            <Badge variant="outline" className="px-3 h-fit">
              {product.productCategoryName}
            </Badge>
          </div>
        </DrawerHeader>
        <div className="px-4">{modalContent}</div>
        <DrawerFooter>
          <Button
            variant="dive"
            size="xl"
            className="w-full"
            onClick={handleAddToCart}
          >
            {t("add_to_cart")}
          </Button>
          <Button
            type="button"
            variant="default"
            className="w-full"
            onClick={() => handleOpenChange(false)}
          >
            {t("close")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
