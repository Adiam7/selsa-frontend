// lib/api/cart/createGuestCart.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function createGuestCart(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/cart/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("❌ Failed to create guest cart");
      return null;
    }

    const data = await res.json();
    return data.cart_id;
  } catch (err) {
    console.error("❌ Error creating guest cart:", err);
    return null;
  }
}