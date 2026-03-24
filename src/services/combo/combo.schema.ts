import { z } from 'zod'
import { ProductDetailSchema } from '@/services/product/product.schema'

export const ComboProductItemSchema = z.object({
  id: z.number(),
  productId: z.string(),
  quantityRequired: z.number(),
  product: ProductDetailSchema,
})
export type ComboProductItem = z.infer<typeof ComboProductItemSchema>

export const ComboDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  discountAmount: z.number(),
  active: z.boolean(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  description: z.string(),
  products: z.array(ComboProductItemSchema),
  createdAt: z.string(),
})
export type ComboDetail = z.infer<typeof ComboDetailSchema>

export const GetAllCombosResponseSchema = z.object({
  status: z.union([z.boolean(), z.string()]),
  message: z.string(),
  data: z.array(ComboDetailSchema),
  timestamp: z.string().optional(),
})
export type GetAllCombosResponse = z.infer<typeof GetAllCombosResponseSchema>

export const GetComboByIdResponseSchema = z.object({
  status: z.union([z.boolean(), z.string()]),
  message: z.string(),
  data: ComboDetailSchema,
  timestamp: z.string().optional(),
})
export type GetComboByIdResponse = z.infer<typeof GetComboByIdResponseSchema>
