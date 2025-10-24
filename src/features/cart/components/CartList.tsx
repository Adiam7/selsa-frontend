import { useCart } from "@/features/cart/hooks/useCart";
 

export default function CartDisplay() {
  const { cart, loading, removeItem, updateItem } = useCart();

  if (loading) return <p>Loading cart...</p>;
  if (!cart) return <p>No cart available</p>;

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cart.items.map((item) => (
          <li key={item.id} style={{ marginBottom: 10 }}>
            <span>{item.productName} - Qty: {item.quantity}</span>
            <button onClick={() => removeItem(item.id)} style={{ marginLeft: 10 }}>
              Remove
            </button>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateItem(item.id, Number(e.target.value))}
              style={{ marginLeft: 10, width: 50 }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
