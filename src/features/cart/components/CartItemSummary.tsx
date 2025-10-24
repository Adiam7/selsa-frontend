import { CartItem } from '@/types/cart';

type Props = {
  item: CartItem;
};

export const CartItemSummary = ({ item }: Props) => {
  return (
    <div
      key={item.id}
      className="flex items-center justify-between py-3 border-b last:border-none"
    >
      <div>
        <p className="font-medium">{item.product_variant.product.name}</p>
        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
      </div>
      <p className="font-semibold">${item.total_price.toFixed(2)}</p>
    </div>
  );
};
