import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { Filter } from '@/models/api/common'
import { filterKeyForInfinite } from '@/util/filter'
import productApi from './product.service'

export const productKeys = {
  all: ['product'] as const,
  list: (filter: Filter) => [...productKeys.all, 'list', filter] as const,
  listInfinite: (filter: Omit<Filter, 'offset'>) =>
    [...productKeys.all, 'list', 'infinite', filter] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}

export function useGetAllProducts(filter: Filter) {
  return useQuery({
    queryKey: productKeys.list(filter),
    queryFn: () => productApi.getProducts(filter),
    placeholderData: (previousData) => previousData,
  })
}

export function useInfiniteProductList(filter: Filter) {
  const keyFilter = filterKeyForInfinite(filter)
  return useInfiniteQuery({
    queryKey: productKeys.listInfinite(keyFilter),
    initialPageParam: 0,
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam }) =>
      productApi.getProducts({
        ...filter,
        offset: pageParam,
        limit: filter.limit,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0)
      if (lastPage.data.length === 0 || loaded >= lastPage.totalElements) {
        return undefined
      }
      return loaded
    },
  })
}

export function useGetAllProductCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: () => productApi.getAllProductCategories(),
    placeholderData: (previousData) => previousData,
  })
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
  })
}