// src/lib/api/printful.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export async function getProductsByCategory(slug: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/categories/${slug}/`,  // ✅ fixed path
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error(`Failed to fetch products by category: ${res.statusText}`);

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("getProductsByCategory error:", error);
    return [];
  } 
}
