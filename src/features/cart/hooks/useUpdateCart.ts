// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { updateCartItem } from '@/features/cart/services/cartService';
// import { toast } from 'sonner';
// import { useCartContext } from '../../../context/CartContextntext';

// export function useUpdateCart() {
//   const queryClient = useQueryClient();
//   const { updateCartFromAPI } = useCartContext();

//   const mutation = useMutation({
//     mutationFn: updateCartItem,
//     onSuccess: async () => {
//       await queryClient.invalidateQueries(['cart']);
//       updateCartFromAPI();
//       toast.success('Cart updated');
//     },
//     onError: (error: any) => {
//       toast.error(error?.message || 'Failed to update cart');
//     },
//   });

//   const updateItem = (cartItemId: number, quantity: number) => {
//     mutation.mutate({ cartItemId, quantity });
//   };

//   return {
//     updateCart: updateItem,
//     isLoading: mutation.isLoading,
//   };
// }
