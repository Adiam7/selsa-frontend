import axios from 'axios';
import {
  Product,
  ProductVariant,
  ProductImage,
  ProductOptionType,
  ProductOptionValue,
  StockControl,
} from '@/types/product';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // adjust if needed
});

// Fetch all products
export async function fetchProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>('/api/products/');
  return res.data;
}

// Fetch single product by ID or slug
export async function fetchProductById(id: string): Promise<Product> {
  const res = await api.get<Product>(`/api/products/${id}/`);
  return res.data;
}

// Create new product
export interface CreateProductInput {
  name: string;
  sku: string;
  description?: string;
  price: number;
  category_ids: number[]; // category IDs for M2M
  availability?: boolean;
}

export async function createProduct(data: CreateProductInput): Promise<Product> {
  const res = await api.post<Product>('/api/products/', data);
  return res.data;
}

// Update product by ID
export async function updateProduct(id: string, data: Partial<CreateProductInput>): Promise<Product> {
  const res = await api.patch<Product>(`/api/products/${id}/`, data);
  return res.data;
}

// Delete product by ID
export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/api/products/${id}/`);
}

// Similar CRUD can be made for ProductVariant, ProductImage, etc.
