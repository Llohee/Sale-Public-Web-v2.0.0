"use client";

import { Button } from "@/share/ui/button";
import { useCart } from "@/providers/cart-provider";
import { useRouter } from "@/i18n/navigation";
import { ChevronLeft, ImageOff, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { ComboDetail } from "@/services/combo/combo.schema";
import { Badge } from "@/share/ui/badge";
import { Textarea } from "@/share/ui/textarea";
import { costFormat, dateFormat } from "@/util/format";
import { COMBO_DEFAULT_QUANTITY } from "@/constants/combo";
import { ComboDetailItems } from "./items";

interface ComboDetailViewProps {
  combo: ComboDetail;
}

export function ComboDetailView({ combo }: ComboDetailViewProps) {
  const t = useTranslations("combo");
  const router = useRouter();
  const [quantity, setQuantity] = useState(COMBO_DEFAULT_QUANTITY);
  const [note, setNote] = useState("");
  const hasImage = !!combo.products[0]?.product.imageUrl?.trim();
  const [imageErrored, setImageErrored] = useState(false);
  const { addComboItem } = useCart();
  const comboBasePrice = useMemo(
    () =>
      combo.products.reduce(
        (sum, item) => sum + (item.product.price ?? 0) * item.quantityRequired,
        0,
      ),
    [combo.products],
  );
  const comboUnitPrice = Math.max(0, comboBasePrice - combo.discountAmount);
  const lineTotal = comboUnitPrice * quantity;
  const comboDateRange = `${dateFormat(combo.startDate)} - ${
    combo.endDate ? dateFormat(combo.endDate) : t("detail.unlimited")
  }`;

  const handleAddToOrder = () => {
    addComboItem({
      combo,
      quantity,
      note: note.trim() ? note.trim() : undefined,
    });
    router.push("/order");
  };

  const backButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.back()}
      className="w-fit shrink-0"
    >
      <ChevronLeft className="size-5" />
      <span className="text-sm font-semibold">{t("detail.back")}</span>
    </Button>
  );

  return (
    <div className="container mx-auto pt-6 pb-36 md:py-28 flex flex-col gap-6 md:gap-8">
      <div className="shrink-0 md:hidden">{backButton}</div>
      <div className="p-0 md:bg-transparent md:shadow-none md:ring-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4">
          <div className="col-span-12 md:col-span-4 order-3 md:order-1 flex flex-col gap-5 md:gap-8">
            <div className="hidden md:block shrink-0">{backButton}</div>

            <div className="flex flex-col gap-3.5">
              <div className="flex min-w-0 w-full flex-row items-start justify-between gap-4 md:block">
                <h1 className="min-w-0 flex-1 text-4xl md:text-5xl font-extrabold text-oregon-800 md:w-full md:truncate md:flex-none">
                  {combo.name}
                </h1>
                <Badge variant="outline" className="h-fit w-fit shrink-0 md:hidden">
                  {combo.code}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="h-fit">
                  {combo.active ? t("detail.status_active") : t("detail.status_inactive")}
                </Badge>
                <Badge variant="outline" className="h-fit">
                  {comboDateRange}
                </Badge>
              </div>

              {combo.description ? (
                <p className="text-sm italic leading-relaxed text-oregon-700/80 md:hidden">
                  {combo.description}
                </p>
              ) : null}
            </div>

            <div className="w-fit flex flex-col items-start gap-2 min-w-0">
              <p className="text-md leading-none text-oregon-900 md:text-lg">
                {t("detail.quantity")}
              </p>
              <div className="inline-flex items-center justify-center gap-3 bg-white">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="chocolate-outline"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-full"
                >
                  <Minus className="size-4" />
                </Button>
                <div className="text-center text-lg md:text-xl font-bold text-oregon-900">
                  {quantity}
                </div>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="chocolate-outline"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="rounded-full"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <p className="hidden text-lg font-semibold sm:block">
              {t("detail.total")}: {costFormat(lineTotal)}
            </p>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-oregon-700/60">
                {t("detail.note")}
              </p>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={t("detail.note_placeholder")}
                className="min-h-20 w-full resize-y rounded-lg border-oregon-700/10 bg-amber-50/35 text-sm text-oregon-900 placeholder:text-oregon-700/35 focus-visible:border-oregon-700/25 focus-visible:ring-oregon-700/10"
              />
            </div>

            <div className="md:hidden flex w-full items-center justify-between gap-4">
              <div className="shrink-0 flex flex-col leading-tight">
                <span className="text-sm font-medium text-oregon-700/70">
                  {t("detail.total")}
                </span>
                <p className="text-xl font-extrabold text-oregon-900">
                  {costFormat(lineTotal)}
                </p>
              </div>
              <Button
                type="button"
                variant="dive"
                className="h-12 w-12 shrink-0 rounded-full p-0 shadow-none ring-1 ring-amber-950/20 sm:shadow-md"
                onClick={handleAddToOrder}
              >
                <ShoppingCart className="size-5" />
              </Button>
            </div>

            <Button
              variant="dive"
              size="xl"
              className="hidden md:flex w-full rounded-full px-6 md:px-8 py-2 text-base md:text-lg font-semibold gap-4"
              onClick={handleAddToOrder}
            >
              <ShoppingCart className="size-5" />
              {t("detail.add_to_order")}
            </Button>
          </div>

          <div className="col-span-12 md:col-span-3 order-2 md:order-2 hidden md:flex flex-col gap-3.5 md:pt-16">
            <div className="flex flex-col items-start gap-2">
              <Badge variant="outline" className="h-fit w-fit">
                {combo.code}
              </Badge>
              {combo.description ? (
                <p className="text-sm italic leading-relaxed text-oregon-700/80">
                  {combo.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-lg bg-transparent md:rounded-3xl md:ring-1 md:ring-black/5 col-span-12 md:col-span-5 order-1 md:order-3 aspect-3/4 max-h-[360px] md:aspect-auto md:max-h-none md:h-full">
            {hasImage && !imageErrored ? (
              <Image
                src={combo.products[0]?.product.imageUrl ?? ""}
                alt={combo.name}
                className="h-full w-full object-cover transition-transform duration-300"
                fill
                onError={() => setImageErrored(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-50 to-amber-100 text-amber-900/60">
                <div className="flex flex-col items-center justify-center gap-2">
                  <ImageOff className="size-10" />
                  <span className="text-sm font-semibold tracking-wide">
                    {t("card.no_image")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ComboDetailItems products={combo.products} compact />
    </div>
  );
}
