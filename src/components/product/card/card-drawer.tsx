"use client";

import { cn } from "@/share/lib/utils";
import { Minus, Plus } from "lucide-react";
import { ProductDetail } from "@/services/product/product.schema";
import { Button } from "@/share/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/share/ui/drawer";
import ConfirmModal from "@/share/components/modal/confirm";
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
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
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
      <div>
        <p className="mb-2 text-sm font-medium">{t("size")}</p>
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
        <p className="text-sm font-medium">{t("quantity")}</p>
        <div className="flex items-center gap-2 rounded-full border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-8 items-center justify-center rounded-full hover:bg-muted"
          >
            <Minus className="size-4" />
          </button>
          <span className="min-w-8 text-center text-sm font-medium">
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
    <>
      <Drawer open={open} onOpenChange={handleOpenChange} direction="bottom">
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="rounded-t-3xl bg-background">
          <DrawerHeader>
            <DrawerTitle>{product.name}</DrawerTitle>
            <p className="text-sm text-muted-foreground">
              {t("choose_size_and_quantity")}
            </p>
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
              onClick={() => setConfirmCloseOpen(true)}
            >
              {t("close")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <ConfirmModal
        open={confirmCloseOpen}
        onOpenChange={setConfirmCloseOpen}
        title={t("close_confirm.title")}
        description={t("close_confirm.description")}
        onConfirm={() => {
          setOpen(false);
          resetSelection();
          onClose?.();
        }}
        cancelTitle={t("close_confirm.cancel")}
        confirmTitle={t("close_confirm.confirm")}
      />
    </>
  );
}
