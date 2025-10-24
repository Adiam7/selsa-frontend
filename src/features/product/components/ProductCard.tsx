'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSafeImageUrl } from "@/lib/utils/utils";

export default function ProductCard({ product }: { product: any }) {
  const [favourite, setFavourite] = useState(false);

  // Load favourites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favourites");
    if (stored) {
      const favs = JSON.parse(stored);
      setFavourite(favs.includes(product.id));
    }
  }, [product.id]);

  // Toggle and persist favourite
  const toggleFavourite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setFavourite(prev => {
      const updated = !prev;
      const stored = localStorage.getItem("favourites");
      let favs = stored ? JSON.parse(stored) : [];

      if (updated) {
        favs.push(product.id);
      } else {
        favs = favs.filter((id: string) => id !== product.id);
      }

      localStorage.setItem("favourites", JSON.stringify(favs));
      return updated;
    });
  };

  return (
    <div className="border rounded-xl p-4 hover:shadow-md transition relative bg-white">
      {/* Image container */}
      <div className="relative w-full aspect-square mb-3">
        <Link href={`/product/${product.slug}`} className="block">
          <Image
            src={getSafeImageUrl(product)}
            alt={product.name}
            width={250}
            height={250}
            className="object-cover w-full h-64 rounded-xl"
          />
        </Link>

        {/* Heart Button (slightly above bottom-right) */}
        <button
          type="button"
          aria-label="Toggle favourite"
          className="absolute bottom-6 right-3 bg-white/80 rounded-full p-2 shadow hover:bg-red-100 transition z-10"
          onClick={toggleFavourite}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={favourite ? "red" : "none"}
            viewBox="0 0 24 24"
            stroke="red"
            strokeWidth={2}
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 3.75a5.25 5.25 0 0 1 4.09 8.6l-7.09 7.85a.75.75 0 0 1-1.1 0l-7.09-7.85A5.25 5.25 0 1 1 12 7.25a5.25 5.25 0 0 1 4.5-3.5z"
            />
          </svg>
        </button>
      </div>

      {/* Product Name and Price */}
      <div className="w-full text-center flex flex-col items-center">
        <Link href={`/product/${product.slug}`} className="hover:underline">
          <p className="font-semibold text-base line-clamp-2">{product.name}</p>
        </Link>
        <p className="text-gray-700">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
