import { useState } from 'react';
import { createOrder } from '@/lib/api/orders';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const usePlaceOrder = () => {
  const [placingOrder, setPlacingOrder] = useState(false);
  const router = useRouter();

  const placeOrder = async (cartId: number) => {
    if (placingOrder || !cartId) return;

    try {
      setPlacingOrder(true);
      const order = await createOrder({ cartId });
      toast.success('🎉 Order placed successfully!');
      router.push(`/orders/${order.id}`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return { placeOrder, placingOrder };
};
