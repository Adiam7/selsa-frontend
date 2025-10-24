// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { addToCart } from '@/features/cart/services/cartService';
// import { toast } from 'sonner';
// import { useSession } from 'next-auth/react';
// import { useCartContext } from '../../../context/CartContextntext';

// export function useAddToCart() {
//   const { data: session } = useSession();
//   const queryClient = useQueryClient();
//   const { updateCartFromAPI } = useCartContext();

//   const mutation = useMutation({
//     mutationFn: addToCart,
//     onSuccess: async () => {
//       await queryClient.invalidateQueries(['cart']);
//       updateCartFromAPI(); // Optional: if you're syncing local cart context
//       toast.success('Item added to cart');
//     },
//     onError: (error: any) => {
//       toast.error(error?.message || 'Failed to add item to cart');
//     },
//   });

//   const addItem = (variantId: number, quantity: number = 1) => {
//     const payload = {
//       product_variant_id: variantId,
//       quantity,
//     };

//     const isGuest = !session?.user;
//     if (isGuest) {
//       const guestCartId = localStorage.getItem('guestCartId');
//       if (!guestCartId) {
//         toast.error('Guest cart not initialized');
//         return;
//       }
//       mutation.mutate({ ...payload, cart_id: guestCartId });
//     } else {
//       mutation.mutate(payload);
//     }
//   };

//   return {
//     addToCart: addItem,
//     isLoading: mutation.isLoading,
//   };
// }
