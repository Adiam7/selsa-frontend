'use client';

import { useEffect, useState } from 'react';
import { useFavouritesContext } from '@/context/FavouritesContext';
import { Product } from '@/types/product';
// import { ProductCard } from '@/features/product/components/ProductCard';

// This should call your real API in production
async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  const res = await fetch('/api/products/favourites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) throw new Error('Failed to fetch favourites');
  return res.json();
}

export default function FavouritesPage() {
  const { favourites } = useFavouritesContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favourites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    fetchProductsByIds(favourites)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [favourites]);

  if (loading) return <div className="p-4">Loading favourites...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Favourites</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">You haven't favourited any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))} */}
        </div>
      )}
    </div>
  );
}
