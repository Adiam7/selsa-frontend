// src/lib/api/categories.ts

import { Category } from "@/types/category";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

function withTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * ✅ Get all categories (top-level by default)
 */
export async function getCategories(): Promise<Category[]> {
  const endpoint = `${withTrailingSlash(API_BASE)}categories/`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // 1-minute caching (ISR)
    });

    if (!response.ok) {
      console.error(`[getCategories] Failed with status: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn("[getCategories] Unexpected response format:", data);
      return [];
    }

    // ✅ Return only top-level categories
    return data.filter((c: Category) => c.parent === null);
  } catch (error) {
    console.error("[getCategories] Error fetching categories:", error);
    return [];
  }
}

/**
 * ✅ Get a single category (including children)
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const endpoint = `${withTrailingSlash(API_BASE)}categories/${slug}/`;

  try {
    const response = await fetch(endpoint, { next: { revalidate: 60 } });
    if (!response.ok) {
      console.error(`[getCategoryBySlug] Failed with status: ${response.status}`);
      return null;
    }
    return (await response.json()) as Category;
  } catch (error) {
    console.error("[getCategoryBySlug] Error fetching category:", error);
    return null;
  }
}

/**
 * ✅ Get products for a given category slug (with pagination)
 */
export async function getProductsByCategorySlug(
  slug: string,
  page = 1,
  limit = 24
) {
  const offset = (page - 1) * limit;
  const endpoint = `${withTrailingSlash(API_BASE)}products/?category_slug=${slug}&limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(endpoint, { next: { revalidate: 60 } });
    if (!response.ok) {
      console.error(`[getProductsByCategorySlug] Failed: ${response.status}`);
      return { results: [], count: 0 };
    }

    return await response.json();
  } catch (error) {
    console.error("[getProductsByCategorySlug] Error fetching products:", error);
    return { results: [], count: 0 };
  }
}
