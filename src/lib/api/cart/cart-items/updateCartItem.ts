export async function updateCartItem(
  cartItemId: number,
  quantity: number,
  token?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/api/cart-items`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      cart_item_id: cartItemId,
      quantity,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to update cart item: ${errText}`);
  }

  return res.json();
}
