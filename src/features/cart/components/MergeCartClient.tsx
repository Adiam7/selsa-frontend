'use client';

import { useSession } from 'next-auth/react';
import { useMergeCart } from '@/features/cart/hooks/useMergeCart';

export default function MergeCartClient() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useMergeCart(userId);

  return null; // This component only runs a hook
}
