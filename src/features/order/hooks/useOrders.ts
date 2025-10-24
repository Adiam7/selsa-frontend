import { useState, useEffect } from "react";
import axios from "axios";
import { Order } from "@/types/order";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/orders/");
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, refreshOrders: fetchOrders };
}

export async function getOrder(id: number): Promise<Order> {
  const res = await axios.get(`/api/orders/${id}/`);
  return res.data;
}
