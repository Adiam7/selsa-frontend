import axios from 'axios';
import { Category } from '@/types/category';
// src/features/category/services/categoryService.ts
// import { Category } from "@/types/product";


export interface CreateCategoryInput {
  name: string;
  slug?: string;
  parentId?: number | null;
  description?: string;
  imageUrl?: string;
}

// ✅ Create reusable Axios instance with error fallback
//const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // enable this if you're using cookies (auth/session)
});

// ✅ Fetch all categories
export async function fetchCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories/');
  return response.data;
}

// ✅ Fetch category by ID
export async function fetchCategoryById(id: number): Promise<Category> {
  const response = await api.get<Category>(`/categories/${id}/`);
  return response.data;
}

// ✅ Create new category
export async function createCategory(data: CreateCategoryInput): Promise<Category> {
  const response = await api.post<Category>('/categories/', data);
  return response.data;
}


export const categoryService = {
  // 🔹 Fetch all categories
  async getAll(): Promise<Category[]> {
    const res = await axios.get<Category[]>(API_BASE);
    return res.data;
  },

  // 🔹 Get a single category by slug
  async getBySlug(slug: string): Promise<Category> {
    const res = await axios.get<Category>(`${API_BASE}/${slug}/`);
    return res.data;
  },

  // 🔹 Create a new category
  async create(data: Partial<Category>): Promise<Category> {
    const res = await axios.post<Category>(API_BASE, data);
    return res.data;
  },

  // 🔹 Update a category by slug
  async update(slug: string, data: Partial<Category>): Promise<Category> {
    const res = await axios.patch<Category>(`${API_BASE}/${slug}/`, data);
    return res.data;
  },

  // 🔹 Delete a category by slug
  async remove(slug: string): Promise<void> {
    await axios.delete(`${API_BASE}/${slug}/`);
  },
};
