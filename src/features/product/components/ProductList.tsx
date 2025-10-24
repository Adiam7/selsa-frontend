import React from 'react';
import { useProducts } from '../hooks/useProducts';

export default function ProductList() {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products?.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> - ${p.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
