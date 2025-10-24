'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/features/cart/hooks/useCart';
import { usePlaceOrder } from '@/features/order/hooks/usePlaceOrder';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CartItemSummary } from '@/features/cart/components/CartItemSummary';
// import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, loading } = useCart();
  const { placeOrder, placingOrder } = usePlaceOrder();

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && (!cart || cart.items.length === 0)) {
      toast.info('Your cart is empty.');
      router.push('/cart');
    }
  }, [cart, loading, router]);

  const handlePlaceOrder = () => {
    if (!cart?.id) return;
    placeOrder(cart.id);
  };

  // Show loading state
  if (loading || !cart) {
    return <LoadingSpinner message="Loading your checkout..." />;
  }

  // Fallback for total in case it's undefined/null
  const formattedTotal = typeof cart.total === 'number'
    ? cart.total.toFixed(2)
    : '0.00';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Order Summary */}
      <section className="bg-white rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.items.map((item) => (
          <CartItemSummary key={item.id ?? `${item.name}-${item.variantId}`} item={item} />
        ))}
        <div className="mt-6 flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>
            {cart.items.map((item) => (
              <div key={item.id}>
                <span>{item.name}</span>
                {/* <span>${item.total_price.toFixed(2)}</span>  */}
              </div>
            ))}

          </span>
        </div>
      </section>

      {/* Payment Section */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <p className="text-sm text-gray-500 mb-4">
          (Payment gateway integration coming soon.)
        </p>

        <Button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {placingOrder ? 'Placing Order...' : 'Place Order'}
        </Button>
      </section>
      
    </div>
  );
};

export default CheckoutPage;

