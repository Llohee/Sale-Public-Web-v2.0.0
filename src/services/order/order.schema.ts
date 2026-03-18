import { APIResponseSchema } from "@/models/api/common";
import { z } from "zod";

export const AmountDetailSchema = z.object({
  currency_code: z.string(),
  value: z.number(),
})

export const OrderItemDetailSchema = z.object({
  id: z.string(),
  sku: z.string(),
  quantity: z.number(),
  name: z.string(),
  description: z.string(),
  unit_amount: AmountDetailSchema,
  category: z.string(),
  currency: z.string(),
})

export const OrderDetailSchema = z.object({
  id: z.string(),
  additional_information: z.object({
    purchase_unit: z.object({
      order_id_ref: z.string(),
      amount: AmountDetailSchema,
      items: z.array(OrderItemDetailSchema),
    })
  }),
  channel_id: z.string(),
  created_at: z.string(),
  currency: z.string(),
  order_code: z.string(),
  merchant_code: z.string(),
  merchant_id: z.string(),
  merchant_name: z.string(),
  order_date: z.string(),
  order_desc: z.string(),
  order_id_ref: z.string(),
  service_code: z.string(),
  status: z.enum(["pending", "paid", "failed"]),
  total_amount: z.string(),
  updated_at: z.string(),
}
)

export type OrderDetail = z.infer<typeof OrderDetailSchema>;

export const OrderDetailResponseSchema = APIResponseSchema(OrderDetailSchema)
export type OrderDetailResponse = z.infer<typeof OrderDetailResponseSchema>

export const OrderResponseSchema = z.object({
  serviceCode: z.string(),
  merchantCode: z.string(),
  merchantName: z.string(),
  channelId: z.string(),
  tranDate: z.string(),
  tranDesc: z.string(),
  buyerInfo: z.object({
    name: z.string(),
    phone: z.string(),
    position: z.string(),
    email: z.string(),
  }),
  invoiceInfo: z.object({
    type: z.enum(["business", "individual"]),
    taxCode: z.string(),
    name: z.string(),
    country: z.string(),
    province: z.string(),
    district: z.string(),
    address: z.string(),
    email: z.string(),
  }),
  additionalInformation: z.object({
    purchase_unit: {
      order_id_ref: z.string(),
      amount: AmountDetailSchema,
      items: z.array(OrderItemDetailSchema),
    }
  }),
})
export type OrderResponse = z.infer<typeof OrderResponseSchema>

export const OrderCheckoutRequestSchema = z.object({
  method: z.string(),
  provider_code: z.string(),
})
export type OrderCheckoutRequest = z.infer<typeof OrderCheckoutRequestSchema>

export const CheckoutPaymentDetailSchema = z.object({
  order: z.object({
    code: z.string(),
    discount_amount: z.number(),
    id: z.string(),
    merchant_id: z.string(),
    modified_at: z.string(),
    original_amount: z.number(),
    status: z.string(),
    tenant_code: z.string(),
    total_amount: z.number(),
    total_item: z.number(),
    transaction_code: z.string(),
    transaction_id: z.string(),
  }),
  payment: z.object({
    amount: z.number(),
    currency: z.string(),
    description: z.string(),
    expiration_time: z.string(),
    method: z.string(),
    order_id: z.string(),
    payment_url: z.string(),
    provider_code: z.string(),
    status: z.string(),
    transaction_code: z.string(),
    transaction_id: z.string(),
  }),
})
export type CheckoutPaymentDetail = z.infer<typeof CheckoutPaymentDetailSchema>

export const CheckoutPaymentDetailResponseSchema = APIResponseSchema(CheckoutPaymentDetailSchema)
export type CheckoutPaymentDetailResponse = z.infer<typeof CheckoutPaymentDetailResponseSchema>