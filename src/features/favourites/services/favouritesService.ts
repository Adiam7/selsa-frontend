export async function fetchServerFavourites(): Promise<string[]> {
  const res = await fetch('/api/favourites');
  if (!res.ok) throw new Error('Failed to fetch server favourites');
  const data = await res.json();
  return data.map((fav: { productId: string }) => fav.productId);
}

export async function addServerFavourite(productId: string) {
  return fetch('/api/favourites', {
    method: 'POST',
    body: JSON.stringify({ productId }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function removeServerFavourite(productId: string) {
  return fetch(`/api/favourites/${productId}`, { method: 'DELETE' });
}

export async function bulkAddFavourites(productIds: string[]) {
  return fetch('/api/favourites/bulk', {
    method: 'POST',
    body: JSON.stringify({ productIds }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getFavourites(): Promise<Product[]> {
  const res = await fetch('/api/favourites');
  if (!res.ok) throw new Error('Failed to fetch favourites');
  return res.json();
}