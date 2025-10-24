// useCart.ts
import { useEffect, useState, useCallback } from 'react';

interface CartItem {
  id: number;
  product_variant: number;
  quantity: number;
  // Extend as needed
}

interface Cart {
  id: string;
  items: CartItem[];
  // Add total, status, etc. as needed
}

const CART_API = 'http://localhost:8000/api';

export const getOrCreateGuestCartId = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    // Prevent localStorage access on server
    return null;
  }

  let guestCartId = localStorage.getItem('guest_cart_id');

  if (guestCartId) {
    try {
      const validationRes = await fetch(`${CART_API}/guest-cart/?cart_id=${guestCartId}`);
      if (validationRes.ok) {
        return guestCartId;
      } else {
        console.warn('⚠️ Guest cart ID in localStorage is invalid. Removing and creating new.');
        localStorage.removeItem('guest_cart_id');
      }
    } catch (err) {
      console.error('Error validating guest cart:', err);
    }
  }

  // Create a new guest cart
  try {
    const createRes = await fetch(`${CART_API}/guest-cart-create/`, { method: 'POST' });
    if (!createRes.ok) {
      const text = await createRes.text();
      console.error('❌ Guest cart create failed:', createRes.status, text);
      throw new Error('Failed to create guest cart');
    }

    const data = await createRes.json();
    const newCartId = data.id;
    localStorage.setItem('guest_cart_id', newCartId);
    return newCartId;
  } catch (err) {
    console.error('Error creating guest cart:', err);
    return null;
  }
};


export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuestCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const guestCartId = await getOrCreateGuestCartId();
      if (!guestCartId) throw new Error('No valid guest cart ID');

      const res = await fetch(`${CART_API}/guest-cart/?cart_id=${guestCartId}`);
      if (!res.ok) throw new Error('Failed to fetch guest cart');

      const data = await res.json();
      setCart(data);
    } catch (err: any) {
      console.error('❌ useCart fetchGuestCart error:', err);
      setError(err.message || 'Unknown error');
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuestCart();
  }, [fetchGuestCart]);

  return {
    cart,
    loading,
    error,
    refreshCart: fetchGuestCart,
  };
};
