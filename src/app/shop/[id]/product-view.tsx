"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product, Variant } from "@/types/product";
import { addToCart } from "@/lib/api/cart";
import { useCart } from "@/features/cart/hooks/useCart";
import { QuantitySelector } from "@/components/QuantitySelector";
import { FavoriteSelector } from "@/components/FavoriteSelector";
import { ColorSelector } from "@/components/ColorSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { toast } from "react-hot-toast";
import "@/components/QuantitySelector.css";
import "@/components/FavoriteSelector.css";
import { useGallery } from "@/features/Variant/hooks/useGallery";


/**
 * Helpers
 */
function money(v: number | string | undefined, c?: string) {
  const num = typeof v === "string" ? Number(v) || 0 : v ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c || "USD",
  }).format(num);
}



/**
 * ProductView (production-ready)
 */
export default function ProductView({ product }: { product: Product }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/cart";
  const { cart, loading } = useCart();

  // UI state
  const [isFavorited, setIsFavorited] = useState(false);
  const [qty, setQty] = useState<number>(1);

  const { gallery } = useGallery(product);

  // auth fallback for demo / redirect behavior
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

  // Basic guard
  if (!product || !product.variants || product.variants.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        <p>⏳ Product data is not available yet. Please refresh in a moment.</p>
      </div>
    );
  }

  // Single source of truth state
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [highlightedIdx, setHighlightedIdx] = useState<number>(0);

  // Build deduplicated colors (strings) and sizes (strings)
  const colors = useMemo(() => {
    const set = new Set<string>();
    for (const v of product.variants) {
      if (v.color) set.add(v.color);
    }
    return Array.from(set);
  }, [product.variants]);

  // Map variants by color::size for O(1) lookup
  const variantsByKey = useMemo(() => {
    const map = new Map<string, Variant>();
    for (const v of product.variants) {
      map.set(`${v.color ?? ""}::${v.size ?? ""}`, v);
    }
    return map;
  }, [product.variants]);

  // sizes for a selected color (deduped)
  const sizesForSelectedColor = useMemo(() => {
    if (!selectedColor) return [] as string[];
    const set = new Set<string>();
    for (const v of product.variants) {
      if (v.color === selectedColor && v.size) set.add(v.size);
    }
    // optional: sort in standard order
    const order: Record<string, number> = { XS: 1, S: 2, M: 3, L: 4, XL: 5, XXL: 6, "2XL": 6, "3XL": 7 };
    return Array.from(set).sort((a, b) => (order[a] ?? 99) - (order[b] ?? 99));
  }, [product.variants, selectedColor]);

  // selectedVariant derived from keys
  const selectedVariant: Variant | null = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return variantsByKey.get(`${selectedColor}::${selectedSize}`) ?? null;
  }, [variantsByKey, selectedColor, selectedSize]);

  // Price and stock (fallback to first variant for price if none selected)
  const inStock = selectedVariant ? Boolean(selectedVariant.is_available) : false;
  const priceLabel = selectedVariant
    ? money(selectedVariant.price, selectedVariant.currency)
    : money(product.variants[0]?.price, product.variants[0]?.currency);

  // Auto-select initial variant (first available variant with an image, else first)
  useEffect(() => {
    if (!product.variants || product.variants.length === 0) return;
    const candidate =
      product.variants.find((v) => v.is_available && (v.image_url || (v.files && v.files.length > 0))) ??
      product.variants[0];

    if (candidate) {
      setSelectedColor(candidate.color ?? null);
      setSelectedSize(candidate.size ?? null);

      // set highlighted index to the candidate's image if present
      const candidateUrl =
        candidate.image_url ??
        (Array.isArray(candidate.files) && candidate.files[0]?.preview_url) ??
        null;
      if (candidateUrl) {
        const idx = gallery.findIndex((g) => g.url === candidateUrl);
        if (idx >= 0) setHighlightedIdx(idx);
      }
    }
  }, [product.variants, gallery]);

  // Clicking a gallery thumb should sync to variant (if the image belongs to a variant)
  const handleThumbnailClick = useCallback(
    (idx: number) => {
      setHighlightedIdx(idx);
      const url = gallery[idx]?.url;
      if (!url) return;
      // find variant matching this image (image_url or files preview)
      const match = product.variants.find((v) => {
        if (v.image_url === url) return true;
        if (Array.isArray(v.files)) {
          return v.files.some((f: any) => f?.preview_url === url || f?.thumbnail_url === url);
        }
        return false;
      });
      if (match) {
        setSelectedColor(match.color ?? null);
        setSelectedSize(match.size ?? null);
      }
    },
    [gallery, product.variants]
  );

  // Selecting a color should:
  // - set color
  // - auto-select a sensible size (prefer an available size for that color)
  // - optionally set gallery image to a variant image for that color+size (if available)
  const handleSelectColor = useCallback(
    (color: string | null) => {
      setSelectedColor(color);
      setSelectedSize(null);

      if (!color) return;

      // find a variant for that color (prefer available)
      const variant = product.variants.find((v) => v.color === color && v.is_available) ??
        product.variants.find((v) => v.color === color);

      if (variant) {
        // set default size for that color
        if (variant.size) setSelectedSize(variant.size);

        // highlight its image if found in gallery
        const candidateUrl = variant.image_url ??
          (Array.isArray(variant.files) && variant.files[0]?.preview_url) ??
          null;
        if (candidateUrl) {
          const idx = gallery.findIndex((g) => g.url === candidateUrl);
          if (idx >= 0) setHighlightedIdx(idx);
        }
      }
    },
    [product.variants, gallery]
  );

  // Selecting a size should set size and try to find a variant image
  const handleSelectSize = useCallback(
    (size: string | null) => {
      setSelectedSize(size);

      if (!selectedColor || !size) return;

      const variant = variantsByKey.get(`${selectedColor}::${size}`);
      if (variant) {
        const url = variant.image_url ?? (Array.isArray(variant.files) && variant.files[0]?.preview_url) ?? null;
        if (url) {
          const idx = gallery.findIndex((g) => g.url === url);
          if (idx >= 0) setHighlightedIdx(idx);
        }
      }
    },
    [selectedColor, variantsByKey, gallery]
  );

  // Add to cart
  const handleAddToCart = useCallback(async () => {
    const variant = selectedVariant ?? product.variants.find(v => v.color === selectedColor && v.size === selectedSize) ?? null;
    if (!variant) {
      toast.error("Please select a valid variant.");
      return;
    }

    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    const openCart = Array.isArray(cart) ? cart.find((c) => c.status === "open") : cart;
    if (!openCart?.id) {
      toast.error("Cart not found.");
      return;
    }

    try {
      await addToCart({
        cartId: openCart.id,
        productVariantId: variant.id,
        quantity: qty,
        variantColor: selectedColor,
        variantSize: selectedSize,
      });
      toast.success("Added to cart");
      router.push(callbackUrl);
    } catch (err: any) {
      toast.error(`Failed: ${err?.response?.data?.error || err?.message || "unknown"}`);
    }
  }, [selectedVariant, product.variants, selectedColor, selectedSize, isAuthenticated, cart, qty, router, callbackUrl]);

  // Diagnostics
  useEffect(() => {
    console.log("ProductView debug:");
    console.log("colors:", colors);
    console.log("sizesForSelectedColor:", selectedColor, sizesForSelectedColor);
    console.log("selectedColor:", selectedColor);
    console.log("selectedSize:", selectedSize);
    console.log("selectedVariant:", selectedVariant);
    console.log("gallery highlightedIdx:", highlightedIdx, gallery[highlightedIdx]?.url);
    console.log("priceLabel:", priceLabel, "inStock:", inStock);
  }, [colors, sizesForSelectedColor, selectedColor, selectedSize, selectedVariant, highlightedIdx, gallery, priceLabel, inStock]);

  // Render
  return (
    <section className="product-detail-container flex flex-col md:flex-row gap-8">
      {/* LEFT: Images */}
      <div className="product-images flex flex-col gap-4">
        <div className="main-image relative">
          {gallery[highlightedIdx]?.url ? (
            <img
              src={gallery[highlightedIdx].url}
              alt={product.name}
              className="rounded-xl object-cover w-full h-auto"
              style={{ aspectRatio: "1 / 1" }}
            />
          ) : (
            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          <div className="absolute top-2 right-2 z-10">
            <FavoriteSelector isFavorited={isFavorited} toggleFavorite={() => setIsFavorited(!isFavorited)} size={28} />
          </div>
        </div>

        {/* Gallery Thumbnails Images*/}
        <div className="image-gallery flex gap-2 flex-wrap">
          {gallery.map((g, i) => (
            <img
              key={g.key}
              src={g.url}
              alt={`${product.name} thumbnail ${i + 1}`}
              width={80}
              height={80}
              className={`w-20 h-20 rounded overflow-hidden transition-all duration-200 cursor-pointer border-2 ${i === highlightedIdx ? "border-blue-500 ring-2 ring-blue-400 scale-105" : "border-transparent hover:border-gray-300"}`}
              onClick={() => handleThumbnailClick(i)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Info */}
      <div className="product_info flex-1 space-y-4">
        <h1 className="product-title text-2xl font-bold">{product.name}</h1>

        <div className="product-price text-xl font-semibold text-gray-800">{priceLabel}</div>

        {/* Color selector - PASS ONLY STRINGS */}
        <ColorSelector
          colors={product.colors}
          selectedColor={selectedColor}
          onSelect={(color) => setSelectedColor(color)}
          variantImages={Object.fromEntries(
            product.variants.map(v => [v.color ?? "", v.image_url ?? ""])
          )}
        />

        <SizeSelector
          sizes={sizesForSelectedColor}
          selectedSize={selectedSize}
          onSelect={(size) => setSelectedSize(size)}
          disabledSizes={product.variants
            .filter(v => v.color === selectedColor && !v.is_available)
            .map(v => v.size ?? "")
          }
        />

        {/* <ColorSelector
          colors={colors}
          selectedColor={selectedColor}
          onSelect={(c) => handleSelectColor(c)}
        /> */}

        {/* Size selector - PASS ONLY STRINGS
        {selectedColor && (
          <SizeSelector
            sizes={sizesForSelectedColor}
            selectedSize={selectedSize}
            onSelect={(s) => handleSelectSize(s)}
          />
        )} */}

        <QuantitySelector qty={qty} setQty={setQty} min={1} max={99} />

        <div className={`stock-status mb-2 font-medium ${inStock ? "text-green-600" : "text-red-600"}`}>
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
