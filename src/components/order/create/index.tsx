"use client";

import { useCart } from "@/providers/cart-provider";
import ConfirmModal from "@/share/components/modal/confirm";
import { useTranslations } from "next-intl";
import { useState } from "react";
import OrderCheckoutModal from "./modal";
import { OrderCreateTotal } from "../total";
import { useGetAllPaymentMethods } from "@/services/payment/payment.query-options";
import { SpinnerCustom } from "@/share/ui/spinner";
import NotFoundPage from "@/share/components/full-page/404";


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
    return <SpinnerCustom className="size-10" />;
  }

  if (isErrorPaymentMethods) {
    return <NotFoundPage />;
  }

  if (isSuccessPaymentMethods) {
    return (
      <>
        <OrderCreateTotal
          totalItems={totalItems}
          totalAmount={totalAmount}
          onClearClick={() => setClearConfirmOpen(true)}
          onContinueClick={() => setOpenCheckoutModal(true)}
        />
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
