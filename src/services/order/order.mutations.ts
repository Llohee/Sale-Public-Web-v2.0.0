import {
  CheckoutPaymentDetailResponse,
  OrderCheckoutRequest,
  OrderDetailResponse,
  OrderFormRequest,
} from "./order.schema";
import { useAnimatedToast } from "@/share/ui/animated-toast";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import orderApi from "./order.service";
import { BaseAPIResponse } from "@/models/api/common";
import { CartItem } from "@/types/cart";
import { PaymentMethodDetail } from "../payment/payment.schema";

export type UseOrderFormProps = {
  items: CartItem[];
  paymentMethod: PaymentMethodDetail;
  onSuccess: () => void;
};

export const useCreateOrderMutation = ({
  items,
  paymentMethod,
  onSuccess,
}: UseOrderFormProps) => {
  const { addToast } = useAnimatedToast();

  const checkoutMutation = useOrderCheckoutMutation({
    onSuccess: () => {},
  });

  return useMutation<
    OrderDetailResponse,
    AxiosError<BaseAPIResponse>,
    OrderFormRequest
  >({
    mutationFn: (data: OrderFormRequest) => {
      return orderApi.create(data);
    },
    onMutate: () => {
      addToast({ message: "Đang tạo đơn...", type: "info" });
    },
    onSuccess: (data) => {
      addToast({ message: "Tạo đơn thành công", type: "success" });
      checkoutMutation.mutate({
        method: paymentMethod.id,
        provider_code: paymentMethod.provider_code,
        order_id: data.data.externalOrderId,
      });
    },
    onError: () => {
      addToast({ message: "Tạo đơn thất bại", type: "error" });
    },
  });
};

export type UseOrderCheckoutProps = {
  onSuccess: () => void;
};

export const useOrderCheckoutMutation = ({
  onSuccess,
}: UseOrderCheckoutProps) => {
  const { addToast } = useAnimatedToast();
  return useMutation<
    CheckoutPaymentDetailResponse,
    AxiosError<BaseAPIResponse>,
    OrderCheckoutRequest
  >({
    mutationFn: (data: OrderCheckoutRequest) => {
      return orderApi.checkout(data);
    },
    onMutate: () => {
      addToast({ message: "Đang xử lý...", type: "info" });
    },
    onSuccess: (data) => {
      window.location.href = data.data.payment.payment_url;
      addToast({ message: "Thanh toán thành công", type: "success" });
      onSuccess();
    },
    onError: () => {
      addToast({ message: "Thanh toán thất bại", type: "error" });
    },
  });
};
