// src/features/cart/services/cartService.ts

import {
  createGuestCart,
  getGuestCart,
  mergeGuestCart,
  getOrCreateGuestCartId,
} from "@/lib/api/cart/";

import {
  addCartItem,
  removeCartItem as removeCartItemApi,
  updateCartItem as updateCartItemApi,
} from "@/lib/api/cart-items/";

const GUEST_CART_KEY = "guest_cart_id";

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// Fetch the current cart for logged in user or guest
export async function fetchCart() {
  const token = getAuthToken();
  const guestCartId = localStorage.getItem(GUEST_CART_KEY);

  if (token) {
    // Authenticated user cart fetch
    const res = await fetch("/api/cart/my/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch user cart");
    return await res.json();
  }

  if (guestCartId) {
    // Guest cart fetch
    const cart = await getGuestCart(guestCartId);
    if (!cart) throw new Error("Failed to fetch guest cart");
    return cart;
  }

  // Create a new guest cart if none exists
  const newCartId = await createGuestCart();
  if (newCartId) {
    localStorage.setItem(GUEST_CART_KEY, newCartId);
    return await getGuestCart(newCartId);
  }

  throw new Error("Unable to get or create cart");
}

// Get or create guest cart id in localStorage
export async function getGuestCartId() {
  const id = await getOrCreateGuestCartId();
  if (id) localStorage.setItem(GUEST_CART_KEY, id);
  return id;
}

export async function addToCart({
  variantId,
  quantity,
  cartId,
}: {
  variantId: number;
  quantity: number;
  cartId?: string;
}) {
  const token = getAuthToken();
  return addCartItem(cartId ?? null, variantId, quantity, token ?? undefined);
}

export async function removeCartItem(cartItemId: number) {
  const token = getAuthToken();
  return removeCartItemApi(cartItemId, token ?? undefined);
}

export async function updateCartItem({
  cartItemId,
  quantity,
}: {
  cartItemId: number;
  quantity: number;
}) {
  const token = getAuthToken();
  return updateCartItemApi(cartItemId, quantity, token ?? undefined);
}

// Merge guest cart into logged-in user's cart and clear guest cart id
export async function mergeGuestCartToUser() {
  const guestCartId = localStorage.getItem(GUEST_CART_KEY);
  if (!guestCartId) return;

  const token = getAuthToken();
  if (!token) throw new Error("User not authenticated");

  const response = await mergeGuestCart(guestCartId, token);
  if (!response.success) throw new Error(response.message || "Failed to merge guest cart");

  localStorage.removeItem(GUEST_CART_KEY);
  return response;
}
