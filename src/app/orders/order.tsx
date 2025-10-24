import { useOrders } from "@/hooks/useOrders";
import Link from "next/link";

export default function OrdersPage() {
  const { orders, loading } = useOrders();

  if (loading) return <p>Loading your orders...</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-4 rounded shadow-sm">
          <div className="flex justify-between">
            <div>
              <p><strong>Order #{order.id}</strong></p>
              <p className="text-sm text-gray-600">Status: {order.status}</p>
              <p className="text-sm text-gray-500">Total: ${order.total_amount}</p>
            </div>
            <Link href={`/orders/${order.id}`}>
              <span className="text-blue-600 hover:underline">View Details</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
