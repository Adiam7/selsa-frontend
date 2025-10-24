// selsa-frontend/src/types/cart.ts

export type Product = {
  id: number;
  name: string;
  price: number;
};

export type ProductVariant = {
  id: number;
  sku: string;
  stock_quantity: number;
  stock_control: 'finite' | 'infinite'; // Optional, if needed on frontend
  option_combination?: string; // Optional, if you use this in UI
  product: Product;
};

export type ProductOptionValue = {
  id: number;
  name: string;
  option: {
    id: number;
    name: string;
  };
};

export type CartItem = {
  id: number;
  quantity: number;
  product_variant: ProductVariant;
  option_values: ProductOptionValue[];
  total_price: number; // You may compute this on frontend if not provided by API
  image_url: string;
};

export type Cart = {
  id: number;
  user?: number | null;
  session_id?: string | null;
  status: 'open' | 'checked_out' | 'expired' | 'pending_payment' | 'payment_failed';
  created_at: string;
  updated_at: string;
  expires_at?: string | null;
  items: CartItem[];
  total: number;
};


// export type CartResponse = {
//   cart: Cart;
//   loading: boolean;
//   error?: string | null;
// };
// export type CartItemResponse = {
//   item: CartItem;
//   loading: boolean;
//   error?: string | null;
// };
// export type CartUpdateResponse = {
//   cart: Cart;
//   loading: boolean;
//   error?: string | null;
// };
// export type CartDeleteResponse = {
//   success: boolean;
//   loading: boolean;
//   error?: string | null;
// };