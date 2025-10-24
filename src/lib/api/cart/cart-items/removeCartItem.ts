export async function removeCartItem(cartItemId: number, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/api/cart-items?id=${cartItemId}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to remove cart item: ${errText}`);
  }

  return true;
}
