"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import { addToCart } from "@/lib/api/cart";
import { useCart } from "@/features/cart/hooks/useCart";

import { QuantitySelector } from "@/components/QuantitySelector";
import { FavoriteSelector } from "@/components/FavoriteSelector";
import { ColorSelector } from "@/components/ColorSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { SelectedVariantPreview } from "@/components/SelectedVariantPreview";

import { useGallery } from "@/features/Variant/hooks/useGallery";
import { useVariantSelector } from "@/features/Variant/hooks/useVariantSelector";
import { ProductGallery } from "@/features/Variant/hooks/ProductGallery";
import type { Product } from "@/types/printful_product";

import ShareProduct from "@/components/ShareProduct";

import "@/components/SizeSelector.css";
import "@/components/ColorSelector.css";
import "@/components/QuantitySelector.css";
import "@/components/FavoriteSelector.css";
import "@/features/Variant/hooks/GallerySelector.css";


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

  const [qty, setQty] = useState<number>(1);
  const [isFavorited, setIsFavorited] = useState(false);

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

  // --- Gallery ---
  const { galleryState, highlightedIdx, setHighlightedIdx } = useGallery(product, {
    skipFirstVariantImage: true,
  });

  // --- Variant selector ---
  const {
    selectedVariant,
    selectedColor,
    selectedSize,
    colors,
    sizes,
    setSize,
    inStock,
    variantImages,
    handleColorSelect,
    handleThumbnailClick,
  } = useVariantSelector(product.variants, {
    galleryState,
    setHighlightedIdx,
    mainImageUrl: product.image_url,
  });

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

  const priceLabel = selectedVariant
    ? money(selectedVariant.price, selectedVariant.currency)
    : money(product.variants[0]?.price, product.variants[0]?.currency);

  return (
    <section className="product-detail-container flex flex-col md:flex-row gap-8">
      {/* LEFT: Images */}
      <div className="product-images flex flex-col gap-4">
        <div className="main-image relative">
          {galleryState[highlightedIdx]?.url ? (
            <div className="relative w-[500px] h-[500px]">
              <Image
                src={galleryState[highlightedIdx].url}
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

        {/* Product Gallery */}
        <ProductGallery
          product={product}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
          highlightedIdx={highlightedIdx}
          onHighlightChange={handleThumbnailClick}
        />
      </div>

      {/* RIGHT: Info */}
      <div className="product_info flex-1 space-y-4">
        <h1 className="product-title text-2xl font-bold">{product.name}</h1>

        <div className="product-price text-xl font-semibold text-gray-800">
          {priceLabel}
        </div>

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
          image={galleryState[highlightedIdx]?.url}
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

        <ShareProduct productName={product.name} />
      </div>
    </section>
  );
}
