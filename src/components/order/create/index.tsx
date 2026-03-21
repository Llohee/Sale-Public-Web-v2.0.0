"use client";

import { useCart } from "@/providers/cart-provider";
import ConfirmModal from "@/share/components/modal/confirm";
import { Button } from "@/share/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import OrderCheckoutModal from "./modal";
import { useGetAllPaymentMethods } from "@/services/payment/payment.query-options";
import { costFormat } from "@/util/format";

export default function OrderForm() {
  const t = useTranslations("order");
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const { totalItems, totalAmount, clearCart } = useCart();

  const {
    data: paymentMethods,
    isLoading: isLoadingPaymentMethods,
    isError: isErrorPaymentMethods,
    isSuccess: isSuccessPaymentMethods,
  } = useGetAllPaymentMethods();

  if (isLoadingPaymentMethods) {
    return <div>Loading...</div>;
  }

  if (isErrorPaymentMethods) {
    return <div>Error</div>;
  }

  if (isSuccessPaymentMethods) {
    return (
      <>
        <div className="sticky top-6 flex flex-col gap-4 rounded-lg bg-muted px-4 py-4 shadow-md md:top-8 lg:top-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-0.5">
              <h2 className="text-lg font-semibold leading-snug text-foreground">
                {t("summary_title")}
              </h2>
              <p className="text-base text-muted-foreground">
                {t("subtotal_label", { count: totalItems })}
              </p>
            </div>
            <Button
              type="button"
              variant="chocolate-outline"
              size="default"
              className="shrink-0 px-4 text-base"
              onClick={() => setClearConfirmOpen(true)}
            >
              {t("clear_all")}
            </Button>
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            <div className="flex items-center justify-between gap-3 text-base text-muted-foreground">
              <span>{t("subtotal_money")}</span>
              <span className="tabular-nums font-medium text-foreground">
                {costFormat(totalAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border pt-2 text-lg font-semibold text-foreground">
              <span>{t("total_money")}</span>
              <span className="tabular-nums text-xl">{costFormat(totalAmount)}</span>
            </div>
          </div>

          <Button
            type="button"
            variant="default"
            size="xl"
            className="w-full"
            onClick={() => setOpenCheckoutModal(true)}
            // onClick={() => {
            //   const paymentMethod = paymentMethods?.data[0]?.display_name;
            //   const paidAt = new Date().toISOString();
            //   const orderSnapshot = {
            //     items: items.map((item) => ({
            //       ...item,
            //       note: itemNotes[item.id] ?? "",
            //     })),
            //     amount: totalAmount.toFixed(2),
            //     totalItems,
            //     paidAt,
            //     paymentMethod,
            //   };

            //   if (typeof window !== "undefined") {
            //     sessionStorage.setItem(
            //       LAST_ORDER_SNAPSHOT_KEY,
            //       JSON.stringify(orderSnapshot),
            //     );
            //   }

            //   clearCart();
            //   router.push(
            //     `/order/success?amount=${encodeURIComponent(
            //       totalAmount.toFixed(2),
            //     )}&paidAt=${encodeURIComponent(
            //       paidAt,
            //     )}&paymentMethod=${encodeURIComponent(paymentMethod ?? "")}`,
            //   );
            // }}
          >
            {t("btn.continue")}
          </Button>
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
        <OrderCheckoutModal
          open={openCheckoutModal}
          onOpenChange={setOpenCheckoutModal}
          title={t("checkout_title")}
          confirmDisabled={false}
          paymentMethods={paymentMethods.data}
        />
      </>
    );
  }
}
