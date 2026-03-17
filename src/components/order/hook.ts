'use client'

import { BaseAPIResponse } from '@/models/api/common'
import {
  CheckoutPaymentDetailResponse,
  OrderCheckoutRequest
} from '@/services/order/order.schema'
import orderApi from '@/services/order/order.service'
import { useAnimatedToast } from '@/share/ui/animated-toast'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type UseOrderCheckoutProps = {
  onSuccess: () => void
  orderId: string
}

export const useOrderCheckout = ({
  onSuccess,
  orderId,
}: UseOrderCheckoutProps) => {
  const orderForm = useForm<OrderCheckoutRequest>({
    defaultValues: {
      method: "",
      provider_code: "",
    },
  })
  useEffect(() => {
    orderForm.reset()
  }, [orderForm])

  const mutation = useOrderCheckoutMutation({ onSuccess, orderId })
  const handleFormSubmit: SubmitHandler<OrderCheckoutRequest> = (data) => {
    console.log(data)
    mutation.mutate(data)
  }
  return {
    orderForm,
    handleFormSubmit,
    mutation,
  }
}

export const useOrderCheckoutMutation = ({
  onSuccess,
  orderId,
}: UseOrderCheckoutProps) => {
  const { addToast } = useAnimatedToast();
  return useMutation<
    CheckoutPaymentDetailResponse,
    AxiosError<BaseAPIResponse>,
    OrderCheckoutRequest
  >({
    mutationFn: (data: OrderCheckoutRequest) => {
      return orderApi.checkout(orderId, data)
    },
    onMutate: () => {
      addToast({ message: 'Đang xử lý...', type: 'info' })
    },
    onSuccess: (data) => {
      window.location.href = data.data.payment.payment_url;
      addToast({ message: 'Thanh toán thành công', type: 'success' })
      onSuccess();
    },
    onError: () => {
      addToast({ message: 'Thanh toán thất bại', type: 'error' })
    },
  });
};