import { PaymentMethodDetail } from "@/services/payment/payment.schema";
import Modal from "@/share/components/modal";
import { useOrderForm } from "./hook";
import InputField from "@/share/components/input";
import { useCart } from "@/providers/cart-provider";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { CheckIcon, ImageOff } from "lucide-react";
import { Checkbox } from "@/share/ui/checkbox";

type OrderCheckoutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  confirmDisabled: boolean;
  paymentMethods: PaymentMethodDetail[];
};

export default function OrderCheckoutModal(props: OrderCheckoutModalProps) {
  return <OrderCheckout {...props} />;
}

function OrderCheckout(props: OrderCheckoutModalProps) {
  const t = useTranslations("order");
  const { open, onOpenChange, title, confirmDisabled, paymentMethods } = props;

  const { items } = useCart();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodDetail>(paymentMethods[0]);
    
  const { orderForm, handleFormSubmit } = useOrderForm({
    onSuccess: () => {},
    items,
    paymentMethod: selectedPaymentMethod,
  });

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
            label="Số điện thoại"
            name="phoneNumber"
            register={orderForm.register}
            errors={orderForm.formState.errors.phoneNumber?.message}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
        <div className="flex flex-col gap-4">
          <div>Chọn phương thức thanh toán</div>
          <div className="flex flex-col gap-2">
            {paymentMethods.map((paymentMethod) => (
              <div
                key={paymentMethod.id}
                onClick={() => setSelectedPaymentMethod(paymentMethod)}
                className="flex  flex-1 justify-between items-center gap-2 cursor-pointer p-2 border border-border rounded-lg"
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
    </Modal>
  );
}
