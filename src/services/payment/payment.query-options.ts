import { useQuery } from '@tanstack/react-query'
import paymentApi from './payment.service'

export const paymentKeys = {
  all: ['payment'] as const,
  list: () => [...paymentKeys.all, 'list'] as const,
}

export function useGetAllPaymentMethods() {
  return useQuery({
    queryKey: paymentKeys.list(),
    queryFn: () => paymentApi.getAllPaymentMethod(),
  })
}