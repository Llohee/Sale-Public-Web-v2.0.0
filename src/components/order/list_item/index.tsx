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
            className="relative flex gap-2 md:gap-6 justify-between rounded-xl drop-shadow-md p-2 md:p-4 bg-white/70"
          >
            <div className="relative h-full w-32 overflow-hidden rounded-xl bg-linear-to-br from-amber-50 to-amber-100 ring-1 ring-amber-900/10">
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

            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col items-start justify-between">
                  <p className="text-2xl md:text-3xl font-extrabold text-oregon-800">
                    {item.productName}
                  </p>
                  <p className="text-sm text-oregon-700/70">
                    {t("size", { size: item.size })}
                  </p>
                  <p className="text-sm text-oregon-700/70 mt-2">
                    {t("note", { note: item.note ?? "N/A" })}
                  </p>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="text-right">
                    <p className="text-xl font-extrabold text-oregon-900">
                      {costFormat(getCartItemLineTotal(item))}
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-center gap-3">
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="chocolate-outline"
                      aria-label={t("decrease")}
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="rounded-full"
                    >
                      <Minus className="size-4" />
                    </Button>
                    <div className="text-center text-lg md:text-xl font-bold text-oregon-900">
                      {item.quantity}
                    </div>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="chocolate-outline"
                      aria-label={t("increase")}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded-full"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="bg-[#CC0000] p-2 md:p-3 cursor-pointer absolute right-0 top-0 rounded-[0px_8px_0_8px]"
            >
              <Trash2 className="size-4 md:size-6 text-white" />
            </button>
          </div>
        );
      })}
      {comboItems.map((item) => {
        const hasImage = !!item.imageUrl?.trim();

        return (
          <div
            key={item.id}
            className="relative flex gap-2 md:gap-6 justify-between rounded-xl drop-shadow-md p-2 md:p-4 bg-white/70"
          >
            <div className="relative h-full w-32 overflow-hidden rounded-xl bg-linear-to-br from-amber-50 to-amber-100 ring-1 ring-amber-900/10">
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

            <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col items-start justify-between">
                  <p className="text-2xl md:text-3xl font-extrabold text-oregon-800">
                    {item.comboName}
                  </p>
                  <p className="text-sm text-oregon-700/70 mt-2">Combo</p>
                    <p className="text-sm text-oregon-700/70 mt-2">
                      {t("note", { note: item.note ?? "N/A" })}
                    </p>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div className="text-right">
                    <p className="text-xl font-extrabold text-oregon-900">
                      {costFormat(getComboCartItemLineTotal(item))}
                    </p>
                  </div>
                  <div className="inline-flex items-center justify-center gap-3">
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
                      <Minus className="size-4" />
                    </Button>
                    <div className="text-center text-lg md:text-xl font-bold text-oregon-900">
                      {item.quantity}
                    </div>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="chocolate-outline"
                      onClick={() => updateComboQuantity(item.id, item.quantity + 1)}
                      className="rounded-full"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeComboItem(item.id)}
              className="bg-[#CC0000] p-2 md:p-3 cursor-pointer absolute right-0 top-0 rounded-[0px_8px_0_8px]"
            >
              <Trash2 className="size-4 md:size-6 text-white" />
            </button>
          </div>
        );
      })}
    </>
  );
}
