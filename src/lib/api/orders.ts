import type { Order } from '@/types/order';

type CreateOrderInput = {
  cartId: number;
};

export const createOrder = async (
  input: CreateOrderInput
): Promise<Order> => {
  const res = await fetch('/api/orders/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cart_id: input.cartId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create order.');
  }

  const data: Order = await res.json();
  return data;
};
