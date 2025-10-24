import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById } from '../services/productService';
import { Product } from '../../../types/product';

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useProduct(id: string) {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    staleTime: 1000 * 60 * 5,
  });
}
