import { useQuery } from '@tanstack/react-query'
import comboApi from './combo.service'

export const comboKeys = {
  all: ['combo'] as const,
  list: () => [...comboKeys.all, 'list'] as const,
  detail: (id: string) => [...comboKeys.all, 'detail', id] as const,
}

export function useGetAllCombos() {
  return useQuery({
    queryKey: comboKeys.list(),
    queryFn: () => comboApi.getAllCombos(),
    placeholderData: (previousData) => previousData,
  })
}

export function useGetComboById(id: string) {
  return useQuery({
    queryKey: comboKeys.detail(id),
    queryFn: () => comboApi.getComboById(id),
    enabled: !!id,
  })
}
