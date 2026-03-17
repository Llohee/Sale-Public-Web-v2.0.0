"use client";

import { useCart } from "@/providers/cart-provider";
import { getCartItemLineTotal } from "@/types/cart";
import { Button } from "@/share/ui/button";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useGetAllPaymentMethods } from "@/services/payment/payment.query-options";
import { notFound } from "next/navigation";
import { LoadingPage } from "@/share/components/full-page/loading";

export function OrderWrapper() {
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

  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    totalAmount,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 py-12">
        <p className="text-center text-muted-foreground">
          Chưa có sản phẩm nào trong đơn hàng.
        </p>
        <Link href="/product">
          <Button variant="dive" size="lg">
            Xem sản phẩm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Đơn hàng của bạn</h1>
        <Button
          variant="default"
          size="sm"
          onClick={clearCart}
          className="text-muted-foreground hover:text-foreground"
        >
          Xóa tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <ul className="flex flex-col gap-4 col-span-8">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-2xl border bg-card/95 p-4 shadow-sm"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium leading-tight">
                      {item.productName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Size {item.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Xóa"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border bg-muted/30 p-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="flex size-7 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex size-7 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <p className="font-semibold">
                    ${getCartItemLineTotal(item).toFixed(2)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="sticky bottom-0 rounded-2xl border bg-card/95 p-4 shadow-sm col-span-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Tổng ({totalItems} sản phẩm)</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <Button variant="dive" size="xl" className="mt-4 w-full">
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
