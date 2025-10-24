// src/components/Providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/cart/CartContext';
import MergeCartClient from '@/features/cart/components/MergeCartClient';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <MergeCartClient />
        {children}
      </CartProvider>
    </SessionProvider>
  );
}
