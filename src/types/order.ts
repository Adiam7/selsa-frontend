import { ProductVariant } from "./cart"; // assuming reuse

export type OrderItem = {
  id: number;
  product_variant: ProductVariant;
  quantity: number;
  price: string; // decimal
  total_price: string;
};

export type Payment = {
  stripe_payment_intent: string;
  amount: string;
  status: "succeeded" | "failed";
};

export type Order = {
  id: number;
  user: number | null;
  status: "pending" | "completed" | "canceled" | "refunded";
  created_at: string;
  updated_at: string;
  total_amount: string;
  items: OrderItem[];
  payment?: Payment;
};
