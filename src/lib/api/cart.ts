// File: lib/api/cart.ts
import axios from 'axios';

interface AddToCartParams {
  cartId: number;
  productVariantId: number;
  quantity: number;
  optionValues: number[]; // array of ProductOptionValue IDs
}

export async function addToCart(params: AddToCartParams) {
  const payload = {
    cart: params.cartId,
    product_variant: params.productVariantId,
    quantity: params.quantity,
    option_values: params.optionValues,
  };

  return axios.post('http://localhost:8000/api/cart-items/', payload);
}


export async function getUserCart() {
  const response = await axios.get("http://localhost:8000/api/cart/my",{withCredentials: true});
  return response.data;
}
