import { TRANSACTION_STATUS } from "@/constants/transaction";
import { APIResponseSchema } from "@/models/api/common";
import { z } from "zod";

export const TransactionDetailSchema = z.object({
  order: z.object({
    code: z.string(),
    discount_amount: z.number(),
    id: z.string(),
    merchant_id: z.string(),
    modified_at: z.string(),
    created_at: z.string(),
    original_amount: z.number(),
    status: z.string(),
    tenant_code: z.string(),
    total_amount: z.number(),
    total_item: z.number(),
    transaction_code: z.string(),
    transaction_id: z.string(),
  }),
  status: z.enum(TRANSACTION_STATUS)
})
export type TransactionDetail = z.infer<typeof TransactionDetailSchema>
export const TransactionDetailResponseSchema = APIResponseSchema(TransactionDetailSchema)
export type TransactionDetailResponse = z.infer<typeof TransactionDetailResponseSchema>