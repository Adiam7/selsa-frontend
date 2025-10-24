// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { removeCartItem } from '@/features/cart/services/cartService';
// import { toast } from 'sonner';
// import { useCartContext } from '../../../context/CartContextntext';

// export function useRemoveFromCart() {
//   const queryClient = useQueryClient();
//   const { updateCartFromAPI } = useCartContext();

//   const mutation = useMutation({
//     mutationFn: removeCartItem,
//     onSuccess: async () => {
//       await queryClient.invalidateQueries(['cart']);
//       updateCartFromAPI();
//       toast.success('Item removed from cart');
//     },
//     onError: (error: any) => {
//       toast.error(error?.message || 'Failed to remove item');
//     },
//   });

//   const removeItem = (cartItemId: number) => {
//     mutation.mutate(cartItemId);
//   };

//   return {
//     removeFromCart: removeItem,
//     isLoading: mutation.isLoading,
//   };
// }
