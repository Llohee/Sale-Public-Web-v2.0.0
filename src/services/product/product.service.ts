import axiosClient from '@/libs/axiosClient';
import { Filter } from '@/models/api/common';
import { convertQueryAPI } from '@/util/filter';
import type {
  GetAllProductCategoriesResponse,
  GetAllProductsResponse,
  GetProductByIdResponse,
  ProductDetail,
} from './product.schema';

const productApi = {
  getProducts(filter: Filter): Promise<GetAllProductsResponse> {
    const url = "/products/actions/search";
    return axiosClient.get(url, {
      params: convertQueryAPI(filter),
    });
  },
  getAllProductCategories(): Promise<GetAllProductCategoriesResponse> {
    const url = "/product-categories";
    return axiosClient.get(url);
  },
  getProductById(id: string): Promise<GetProductByIdResponse> {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },
};

export default productApi;
