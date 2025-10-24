// components/FavouriteButton.tsx
'use client';

import { useFavouritesContext } from '@/context/FavouritesContext';

interface FavouriteImageProps {
  productId: string;
}

export function FavouriteImage({ productId }: FavouriteImageProps) {
  const { toggleFavourite, isFavourite } = useFavouritesContext();
  const liked = isFavourite(productId);

  return (
   <button
        onClick={() => toggleFavourite(productId)}
        aria-label="Toggle favourite"
        className={`bg-transparent border-none outline-none cursor-pointer transition-transform duration-200 text-xl ${
            liked ? 'text-red-500 scale-110' : 'text-gray-400'
        }`}
        >
        {liked ? '❤️' : '🤍'}
    </button>

  );
}
