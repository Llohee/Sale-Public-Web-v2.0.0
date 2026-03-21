"use client";

import {
  useCreateOrderMutation,
  useOrderCheckoutMutation,
  UseOrderCheckoutProps,
  UseOrderFormProps,
} from "@/services/order/order.mutations";
import {
  OrderCheckoutRequest,
  OrderFormRequest,
} from "@/services/order/order.schema";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const useOrderForm = ({
  onSuccess,
  items,
  paymentMethod,
}: UseOrderFormProps) => {
  const orderForm = useForm<OrderFormRequest>({
    defaultValues: {
      ordererName: "",
      phoneNumber: "",
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        note: item.note,
      })),
    },
  });

  useEffect(() => {
    orderForm.reset({
      ordererName: "",
      phoneNumber: "",
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        note: item.note,
      })),
    });
  }, [orderForm, items]);

  const mutation = useCreateOrderMutation({ onSuccess, items, paymentMethod });
  const handleFormSubmit: SubmitHandler<OrderFormRequest> = (data) => {
    mutation.mutate(data);
  };
  return {
    orderForm,
    handleFormSubmit,
    mutation,
  };
};

export const useOrderCheckout = ({ onSuccess }: UseOrderCheckoutProps) => {
  const orderForm = useForm<OrderCheckoutRequest>({
    defaultValues: {
      method: "",
      provider_code: "",
    },
  });
  useEffect(() => {
    orderForm.reset();
  }, [orderForm]);

  const mutation = useOrderCheckoutMutation({ onSuccess });
  const handleFormSubmit: SubmitHandler<OrderCheckoutRequest> = (data) => {
    mutation.mutate(data);
  };
  return {
    orderForm,
    handleFormSubmit,
    mutation,
  };
};
