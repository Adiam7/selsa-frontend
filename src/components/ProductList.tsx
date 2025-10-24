"use client";

import React, { useEffect, useState } from "react";

interface ProductVariant {
  printful_variant_id: number | null;
  name: string;
  price: number;  // decimal dollars
  sku: string | null;
  image_url?: string | null;
}

interface Product {
  printful_id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  variants: ProductVariant[];
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/printful/products/");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Product[] = await res.json();
        setProducts(data);
        console.log("API response:", data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h2>Product List</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((product) => (
          <div
            key={product.printful_id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "250px",
            }}
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: "100%", height: "auto" }}
              />
            )}
            <h3>{product.name}</h3>
            <p>{product.description || "No description"}</p>
            <ul>
              {(product.variants ?? []).map((variant) => (
                <li key={variant.printful_variant_id ?? Math.random()}>
                  {variant.name} — ${Number(variant.price).toFixed(2)}{" "}
                  {variant.sku && ` (SKU: ${variant.sku})`}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
