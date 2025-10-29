"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import type { Product, Variant } from "@/types/product";
import { addToCart } from "@/lib/api/cart";
import { useCart } from "@/features/cart/hooks/useCart";

import { QuantitySelector } from "@/components/QuantitySelector";
import { FavoriteSelector } from "@/components/FavoriteSelector";
import { ColorSelector } from "@/components/ColorSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { SelectedVariantPreview } from "@/components/SelectedVariantPreview";

import { useGallery } from "@/features/Variant/hooks/useGallery";
import { useVariantSelector } from "@/features/Variant/hooks/useVariantSelector";

import "@/components/SizeSelector.css";
import "@/components/ColorSelector.css";
import "@/components/QuantitySelector.css";
import "@/components/FavoriteSelector.css";

/** Helper */
function money(v: number | string | undefined, c?: string) {
  const num = typeof v === "string" ? Number(v) || 0 : v ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c || "USD",
  }).format(num);
}

export default function ProductView({ product }: { product: Product }) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/cart";
  const { cart, loading } = useCart();

  // --- Hooks ---
  const { gallery, highlightedIdx, setHighlightedIdx } = useGallery(product, {
    skipFirstVariant: true,
  });
  const {
    selectedVariant,
    selectedColor,
    selectedSize,
    colors,
    sizes,
    setColor,
    setSize,
    inStock,
  } = useVariantSelector(product.variants);


  // --- Build color → image map (used by ColorSelector) ---
  const variantImages = useMemo(() => {
    const map: Record<string, string> = {};
    product.variants.forEach((v) => {
      if (v.color && v.image_url && !/printfile-preview/i.test(v.image_url)) {
        map[v.color] = v.image_url;
      }
    });
    return map;
  }, [product.variants]);

  // --- Sync gallery highlight with selected variant ---
  const highlightVariantImage = useCallback(
    (variant: Variant) => {
      if (!variant?.image_url) return;
      const idx = gallery.findIndex((g) => g.url === variant.image_url);
      if (idx >= 0) setHighlightedIdx(idx);
    },
    [gallery, setHighlightedIdx]
  );

  useEffect(() => {
    if (selectedVariant) highlightVariantImage(selectedVariant);
  }, [selectedVariant, highlightVariantImage]);

  // --- Handle thumbnail click (updates variant selection) ---
  const handleThumbnailClick = useCallback(
    (idx: number) => {
      setHighlightedIdx(idx);

      const variantId = gallery[idx]?.variantId;
      if (!variantId) return;

      const clickedVariant = product.variants.find(v => v.id === variantId);
      if (clickedVariant) {
        setColor(clickedVariant.color ?? null);
        setSize(clickedVariant.size ?? null);
      }
    },
    [gallery, product.variants, setColor, setSize, setHighlightedIdx]
  );

  // --- Handle color selection (also sync gallery image) ---
  const handleColorSelect = useCallback(
    (color: string) => {
      setColor(color);
      const img = variantImages[color];
      if (img) {
        const idx = gallery.findIndex((g) => g.url === img);
        if (idx >= 0) setHighlightedIdx(idx);
      }
    },
    [setColor, variantImages, gallery, setHighlightedIdx]
  );

  
  const [qty, setQty] = useState<number>(1);
  const [isFavorited, setIsFavorited] = useState(false);

  // --- Auth fallback ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      null;
    setIsAuthenticated(Boolean(token));
  }, []);
  

  // --- Add to cart ---
  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant) {
      toast.error("Please select a valid variant.");
      return;
    }

    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    const openCart = Array.isArray(cart)
      ? cart.find((c) => c.status === "open")
      : cart;
    if (!openCart?.id) {
      toast.error("Cart not found.");
      return;
    }

    try {
      await addToCart({
        cartId: openCart.id,
        productVariantId: selectedVariant.id,
        quantity: qty,
        variantColor: selectedColor,
        variantSize: selectedSize,
      });
      toast.success("Added to cart");
      router.push(callbackUrl);
    } catch (err: any) {
      toast.error(
        `Failed: ${err?.response?.data?.error || err?.message || "unknown"}`
      );
    }
  }, [
    selectedVariant,
    qty,
    selectedColor,
    selectedSize,
    isAuthenticated,
    cart,
    router,
    callbackUrl,
  ]);

  // --- Price label ---
  const priceLabel = selectedVariant
    ? money(selectedVariant.price, selectedVariant.currency)
    : money(product.variants[0]?.price, product.variants[0]?.currency);



  return (
    <section className="product-detail-container flex flex-col md:flex-row gap-8">
      {/* LEFT: Images */}
      <div className="product-images flex flex-col gap-4">
        <div className="main-image relative">
          {gallery[highlightedIdx]?.url ? (
            <div className="relative w-[500px] h-[500px]">
              <Image
                src={gallery[highlightedIdx].url}
                alt={product.name}
                width={500}
                height={500}
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          ) : (
            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          <div className="absolute top-2 right-2 z-10">
            <FavoriteSelector
              isFavorited={isFavorited}
              toggleFavorite={() => setIsFavorited(!isFavorited)}
              size={28}
            />
          </div>
        </div>

        <div className="image-gallery flex gap-2 flex-wrap">
          {gallery.map((g, i) => (
            <img
              key={g.key}
              src={g.url}
              alt={`${product.name} thumbnail ${i + 1}`}
              width={80}
              height={80}
              className={`w-20 h-20 rounded overflow-hidden transition-all duration-200 cursor-pointer border-2 ${
                i === highlightedIdx
                  ? "border-blue-500 ring-2 ring-blue-400 scale-105"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => handleThumbnailClick(i)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Info */}
      <div className="product_info flex-1 space-y-4">

        <h1 className="product-title text-2xl font-bold">{product.name}</h1>

        <div className="product-price text-xl font-semibold text-gray-800">
          {priceLabel}
        </div>

        {/* ✅ ColorSelector now uses variantImages + synced handler */}
        <ColorSelector 
          colors={colors}
          selectedColor={selectedColor}
          onSelect={handleColorSelect}
          variantImages={variantImages}
        />

        <SizeSelector
          sizes={sizes}
          selectedSize={selectedSize}
          onSelect={setSize}
          disabledSizes={product.variants
            .filter((v) => v.color === selectedColor && !v.is_available)
            .map((v) => v.size ?? "")}          
        />

        <QuantitySelector
          qty={qty}
          setQty={setQty}
          min={1}
          max={selectedVariant?.quantity ?? 99}
        />

        <SelectedVariantPreview 
          color={selectedColor}
          size={selectedSize}
          image={selectedVariant?.image_url} // ✅ pull from selectedVariant
          
        />

        <div
          className={`stock-status mb-2 font-medium ${
            inStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          aria-label="Add to Cart"
          className="add-to-cart-btn px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"
          disabled={!inStock || loading || !cart}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>

        {product.description && (
          <div className="product-description mt-6 overflow-auto">
            <p>{product.description}</p>
          </div>
        )}

      </div>
    </section>
  );
}
