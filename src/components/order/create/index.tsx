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
        <div className="sticky top-6 flex flex-col gap-5 rounded-2xl bg-linear-to-br from-amber-50/70 via-amber-50/90 to-amber-100/55 p-6 md:top-8 lg:top-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-0.5">
              <h2 className="text-lg font-extrabold tracking-tight text-oregon-900 sm:text-xl">
                {t("summary_title")}
              </h2>
              <p className="text-sm font-medium text-oregon-700/65">
                {t("subtotal_label", { count: totalItems })}
              </p>
            </div>
            <Button
              variant="chocolate-outline"
              size="sm"
              className="shrink-0 rounded-full px-3 text-xs font-semibold sm:text-sm"
              onClick={() => setClearConfirmOpen(true)}
            >
              {t("clear_all")}
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl bg-linear-to-b from-white/30 via-amber-50/40 to-amber-100/45 p-4">
            <div className="flex items-baseline justify-between gap-3 text-sm text-oregon-800/90">
              <span className="font-medium">{t("subtotal_money")}</span>
              <span className="tabular-nums font-semibold tracking-tight text-oregon-900">
                {costFormat(totalAmount)}
              </span>
            </div>
            <div
              className="my-3 h-px w-full bg-linear-to-r from-transparent via-amber-900/12 to-transparent"
              aria-hidden
            />
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-base font-extrabold text-oregon-900 sm:text-lg">
                {t("total_money")}
              </span>
              <span className="tabular-nums text-xl font-extrabold tracking-tight text-oregon-900 sm:text-2xl">
                {costFormat(totalAmount)}
              </span>
            </div>
          </div>

          <Button
            variant="dive"
            size="xl"
            className="mt-1 w-full rounded-full font-semibold transition-transform active:scale-[0.99]"
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
