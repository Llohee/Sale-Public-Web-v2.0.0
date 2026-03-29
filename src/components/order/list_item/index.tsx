import { useCart } from "@/providers/cart-provider";
import { Button } from "@/share/ui/button";
import { getCartItemLineTotal, getComboCartItemLineTotal } from "@/types/cart";
import { costFormat } from "@/util/format";
import { ImageOff, Minus, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function OrderListItem() {
  const t = useTranslations("order");
  const {
    items,
    comboItems,
    removeItem,
    removeComboItem,
    updateQuantity,
    updateComboQuantity,
  } = useCart();

  return (
    <>
      {items.map((item) => {
        const hasImage = !!item.imageUrl?.trim();

        return (
          <div
            key={item.id}
            className="relative flex items-stretch gap-3 md:gap-6 justify-between rounded-md bg-white/70 p-3 shadow-sm md:p-5"
          >
            <div className="relative aspect-square w-28 shrink-0 self-start overflow-hidden rounded-sm bg-linear-to-br from-amber-50 to-amber-100 ring-1 ring-amber-900/10 md:w-36 md:rounded-md">
              {hasImage ? (
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-amber-900/55">
                  <ImageOff className="size-7" />
                  <span className="text-[11px] font-semibold">
                    {t("image_unavailable")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-2 sm:pr-0">
              <div className="flex flex-col gap-0.5">
                <p className="text-base font-bold leading-snug text-oregon-800 md:text-3xl md:font-extrabold">
                  {item.productName}
                </p>
                <p className="text-xs text-oregon-700/70 md:text-sm">
                  {t("size", { size: item.size })}
                </p>
                {item.note?.trim() ? (
                  <p className="mt-1 text-xs leading-relaxed text-oregon-700/70 md:mt-2 md:text-sm">
                    {t("note", { note: item.note })}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 sm:gap-3">
                <p className="text-base font-bold text-oregon-900 md:text-xl md:font-extrabold">
                  {costFormat(getCartItemLineTotal(item))}
                </p>
                <div className="inline-flex items-center justify-center gap-2 sm:gap-3">
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="chocolate-outline"
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="rounded-full"
                  >
                    <Minus className="size-3.5 md:size-4" />
                  </Button>
                  <div className="min-w-5 text-center text-sm font-bold text-oregon-900 md:text-xl">
                    {item.quantity}
                  </div>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="chocolate-outline"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="rounded-full"
                  >
                    <Plus className="size-3.5 md:size-4" />
                  </Button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="absolute top-0 right-0 cursor-pointer rounded-tr-md rounded-bl-sm bg-[#CC0000] p-2 md:p-3"
            >
              <Trash2 className="size-3.5 text-white md:size-6" />
            </button>
          </div>
        );
      })}
      {comboItems.map((item) => {
        const hasImage = !!item.imageUrl?.trim();

        return (
          <div
            key={item.id}
            className="relative flex items-stretch gap-3 md:gap-6 justify-between rounded-md bg-white/70 p-3 shadow-sm md:p-5"
          >
            <div className="relative aspect-square w-28 shrink-0 self-start overflow-hidden rounded-sm bg-linear-to-br from-amber-50 to-amber-100 ring-1 ring-amber-900/10 md:w-36 md:rounded-md">
              {hasImage ? (
                <Image
                  src={item.imageUrl}
                  alt={item.comboName}
                  fill
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-amber-900/55">
                  <ImageOff className="size-7" />
                  <span className="text-[11px] font-semibold">
                    {t("image_unavailable")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-2 sm:pr-0">
              <div className="flex flex-col gap-0.5">
                <p className="text-base font-bold leading-snug text-oregon-800 md:text-3xl md:font-extrabold">
                  {item.comboName}
                </p>
                <p className="text-xs text-oregon-700/70 md:text-sm">Combo</p>
                {item.note?.trim() ? (
                  <p className="mt-1 text-xs leading-relaxed text-oregon-700/70 md:mt-2 md:text-sm">
                    {t("note", { note: item.note })}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 sm:gap-3">
                <p className="text-base font-bold text-oregon-900 md:text-xl md:font-extrabold">
                  {costFormat(getComboCartItemLineTotal(item))}
                </p>
                <div className="inline-flex items-center justify-center gap-2 sm:gap-3">
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="chocolate-outline"
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      updateComboQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="rounded-full"
                  >
                    <Minus className="size-3.5 md:size-4" />
                  </Button>
                  <div className="min-w-5 text-center text-sm font-bold text-oregon-900 md:text-xl">
                    {item.quantity}
                  </div>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="chocolate-outline"
                    onClick={() => updateComboQuantity(item.id, item.quantity + 1)}
                    className="rounded-full"
                  >
                    <Plus className="size-3.5 md:size-4" />
                  </Button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeComboItem(item.id)}
              className="absolute top-0 right-0 cursor-pointer rounded-tr-md rounded-bl-sm bg-[#CC0000] p-2 md:p-3"
            >
              <Trash2 className="size-4 md:size-6 text-white" />
            </button>
          </div>
        );
      })}
    </>
  );
}
