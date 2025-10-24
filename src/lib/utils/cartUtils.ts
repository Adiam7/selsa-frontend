// lib/utils/cartUtils.ts
// selsa-frontend/src/lib/utils/cartUtils.ts
// Utility functions for managing guest carts in localStorage and via API
// This file provides functions to create, retrieve, and store guest cart IDs.
// It interacts with the backend API to create a new guest cart and stores the cart ID in
// localStorage for later use.
// It also handles the case where a guest cart already exists by checking localStorage first.     


const GUEST_CART_KEY = 'guest_cart_id';

// Fetch cart ID from localStorage
export function getGuestCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(GUEST_CART_KEY);
}

// Store guest cart ID in localStorage
export function storeGuestCartId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_CART_KEY, id);
}

// Create guest cart via API
export async function createGuestCart(): Promise<string> {
  const res = await fetch('/api/cart/create/', {
    method: 'POST',
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('❌ Failed to create guest cart:', text);
    throw new Error('Failed to create guest cart');
  }

  const data = await res.json();

  if (!data?.id) {
    throw new Error('Invalid guest cart response');
  }

  storeGuestCartId(data.id);
  return data.id;
}

// Get or create guest cart ID
// lib/utils/cartUtils.ts
// src/lib/utils/cartUtils.ts

export const getOrCreateGuestCartId = async (): Promise<string | null> => {
  let guestCartId = localStorage.getItem('guest_cart_id');
  if (!guestCartId) {
    console.error('❌ Failed to guest cart Id from localStorage.getItem:so guest_cart_id is', guestCartId);
    
  }
  if (guestCartId) return guestCartId;

  const res = await fetch('/api/cart/guest-create', {
    method: 'POST',
  });
  if (!res.ok) {
    console.error('❌ Failed to Fetch guest cart Id from fetch of getOrCreateGuestCartId:');
    return null;
  }
  if (res.ok) {
    const data = await res.json();
    guestCartId = data.id;
    localStorage.setItem('guest_cart_id', guestCartId);
    return guestCartId;
  }

  console.error('❌ Failed to create guest cart Id:', await res.text());
  return null;
};
