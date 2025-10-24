import React from 'react';
import type { Cart } from '@/types/cart';

interface OrderSummaryProps {
  cart: Cart;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cart }) => {
  if (!cart?.items?.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {cart.items.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-none">
          <div>
            <p className="font-medium">{item.product_variant.product.name}</p>
            <p className="text-sm text-gray-500">SKU: {item.product_variant.sku}</p>
            {item.option_values.length > 0 && (
              <div className="text-sm text-gray-500">
                {item.option_values.map((opt) => (
                  <span key={opt.id} className="mr-2">
                    {opt.option.name}: {opt.name}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
          <div className="text-right">
            <img
              src={item.image_url}
              alt={item.product_variant.product.name}
              className="w-14 h-14 object-cover rounded-md mb-1"
            />
            <p className="font-semibold">${item.total_price.toFixed(2)}</p>
          </div>
        </div>
      ))}

      <div className="mt-6 flex justify-between text-lg font-semibold">
        <span>Total:</span>
        <span>${cart.total.toFixed(2)}</span>
      </div>
    </div>
  );
};
