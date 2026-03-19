import { ENUM_TYPE_QUERY, ENUM_DIR_SORT, DEFAULT_PAGE_SIZE } from "@/constants/system"
import { z } from "zod"

export const BaseAPIResponseSchema = z.object({
  message: z.string(),
  status: z.string(),
})

export type BaseAPIResponse = z.infer<typeof BaseAPIResponseSchema>

export const APIResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseAPIResponseSchema.extend({
    data: dataSchema,
  })

export const PaginationSchema = z.object({
  timestamp: z.string(),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
})

export type Pagination = z.infer<typeof PaginationSchema>

export const APIListResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  APIResponseSchema(z.array(itemSchema)).extend(PaginationSchema.shape)

export const PutFilterSchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10),
  offset: z.coerce.number().default(0),
})

export type PutFilterQuery = z.infer<typeof PutFilterSchema>

//For filter param
export const FilterQuerySchema = z.object({
  name: z.string(),
  type: z.enum(ENUM_TYPE_QUERY),
  value: z.union([z.string(), z.array(z.string()), z.boolean()]),
  sub: z.string().optional(),
})
export const FilterSortSchema = z.object({
  name: z.string(),
  dir: z.enum(ENUM_DIR_SORT),
})
export const FilterSchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(DEFAULT_PAGE_SIZE),
  offset: z.coerce.number().default(0),
  keyword: z.string().optional(),
  productCategoryId: z.string().optional(),
  productCategoryCode: z.string().optional(),
  query: z.array(FilterQuerySchema).optional(),
  sort: FilterSortSchema.optional(),
})

export type FilterQuery = z.infer<typeof FilterQuerySchema>
export type FilterSort = z.infer<typeof FilterSortSchema>
export type Filter = z.infer<typeof FilterSchema>
export type FilterSearchParam = Partial<{
  limit: number
  page: number
  keyword: string
  sort: string
  query: string
  productCategoryId: string
  category: string
  productCategoryCode: string
}>