// lib/api/cart/getGuestCart.ts
export async function getGuestCart(cartId: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/cart/guest/?cart_id=${cartId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("❌ Failed to fetch guest cart");

    return await res.json();
  } catch (err) {
    console.error("❌ Error retrieving guest cart:", err);
    return null;
  }
}