import { z } from "zod"

export const PaymentMethodDetailSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  channel: z.string(),
  provider_code: z.string(),
  logo_base64: z.string().optional(),
})

export type PaymentMethodDetail = z.infer<typeof PaymentMethodDetailSchema>

export const GetAllPaymentMethodResponseSchema = z.object({
  data: z.array(PaymentMethodDetailSchema),
})

export type GetAllPaymentMethodResponse = z.infer<typeof GetAllPaymentMethodResponseSchema>