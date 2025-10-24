import { getOrder } from "@/hooks/useOrders";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Order } from "@/types/order";

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getOrder(Number(id))
        .then(setOrder)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !order) return <p>Loading order details...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <p>Status: {order.status}</p>
      <p>Total: ${order.total_amount}</p>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="border-b py-2">
            <p>{item.product_variant.product.name}</p>
            <p>Qty: {item.quantity}</p>
            <p>Price: ${item.price} each</p>
          </div>
        ))}
      </div>

      {order.payment && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <p>Status: {order.payment.status}</p>
          <p>Amount Paid: ${order.payment.amount}</p>
        </div>
      )}
    </div>
  );
}
