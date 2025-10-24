// Optional: just export from hooks for simpler imports
// File:-  selsa-frontend/src/context/cart/CartContext.tsx
'use client';
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface CartContextType {
  cart: any; // replace with your cart type
  setCart: React.Dispatch<React.SetStateAction<any>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState(null);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
