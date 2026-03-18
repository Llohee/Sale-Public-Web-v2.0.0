"use client";

import { useState } from "react";
import { useCart } from "@/providers/cart-provider";
import { getCartItemLineTotal } from "@/types/cart";
import { Button } from "@/share/ui/button";
import { Textarea } from "@/share/ui/textarea";
import Image from "next/image";
import { ImageOff, Minus, Plus, Receipt, Trash2 } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useGetAllPaymentMethods } from "@/services/payment/payment.query-options";
import { notFound } from "next/navigation";
import { LoadingPage } from "@/share/components/full-page/loading";
import ConfirmModal from "@/share/components/modal/confirm";
import { LAST_ORDER_SNAPSHOT_KEY } from "@/constants/order";

export function OrderWrapper() {
  const router = useRouter();
  const t = useTranslations("order");
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalAmount,
    clearCart,
  } = useCart();
  const {
    data: paymentMethods,
    isLoading: isLoadingPaymentMethods,
    isError: isErrorPaymentMethods,
  } = useGetAllPaymentMethods();

  if (isLoadingPaymentMethods || isErrorPaymentMethods) {
    return <LoadingPage />;
  }

  if (isErrorPaymentMethods) {
    return notFound();
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-5 px-4 py-16 text-center">
        <div className="rounded-full bg-oregon-50 p-4 text-oregon-700 shadow-sm ring-1 ring-oregon-700/10">
          <Receipt className="size-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-oregon-900">
            {t("empty.title")}
          </h1>
          <p className="text-center text-muted-foreground">
            {t("empty.description")}
          </p>
        </div>
        <p className="max-w-md text-sm text-oregon-700/70">
          {t("empty.hint")}
        </p>
        <Link href="/product">
          <Button variant="dive" size="lg" className="rounded-full px-8">
            {t("empty.browse_products")}
          </Button>
        </Link>
      </div>
    );
  }

  const subtotalLabel = t("subtotal_label", { count: totalItems });
  const removingItem = items.find((item) => item.id === removingItemId) ?? null;

  return (
    <div className="container mx-auto flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-4 rounded-[2rem] bg-white/70 px-5 py-5 shadow-sm ring-1 ring-amber-900/10 supports-backdrop-filter:backdrop-blur-md sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-oregon-900 sm:text-3xl">
              {t("title")}
            </h1>
            <p className="text-sm text-oregon-700/70">
              {t("subtitle")}
            </p>
          </div>
          <Button
            variant="chocolate-outline"
            size="sm"
            onClick={() => setClearConfirmOpen(true)}
            className="w-full rounded-full border-oregon-700/25 bg-white shadow-sm sm:w-auto"
          >
            {t("clear_all")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <ul className="col-span-8 flex flex-col gap-5">
          {items.map((item) => {
            const hasImage = !!item.imageUrl?.trim();

            return (
              <li
                key={item.id}
                className="flex flex-col gap-4 rounded-[2rem] bg-white/80 p-4 shadow-sm ring-1 ring-amber-900/10 supports-backdrop-filter:backdrop-blur-md sm:flex-row sm:items-center sm:p-5"
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[1.5rem] bg-linear-to-br from-amber-50 to-amber-100 ring-1 ring-amber-900/10 sm:h-32 sm:w-32">
                  {hasImage ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
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
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-lg font-bold leading-tight text-oregon-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-oregon-700/70">
                          {t("size", { size: item.size })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRemovingItemId(item.id)}
                        className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={t("remove")}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-oregon-700/10 bg-oregon-50/40 p-1 shadow-sm">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="flex size-8 items-center justify-center rounded-full text-oregon-800 transition-colors hover:bg-white"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-oregon-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex size-8 items-center justify-center rounded-full text-oregon-800 transition-colors hover:bg-white"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-oregon-700/60">
                          {t("line_total_label")}
                        </p>
                        <p className="text-xl font-extrabold text-oregon-900">
                          ${getCartItemLineTotal(item).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-oregon-700/60">
                        {t("note_label")}
                      </p>
                      <Textarea
                        value={itemNotes[item.id] ?? ""}
                        onChange={(event) =>
                          setItemNotes((prev) => ({
                            ...prev,
                            [item.id]: event.target.value,
                          }))
                        }
                        placeholder={t("note_placeholder")}
                        className="min-h-20 rounded-2xl border-oregon-700/10 bg-amber-50/35 text-sm text-oregon-900 placeholder:text-oregon-700/35 focus-visible:border-oregon-700/25 focus-visible:ring-oregon-700/10"
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="col-span-4">
          <div className="rounded-[2rem] bg-white/85 p-5 shadow-sm ring-1 ring-amber-900/10 supports-backdrop-filter:backdrop-blur-md lg:sticky lg:top-6 lg:p-6">
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-oregon-900">
                  {t("summary_title")}
                </h2>
                <p className="text-sm text-oregon-700/70">{subtotalLabel}</p>
              </div>

              <div className="rounded-2xl bg-amber-50/70 p-4 ring-1 ring-amber-900/10">
                <div className="flex items-center justify-between text-sm text-oregon-700/80">
                  <span>{t("subtotal_money")}</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xl font-extrabold text-oregon-900">
                  <span>{t("total_money")}</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="dive"
                size="xl"
                className="w-full rounded-full"
                onClick={() => {
                  const paymentMethod = paymentMethods?.data[0]?.display_name;
                  const paidAt = new Date().toISOString();
                  const orderSnapshot = {
                    items: items.map((item) => ({
                      ...item,
                      note: itemNotes[item.id] ?? "",
                    })),
                    amount: totalAmount.toFixed(2),
                    totalItems,
                    paidAt,
                    paymentMethod,
                  };

                  if (typeof window !== "undefined") {
                    sessionStorage.setItem(
                      LAST_ORDER_SNAPSHOT_KEY,
                      JSON.stringify(orderSnapshot),
                    );
                  }

                  clearCart();
                  router.push(
                    `/order/success?amount=${encodeURIComponent(
                      totalAmount.toFixed(2),
                    )}&paidAt=${encodeURIComponent(
                      paidAt,
                    )}&paymentMethod=${encodeURIComponent(
                      paymentMethod ?? "",
                    )}`,
                  );
                }}
              >
                {t("checkout")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={clearConfirmOpen}
        onOpenChange={setClearConfirmOpen}
        title={t("confirm_clear.title")}
        description={t("confirm_clear.description")}
        onConfirm={clearCart}
        cancelTitle={t("confirm_clear.cancel")}
        confirmTitle={t("confirm_clear.confirm")}
      />

      <ConfirmModal
        open={!!removingItemId}
        onOpenChange={(open) => {
          if (!open) setRemovingItemId(null);
        }}
        title={t("confirm_remove_item.title")}
        description={
          removingItem
            ? t("confirm_remove_item.description_with_name", {
                name: removingItem.productName,
              })
            : t("confirm_remove_item.description")
        }
        onConfirm={() => {
          if (removingItemId) removeItem(removingItemId);
          setRemovingItemId(null);
        }}
        cancelTitle={t("confirm_remove_item.cancel")}
        confirmTitle={t("confirm_remove_item.confirm")}
      />
    </div>
  );
}
