import { APIListResponseSchema, APIResponseSchema } from '@/models/api/common'
import { z } from 'zod'

export const ProductCategoryDetailSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  tax: z.string(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type ProductCategoryDetail = z.infer<typeof ProductCategoryDetailSchema>

export const GetAllProductCategoriesResponseSchema = APIResponseSchema(z.array(ProductCategoryDetailSchema))
export type GetAllProductCategoriesResponse = z.infer<typeof GetAllProductCategoriesResponseSchema>

export const ProductDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  description: z.string(),
  productCategoryId: z.string(),
  productCategoryName: z.string(),
  activeStatus: z.string(),
  merchantName: z.string(),
  imageUrl: z.string(),
  price: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type ProductDetail = z.infer<typeof ProductDetailSchema>

export const GetAllProductsResponseSchema = APIListResponseSchema(ProductDetailSchema)
export type GetAllProductsResponse = z.infer<typeof GetAllProductsResponseSchema>
