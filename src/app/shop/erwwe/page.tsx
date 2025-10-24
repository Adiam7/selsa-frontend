"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Variant {
  id: number;
  name: string;
  size: string;
  color: string;
  price: string;
  sku: string;
  mainImage: string | null;
  previews: string[];
  options: any[];
}

interface Product {
  id: number;
  name: string;
  thumbnail: string;
  variants: Variant[];
}

interface Props {
  params: { id: string };
}

export default function PrintfulProductDetailPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/printful/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch product");
        } else {
          setProduct(data.product);
          setSelectedVariant(data.product.variants[0] || null);
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product || !selectedVariant) return <p>Product not found</p>;

  return (
    <section className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-12">
      {/* Left Column: Main Image */}
      <div className="md:w-1/2 flex flex-col gap-4">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
        ) : (
          <div className="bg-gray-200 w-full h-[500px] flex items-center justify-center rounded-xl">
            No Image
          </div>
        )}

        {/* Previews */}
        {selectedVariant.previews.length > 0 && (
          <div className="flex gap-2 mt-2">
            {selectedVariant.previews.map((url, i) => (
              <Image
                key={i}
                src={url}
                alt={`Preview ${i}`}
                width={80}
                height={80}
                className="object-cover rounded cursor-pointer"
                onClick={() => setSelectedVariant(selectedVariant)} // could update main image if you want clickable
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Product Info */}
      <div className="md:w-1/2 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <h3 className="text-xl font-semibold">{selectedVariant.price} EUR</h3>
        <p className="text-sm text-gray-600">
          Stock: {selectedVariant.options?.stock || "N/A"}
        </p>

        {/* Variant Selector */}
        <div>
          <h3 className="font-semibold mb-2">Variants</h3>
          <ul className="flex flex-col gap-2">
            {product.variants.map((variant) => (
              <li
                key={variant.id}
                className={`p-2 border rounded cursor-pointer ${
                  variant.id === selectedVariant.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.name} — {variant.size} — {variant.color}
              </li>
            ))}
          </ul>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-4 mt-4">
          <label className="font-semibold h3">Quantity:</label>
          <input
            type="number"
            min={1}
            max={selectedVariant.options?.stock || 1}
            defaultValue={1}
            className="w-20 border rounded px-2 py-1"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add to Cart
          </button>
        </div>

        {/* Social Buttons */}
        
      </div>
    </section>
  );
}
