// src/lib/api/products.ts
import { Product } from '@/types/product';

// Example base URL; adjust as needed
const API_BASE = 'http://localhost:8000/api';

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch('http://localhost:8000/api/products/products/', {
      next: { revalidate: 60 }, // ISR support
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Product API error:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/products/by-id/${id}/`);
    if (!res.ok) return null;

    const product: Product = await res.json();

    // Normalize variants additional_price to number (if exists)
    if (product.variants) {
      product.variants = product.variants.map(variant => ({
        ...variant,
        additional_price: Number(variant.additional_price),
      }));
    }

    return product;
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    return null;
  }
}


export async function getProductBySlug(slug: string): Promise<Product | null> {
  
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${slug}/`, {
      next: { revalidate: 60 }, // optional ISR caching in Next.js 13+
    });

    if (!res.ok) {
      console.warn(`Failed to fetch product: ${res.status} ${res.statusText}`);
      return null;
    }

    const product: Product = await res.json();
    product.variants.forEach(v => {
        console.log(v.files_json);  // array of mockups
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}


/**
 * Fetch all product slugs (for static generation).
 */
export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const products = await res.json();
    return products.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch (error) {
    console.error("Failed to fetch product slugs:", error);
    return [];
  }
}




// src/lib/api.ts -->   getRelatedProducts in API
export async function getRelatedProducts(slug: string): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${slug}/related/`);
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error('Failed to fetch related products:', error);
    return [];
  }
}

// src/lib/api/products.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

/**
 * Fetch all products belonging to a specific category by slug.
 */
export async function getProductsByCategory(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${slug}`, {
      cache: "no-store", // Always get fresh data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products for category");
    }

    const data = await res.json();

    // Optional sanity check
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Product API error:", error);
    return [];
  }
}
