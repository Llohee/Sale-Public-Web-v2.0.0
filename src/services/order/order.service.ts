import axiosClient from "@/libs/axiosClient";
import { TransactionDetailResponse } from "../transaction/transaction.schema";
import { CheckoutPaymentDetailResponse, OrderCheckoutRequest, OrderDetailResponse, OrderResponse } from "./order.schema";

const orderApi = {
  getByID(orderId: string): Promise<OrderDetailResponse> {
    const url = `payment-hub/orders/${orderId}`
    return axiosClient.get(url)
  },
  create(body: Partial<OrderResponse>): Promise<OrderDetailResponse> {
    const url = 'payment-hub/orders'
    return axiosClient.post(url, body)
  },
  checkout(orderId: string, body: OrderCheckoutRequest): Promise<CheckoutPaymentDetailResponse> {
    const url = `thirdparty-orders/${orderId}/checkout-thirdparty`
    return axiosClient.post(url, body)
  },
  status(orderId: string): Promise<TransactionDetailResponse> {
    const url = `thirdparty-orders/${orderId}`
    return axiosClient.get(url)
  },
}

export default orderApi