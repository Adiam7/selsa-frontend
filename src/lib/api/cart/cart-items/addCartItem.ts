const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function addCartItem(
  cartId: string | null,
  product_slug: string,
  productVariantId: number,
  quantity: number,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/api/cart-items/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      cart: cartId,
      product_slug,
      product_variant: productVariantId,
      quantity,
    }),
  });
  console.log("📦 Add/Fetch to cart POST:", res);

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to add cart item: ${errText}`);
  }

  return res.json();
}
