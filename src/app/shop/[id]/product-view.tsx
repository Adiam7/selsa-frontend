"use client";

import React, { useMemo, useState, useEffect } from "react";
import type { Product, Variant } from "@/types/product";

// Currency formatter
function money(v: number | string | undefined, c?: string) {
  const num = typeof v === "string" ? Number(v) : v ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c || "USD",
  }).format(num);
}

// Gallery type
type GalleryImage = { url: string; key: string };

export function useGallery(product: Product) {
  const initialGallery = useMemo(() => {
    const gallery: GalleryImage[] = [];
    const seen = new Set<string>();

    const addImage = (url?: string | null) => {
      if (!url) return;
      const u = String(url).trim();
      if (!u) return;
      if (!seen.has(u)) {
        seen.add(u);
        gallery.push({ url: u, key: `img::${u}` });
      }
    };

    // 1. main product image
    addImage(product?.image_url);

    // 2. product-level mockups
    for (const m of product.mockups ?? []) {
      addImage(m?.url);
    }

    return gallery;
  }, [product]);

  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery);

  useEffect(() => {
    setGallery(initialGallery);
  }, [initialGallery]);

  return { gallery };
}

export default function ProductView({ product }: { product: Product }) {
  const { gallery } = useGallery(product);

  if (!product || !product.variants || product.variants.length === 0) {

    //   This line checks for three possible missing states:
    //   !product → The product object itself doesn’t exist yet (not fetched or undefined).
    //   !product.variants → The product object exists, but the variants field is missing.
    //   product.variants.length === 0 → The variants array exists but is empty (no variant data yet).
    //   If any of these are true, the app assumes the product data hasn’t fully loaded yet.
    // 

    return (
      <div className="p-10 text-center text-gray-500">
        <p>⏳ Product is syncing from Printful. Please refresh in a moment.</p>
      </div>
    );
  }

  const colors = product.colors ?? [];
  const sizes = product.sizes ?? [];
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [qty, setQty] = useState(1);

  // 🔹 Highlighted image index (auto-highlight first image)
  const [highlightedIdx, setHighlightedIdx] = useState(0);

  const variantsByKey = useMemo(() => {
    const map = new Map<string, Variant>();
    for (const v of product.variants) {
      map.set(`${v.color ?? ""}::${v.size ?? ""}`, v);
    }
    return map;
  }, [product.variants]);

  const selectedVariant =
    variantsByKey.get(`${selectedColor}::${selectedSize}`) ?? null;

  const priceLabel = selectedVariant
    ? money(selectedVariant.price, selectedVariant.currency)
    : "";

  const inStock = selectedVariant ? selectedVariant.is_available : true;

  return (
    <section className="product-detail-container flex flex-col md:flex-row gap-8">
      {/* LEFT: Images */}
      <div className="product-images flex flex-col gap-4">
        <div className="main-image">
          {gallery[highlightedIdx]?.url ? (
            <img
              src={gallery[highlightedIdx].url}
              alt={product.name}
              className="rounded-xl object-cover"
              width={500}
              height={500}
              style={{ aspectRatio: "1 / 1" }}
            />
          ) : (
            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* ✅ Thumbnail gallery with highlight */}
        <div className="image-gallery flex gap-2 flex-wrap">
          {gallery.map((item, i) => (
            <img
              key={item.key}
              className={`relative w-20 h-20 border-2 rounded overflow-hidden transition-all duration-200 cursor-pointer ${
                i === highlightedIdx
                  ? "border-blue-500 ring-2 ring-blue-400 scale-105"
                  : "border-transparent hover:border-gray-300"
              }`}
              src={item.url}
              alt={product.name}
              width={80}
              height={80}
              onClick={() => setHighlightedIdx(i)}
              aria-label={`Highlight image ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Product Info */}
      <div className="product_info flex-1 space-y-4">
        <h1 className="product-title text-2xl font-bold">{product.name}</h1>

        <div className="product-price text-xl font-semibold text-gray-800">
          <p>{priceLabel}</p>
        </div>

        {/* ✅ Color Options with highlight */}
        {colors.length > 0 && (
          <div className="product-option mb-4">
            <label className="block font-medium mb-1 text-gray-800">
              Color:
            </label>
             <div className="image-gallery flex gap-1 flex-wrap">
              {gallery.map((item, i) => (
                <img
                  key={item.key}
                  className={`relative w-20 h-20 border-2 rounded overflow-hidden transition-all duration-200 cursor-pointer ${
                    i === highlightedIdx
                      ? "border-blue-500 ring-2 ring-blue-400 scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  src={item.url}
                  alt={product.name}
                  width={40}
                  height={40}
                  onClick={() => setHighlightedIdx(i)}
                  aria-label={`Highlight image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ✅ Size Options with highlight */}
        {sizes.length > 0 && (
          <div className="product-option mb-4">
            <label className="block font-medium mb-1 text-gray-800">
              Size:
            </label>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((s) => (
                <button
                  key={s || "none"}
                  onClick={() => setSelectedSize(s)}
                  aria-pressed={selectedSize === s}
                  className={`px-3 py-2 rounded  duration-150 px-4 py-2 bg-white/10 
                              text-white backdrop-blur-md border border-white/20 rounded-xl 
                              hover:bg-white/20 transition-all ${
                    selectedSize === s
                      ? "border-blue-500 bg-blue-100 text-blue-700"
                      : "border-gray-300 bg-white hover:bg-gray-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="product-option mb-4">
          <label htmlFor="qty" className="block font-medium mb-1 text-gray-800">
            Quantity:
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="border rounded px-2 py-1 w-20"
          />
        </div>

        {/* ✅ Stock Status turns green if available */}
        <div
          className={`stock-status mb-2 font-medium ${
            inStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </div>

        {/* Add to Cart */}
        <button
          onClick={async () => {
            if (!selectedVariant) return;
            await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                variant_id: selectedVariant.id,
                qty,
              }),
            });
          }}
          disabled={!selectedVariant || !inStock}
          className="add-to-cart-btn btn btn-primary px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2 disabled:opacity-50"
        >
          Add to Cart
        </button>

        {/* Product Description */}
        {product.description && (
          <div className="product-description mt-6 overflow-auto">
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </section>
  );
}
