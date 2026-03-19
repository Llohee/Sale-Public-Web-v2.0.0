import axiosClient from "@/libs/axiosClient";
import { TransactionDetailResponse } from "../transaction/transaction.schema";
import {
  CheckoutPaymentDetailResponse,
  OrderCheckoutRequest,
  OrderDetailResponse,
  OrderFormRequest,
} from "./order.schema";
import koiAxiosClient from "@/libs/KOI-axiosClient";

const orderApi = {
  getByID(orderId: string): Promise<OrderDetailResponse> {
    const url = `payment-hub/orders/${orderId}`;
    return axiosClient.get(url);
  },
  create(body: OrderFormRequest): Promise<OrderDetailResponse> {
    const url = "orders";
    return axiosClient.post(url, body);
  },
  checkout(body: OrderCheckoutRequest): Promise<CheckoutPaymentDetailResponse> {
    const url = `thirdparty-orders/${body.order_id}/checkout-thirdparty`;
    return koiAxiosClient.post(url, {
      method: body.method,
      provider_code: body.provider_code,
    });
  },
  status(orderId: string): Promise<TransactionDetailResponse> {
    const url = `thirdparty-orders/${orderId}`;
    return axiosClient.get(url);
  },
};

export default orderApi;
