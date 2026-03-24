import { TRANSACTION_STATUS } from "@/constants/transaction";
import { APIResponseSchema } from "@/models/api/common";
import { z } from "zod";

export const AmountDetailSchema = z.object({
  currency_code: z.string(),
  value: z.number(),
});

export const OrderItemDetailSchema = z.object({
  id: z.string(),
  sku: z.string(),
  quantity: z.number(),
  name: z.string(),
  description: z.string(),
  unit_amount: AmountDetailSchema,
  category: z.string(),
  currency: z.string(),
});

export const OrderDetailSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  orderDate: z.string(),
  status: z.enum(TRANSACTION_STATUS),
  ordererName: z.string(),
  phoneNumber: z.string(),
  subtotal: z.number(),
  discountAmount: z.number(),
  totalAmount: z.number(),
  comboId: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      productId: z.string(),
      productName: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      attribute: z.string().optional(),
      note: z.string().optional(),
      lineTotal: z.number(),
    }),
  ),
  createdAt: z.string(),
  externalOrderId: z.string(),
  externalOrderCode: z.string(),
});

export type OrderDetail = z.infer<typeof OrderDetailSchema>;

export const OrderDetailResponseSchema = APIResponseSchema(OrderDetailSchema);
export type OrderDetailResponse = z.infer<typeof OrderDetailResponseSchema>;

export const OrderFormRequestSchema = z.object({
  ordererName: z.string().min(1, "error.required"),
  phoneNumber: z.string().min(1, "error.required"),
  comboItems: z
    .array(
      z.object({
        comboId: z.string(),
        quantity: z.number(),
      }),
    )
    .optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      note: z.string().optional(),
    }),
  ),
});
export type OrderFormRequest = z.infer<typeof OrderFormRequestSchema>;

export const OrderCheckoutRequestSchema = z.object({
  method: z.string(),
  provider_code: z.string(),
  tenant_code: z.string(),
  order_id: z.string(),
});
export type OrderCheckoutRequest = z.infer<typeof OrderCheckoutRequestSchema>;

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
});
export type CheckoutPaymentDetail = z.infer<typeof CheckoutPaymentDetailSchema>;

export const CheckoutPaymentDetailResponseSchema = APIResponseSchema(
  CheckoutPaymentDetailSchema,
);
export type CheckoutPaymentDetailResponse = z.infer<
  typeof CheckoutPaymentDetailResponseSchema
>;
