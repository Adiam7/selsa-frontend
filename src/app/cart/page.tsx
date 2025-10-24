'use client';

import { useCart } from '@/features/cart/hooks/useCart';
import Link from 'next/link';
import type { Cart } from '@/types/cart';
import { name_option } from '@/lib/utils/utils';
import { useRouter } from 'next/navigation';


export default function CartPage() {

  const { cart, loading } = useCart() as {
    cart: Cart[] | Cart | null;
    loading: boolean;
  };
  
  console.log('🛒 cart:', cart);

  const openCart = Array.isArray(cart)
    ? cart.find((c) => c.status === 'open')
    : cart;

  if (loading) return <p>Loading...</p>;

  if (!openCart || !openCart.items || openCart.items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  const total = openCart.items.reduce((sum, item) => {
    const price = item.product_price || 0;
    return sum + price * item.quantity;
  }, 0);

  console.log('🛒 cart Item:', openCart.items);

  //Navigations
  const router = useRouter();
  
  const handleContinueToShopping = () => {
    // 👇 Navigate to the desired page
    router.push('/store'); // or '/', or any shopping route
  };
  const handleCheckout = () => {
    // 👇 Navigate to the desired page
    router.push('/checkout');  // or '/', or any shopping route
  };
  
  return (

    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4 carousel pagination">Shopping Cart</h1>

      {openCart.items.map((item) => {
        const baseUrl = 'http://localhost:8000';
        console.log("🖼️ Image URL:", item.product_image);
        const imageUrl = item.product_image
          ? `${baseUrl}${item.product_image}`
          : '/placeholder.jpg';
          console.log("🖼️ Image URL:", item.product_image);

        const name = item.product_name || 'Product';
        const option_values = name_option(item.product_variant?.option_values); // Output: "Pink, M"
        console.log("Option values string:", option_values);
        const price = item.product_price || 0;

        return (          
          <div
            key={item.id}
            className="flex items-center space-x-4 py-4 border-b"
          >
            <img
              src={imageUrl}
              alt={name}
              className="w-20 h-20 object-cover rounded bg-gray-100"
              width={100}
              height={100}
            />
            <div className="flex-1">
              <p className="font-semibold">{name}</p>
              <p className="font-semibold">Choice: {option_values}</p>
              <p className="text-sm text-gray-800">Qty: {item.quantity}</p>
              <p className="font-bold text-gray-900">Price: ${(price * item.quantity).toFixed(2)} </p>
            </div>
            {/* <hr/> */}
          </div> 
        );
      })}
      
      <div className="mt-6 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal: </span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Shipping: </span>
          <span>$5.00</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total: </span>
          <span>${(total + 5).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
            type="button"
            onClick={handleContinueToShopping}
            aria-label="Continue Shopping"
            className="Continue Shopping-btn btn btn-primary px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"            
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Continue Shopping...
              </>
            ) : (
              "Continue Shopping"
            )}
        </button>
        <button
            type="button"
            onClick={handleCheckout}
            aria-label="Checkout"
            className="Checkout-btn btn btn-primary px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"            
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Checkout...
              </>
            ) : (
              "Checkout"
            )}
          </button>
        <Link href="/store" className="text-blue-600 underline">
          Continue Shopping
        </Link><br/>
        <Link
          href="/checkout"
          className="bg-black text-white px-6 py-2 rounded"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
