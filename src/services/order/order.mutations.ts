"use client";

import {
  CheckoutPaymentDetailResponse,
  OrderCheckoutRequest,
  OrderDetailResponse,
  OrderFormRequest,
} from "./order.schema";
import { useAnimatedToast } from "@/share/ui/animated-toast";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import orderApi from "./order.service";
import { BaseAPIResponse } from "@/models/api/common";
import { CartItem } from "@/types/cart";
import { PaymentMethodDetail } from "../payment/payment.schema";

export function useAddCartItemToasts() {
  const t = useTranslations("order.toast");
  const { addToast } = useAnimatedToast();

  const onMutate = useCallback(() => {
    addToast({
      message: t("adding_cart_item"),
      type: "info",
      dismissOthers: true,
    });
  }, [addToast, t]);

  const onSuccess = useCallback(() => {
    addToast({
      message: t("cart_item_added_success"),
      type: "success",
      dismissOthers: true,
    });
  }, [addToast, t]);

  const onError = useCallback(() => {
    addToast({
      message: t("cart_item_added_error"),
      type: "error",
      dismissOthers: true,
    });
  }, [addToast, t]);

  return { onMutate, onSuccess, onError };
}

export type UseOrderFormProps = {
  items: CartItem[];
  paymentMethod: PaymentMethodDetail;
  onSuccess: () => void;
};

export const useCreateOrderMutation = (props: UseOrderFormProps) => {
  const { paymentMethod, onSuccess } = props;
  const t = useTranslations("order.toast");
  const { addToast } = useAnimatedToast();

  const checkoutMutation = useOrderCheckoutMutation({
    onSuccess,
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
      addToast({
        message: t("creating_order"),
        type: "info",
        dismissOthers: true,
      });
    },
    onSuccess: (data) => {
      addToast({
        message: t("order_created_success"),
        type: "success",
        dismissOthers: true,
      });
      checkoutMutation.mutate({
        method: paymentMethod.channel,
        provider_code: paymentMethod.provider_code,
        order_id: data.data.externalOrderId,
      });
    },
    onError: () => {
      addToast({
        message: t("order_created_error"),
        type: "error",
        dismissOthers: true,
      });
    },
  });
};

export type UseOrderCheckoutProps = {
  onSuccess: () => void;
};

export const useOrderCheckoutMutation = ({
  onSuccess,
}: UseOrderCheckoutProps) => {
  const t = useTranslations("order.toast");
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
      addToast({
        message: t("processing_payment"),
        type: "info",
        dismissOthers: true,
      });
    },
    onSuccess: (data) => {
      onSuccess();
      const paymentUrl = data.data.payment.payment_url?.trim() ?? "";
      if (paymentUrl) {
        addToast({
          message: t("payment_success"),
          type: "success",
          dismissOthers: true,
        });
        window.location.href = paymentUrl;
        return;
      }
      addToast({
        message: t("payment_success"),
        type: "success",
        dismissOthers: true,
      });
    },
    onError: () => {
      addToast({
        message: t("payment_error"),
        type: "error",
        dismissOthers: true,
      });
    },
  });
};
