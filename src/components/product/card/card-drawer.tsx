"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { ProductDetail } from "@/services/product/product.schema";
import { Button } from "@/share/ui/button";
import { Badge } from "@/share/ui/badge";
import { Textarea } from "@/share/ui/textarea";
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
import { costFormat } from "@/util/format";
import { cn } from "@/share/lib/utils";

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
  const tOrder = useTranslations("order");
  const price = product.price ?? 0;
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<ProductSize>(DEFAULT_SIZE);
  const [quantity, setQuantity] = useState(DEFAULT_QUANTITY);
  const [note, setNote] = useState("");
  const [imageErrored, setImageErrored] = useState(false);
  const imageSrc = product.imageUrl?.trim() ?? "";
  const imageAlt = product.name || "Product image";

  const resetSelection = () => {
    setSize(DEFAULT_SIZE);
    setQuantity(DEFAULT_QUANTITY);
    setNote("");
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
    addItem({
      product,
      size,
      quantity,
      note: note.trim() ? note.trim() : undefined,
    });
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

  const renderModalContent = () => (
    <div className="space-y-4">
      {product.description ? (
        <p className="text-sm italic leading-relaxed text-oregon-700/80 pt-2.5">
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
              className="rounded-full px-8 text-md font-semibold"
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
          <span className="min-w-8 text-center text-lg font-bold tabular-nums text-oregon-900">
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

      <p className="hidden sm:block text-lg font-semibold">
        {t("total", { total: costFormat(lineTotal) })}
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
        note={note}
        onNoteChange={setNote}
      >
        {renderModalContent()}
      </AddToCartModal>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction="bottom">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className="flex max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-0.5rem))] flex-col overflow-hidden rounded-t-3xl bg-background before:border-0 data-[vaul-drawer-direction=bottom]:mt-10!"
      >
        <DrawerHeader className="shrink-0">
          <div className="flex w-full items-center justify-between gap-3">
            <DrawerTitle>{product.name}</DrawerTitle>
            <Badge variant="outline" className="h-fit border-0 px-3">
              {product.productCategoryName}
            </Badge>
          </div>
        </DrawerHeader>

        <div
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 [-webkit-overflow-scrolling:touch]"
        >
          {imageSrc ? (
            <div className="pb-4">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-linear-to-br from-amber-50 to-amber-100">
                {!imageErrored ? (
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="340px"
                    className="object-cover"
                    onError={() => setImageErrored(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-amber-900/60">
                    <span className="text-sm font-semibold tracking-wide">
                      Image unavailable
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
          {renderModalContent()}
          <div className="space-y-2 pb-4 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-oregon-700/60">
              {tOrder("note_label")}
            </p>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={tOrder("note_placeholder")}
              className="min-h-20 max-h-48 resize-y rounded-lg border-0 bg-amber-50/35 text-sm text-oregon-900 shadow-none placeholder:text-oregon-700/35 focus-visible:border-0 focus-visible:ring-oregon-700/10"
            />
          </div>
        </div>

        <DrawerFooter className="shrink-0 gap-3 border-t border-border/30 bg-background pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex w-full items-center justify-between gap-3">
            <p className="flex min-w-0 flex-none flex-col text-sm font-semibold text-oregon-900">
              <span className="text-xs font-normal text-oregon-700/60">
                {t("total_label")}
              </span>
              <span className="text-lg font-extrabold text-oregon-900">
                {costFormat(lineTotal)}
              </span>
            </p>
            <Button
              type="button"
              variant="default"
              aria-label={t("add_to_cart")}
              className={cn(
                "h-14 w-14 shrink-0 border-0 p-0 shadow-none sm:shadow-md",
                "rounded-[18px_0px_18px_0] ring-1 ring-amber-950/15",
                "hover:bg-oregon-600 hover:shadow-none hover:-translate-y-px active:translate-y-0 sm:hover:shadow-lg",
                "[&_svg]:size-6",
              )}
              onClick={handleAddToCart}
            >
              <ShoppingCart aria-hidden />
              <span className="sr-only">{t("add_to_cart")}</span>
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
