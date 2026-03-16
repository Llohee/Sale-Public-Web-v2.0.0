import { useQuery } from '@tanstack/react-query'
import productApi from './product.service'
import { Filter } from '@/models/api/common'

export const productKeys = {
  all: ['product'] as const,
  list: () => [...productKeys.all, 'list'] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}

export function useGetAllProducts(filter: Filter) {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: () => productApi.getProducts(filter),
  })
}

export function useGetAllProductCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: () => productApi.getAllProductCategories(),
  })
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
  })
}