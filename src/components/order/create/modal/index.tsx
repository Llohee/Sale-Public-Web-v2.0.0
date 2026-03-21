"use client";

import { PaymentMethodDetail } from "@/services/payment/payment.schema";
import Modal from "@/share/components/modal";
import { useOrderForm } from "./hook";
import InputField from "@/share/components/input";
import { useCart } from "@/providers/cart-provider";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Checkbox } from "@/share/ui/checkbox";
import { OrderCheckoutDrawer } from "./drawer";
import { LAST_ORDER_SNAPSHOT_KEY } from "@/constants/order";
import { getCartItemLineTotal } from "@/types/cart";

type OrderCheckoutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  confirmDisabled: boolean;
  paymentMethods: PaymentMethodDetail[];
  onInAppPaymentSuccess?: () => void;
};

export default function OrderCheckoutModal(props: OrderCheckoutModalProps) {
  // Remount on `open` to reset local UI state without setState-in-effect.
  return <OrderCheckout key={props.open ? "open" : "closed"} {...props} />;
}

function OrderCheckout(props: OrderCheckoutModalProps) {
  const t = useTranslations("order");
  const {
    open,
    onOpenChange,
    title,
    confirmDisabled,
    paymentMethods,
    onInAppPaymentSuccess,
  } = props;

  const { items, clearCart } = useCart();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodDetail>(paymentMethods[0]);
    
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { orderForm, handleFormSubmit } = useOrderForm({
    onNoPaymentUrl: onInAppPaymentSuccess,
    onSuccess: () => {
      if (typeof window !== "undefined") {
        const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
        const totalAmount = items
          .reduce((sum, i) => sum + getCartItemLineTotal(i), 0)
          .toFixed(2);

        sessionStorage.setItem(
          LAST_ORDER_SNAPSHOT_KEY,
          JSON.stringify({
            items: items.map((i) => ({
              ...i,
              note: i.note ?? "",
            })),
            amount: totalAmount,
            totalItems,
            paidAt: new Date().toISOString(),
            paymentMethod: selectedPaymentMethod.display_name ?? "",
            location: "",
          }),
        );
      }

      clearCart();
      onOpenChange(false);
    },
    items,
    paymentMethod: selectedPaymentMethod,
  });

  const checkoutFields = (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <InputField
          name="ordererName"
          register={orderForm.register}
          required
          errors={orderForm.formState.errors.ordererName?.message}
          label={t("fields.name.label")}
          placeholder={t("fields.name.placeholder")}
        />
        <InputField
          label={t("fields.phone.label")}
          name="phoneNumber"
          register={orderForm.register}
          type="tel"
          errors={orderForm.formState.errors.phoneNumber?.message}
          placeholder={t("fields.phone.placeholder")}
          required
        />
      </div>
      <div className="flex flex-col gap-4">
        <div>{t("payment_method_choose")}</div>
        <div className="flex flex-col gap-2">
          {paymentMethods.map((paymentMethod) => (
            <div
              key={paymentMethod.id}
              onClick={() => setSelectedPaymentMethod(paymentMethod)}
              className="flex flex-1 cursor-pointer items-center justify-between gap-2 rounded-lg bg-muted/45 p-2 transition-colors active:bg-muted/70"
            >
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-full overflow-hidden">
                  {paymentMethod.logo_base64 ? (
                    <Image
                      src={`data:image/png;base64,${paymentMethod.logo_base64}`}
                      alt={paymentMethod.display_name}
                      fill
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
                      <ImageOff className="size-4" />
                    </div>
                  )}
                </div>
                {paymentMethod.display_name}
              </div>
              <Checkbox
                className="size-4"
                checked={selectedPaymentMethod?.id === paymentMethod.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        onConfirm={() => orderForm.handleSubmit(handleFormSubmit)()}
        confirmDisabled={confirmDisabled}
        confirmTitle={t("btn.checkout")}
        showCancelButton={false}
      >
        {checkoutFields}
      </Modal>
    );
  }

  return (
    <OrderCheckoutDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      confirmDisabled={confirmDisabled}
      confirmLabel={t("btn.checkout")}
      onCheckout={() => orderForm.handleSubmit(handleFormSubmit)()}
    >
      {checkoutFields}
    </OrderCheckoutDrawer>
  );
}
