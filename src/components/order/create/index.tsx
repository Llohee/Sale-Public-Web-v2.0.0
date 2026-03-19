import { useCart } from "@/providers/cart-provider";
import ConfirmModal from "@/share/components/modal/confirm";
import { Button } from "@/share/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import OrderCheckoutModal from "./modal";
import { useGetAllPaymentMethods } from "@/services/payment/payment.query-options";

export default function OrderForm() {
  const t = useTranslations("order");
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const {
    totalItems,
    totalAmount,
    clearCart,
  } = useCart();

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
        <div className="sticky top-6 flex flex-col gap-6 rounded-xl bg-white/85 p-5 ">
          <div className="flex justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-extrabold text-oregon-900">
                {t("summary_title")}
              </h2>
              <p className="text-sm text-oregon-700/70">
                {t("subtotal_label", { count: totalItems })}
              </p>
            </div>
            <Button
              variant="chocolate-outline"
              size="sm"
              onClick={() => setClearConfirmOpen(true)}
            >
              {t("clear_all")}
            </Button>
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
