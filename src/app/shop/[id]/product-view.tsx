"use client";

import { addToCart } from '@/lib/api/cart';
import { useCart } from '@/features/cart/hooks/useCart';
import React, { useMemo, useState, useEffect,useCallback  } from "react";
import type { Product, Variant } from "@/types/product";
import { useRouter, useSearchParams } from 'next/navigation';


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

    addImage(product?.image_url);

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
  const router = useRouter();
  // provide a client-side fallback for auth state so isAuthenticated is defined
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    // adapt keys to your app auth/token storage (authToken | token | user etc.)
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      null;
    setIsAuthenticated(Boolean(token));
  }, []);

  const searchParams = useSearchParams();
  const { cart, loading } = useCart();
  const callbackUrl = searchParams.get('callbackUrl') || '/cart';
  
  if (!product || !product.variants || product.variants.length === 0) {
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
  const [highlightedIdx, setHighlightedIdx] = useState(0);

  // Favorites state + handler (persist to localStorage; optional backend call if authenticated)
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]") as (string | number)[];
      const pid = product?.id ?? product?.printful_id;
      setIsFavorited(pid != null && favs.includes(pid));
    } catch {
      setIsFavorited(false);
    }
  }, [product?.id, product?.printful_id]);

  const toggleFavorite = async () => {
    const pid = product?.id ?? product?.printful_id;
    if (pid == null) return;
    try {
      // optimistic update
      const prev = isFavorited;
      setIsFavorited(!prev);

      const favs = JSON.parse(localStorage.getItem("favorites") || "[]") as any[];
      const exists = favs.includes(pid);
      const newFavs = exists ? favs.filter((x) => x !== pid) : [...favs, pid];
      localStorage.setItem("favorites", JSON.stringify(newFavs));

      // optional backend sync if you have an API and user is authenticated
      if (isAuthenticated) {
        await fetch(exists ? `/api/favorites/${pid}` : "/api/favorites", {
          method: exists ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: exists ? undefined : JSON.stringify({ productId: pid }),
        }).catch(() => {
          // revert on failure
          setIsFavorited(prev);
          localStorage.setItem("favorites", JSON.stringify(favs));
        });
      }
    } catch (err) {
      console.error("toggleFavorite error", err);
    }
  };

  const variantsByKey = useMemo(() => {
    const map = new Map<string, Variant>();
    for (const v of product.variants) {
      map.set(`${v.color ?? ""}::${v.size ?? ""}`, v);
    }
    return map;
  }, [product.variants]);

  const selectedVariant =
    variantsByKey.get(`${selectedColor}::${selectedSize}`) ?? null;

  // helper: find the variant that matches current selection (used by Add to Cart)
  const findMatchingVariant = React.useCallback(() => {
    if (selectedVariant) return selectedVariant;
    return (
      product.variants.find(
        (v) =>
          (v.color ?? "") === (selectedColor ?? "") &&
          (v.size ?? "") === (selectedSize ?? "")
      ) ?? null
    );
  }, [selectedVariant, selectedColor, selectedSize, product.variants]);

  const priceLabel = selectedVariant
    ? money(selectedVariant.price, selectedVariant.currency)
    : "";

  const inStock = selectedVariant ? selectedVariant.is_available : true;

    const handleAddToCart = useCallback(async () => {
    const variant = findMatchingVariant();

    if (!variant) {
      toast.error('Please select all required options.');
      return;
    }

    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    const openCart = Array.isArray(cart)
      ? cart.find((c) => c.status === 'open')
      : cart;

    if (!openCart?.id) {
      console.error("❌ Invalid openCart ID:", openCart?.id);
      toast.error('Cart not found.');
      console.log("🛒 openCart.id:", openCart.id, typeof openCart.id);
      console.log("🛒 cart:", cart);
      return;
    }

    try {
      await addToCart({
        cartId: openCart.id,
        productVariantId: variant.id,
        quantity: qty,
        // include explicit color/size for the selected variant
        variantColor: selectedColor,
        variantSize: selectedSize,
      });

      toast.success('Added to cart!');
      router.push(callbackUrl);
    } catch (error: any) {
      toast.error(`Failed: ${error.response?.data?.error || error.message}`);
    }
  }, [
    cart,
    selectedColor,
    selectedSize,
    qty,
    isAuthenticated,
    callbackUrl,
    router,
    findMatchingVariant,
  ]); 

  // --- Diagnostics ---
  useEffect(() => {
    console.log("🖥️ Displayed in UI");
    console.log("Selected Color:", selectedColor);
    console.log("Selected Size:", selectedSize);
    console.log("Quantity:", qty);
    console.log("Price Label:", priceLabel);
    console.log("In Stock:", inStock);
    console.log("Highlighted Index:", highlightedIdx);
    console.log("Main Image URL:", gallery[highlightedIdx]?.url ?? "none");
    console.log("Gallery URLs:", gallery.map((g) => g.url));
    console.log("Product Name:", product.name);
    console.log("Product Description:", product.description ?? "none");
    console.log("Product Base Image:", product.image_url ?? "none");
    console.log("Product Colors:", colors);
    console.log("Product Sizes:", sizes);
    console.log("Product Variants:", product.variants.length);
    product.variants.forEach((v) =>
      console.log(`• Variant: ${v.color} / ${v.size}`, v)
    );
  }, [
    selectedColor,
    selectedSize,
    qty,
    priceLabel,
    inStock,
    highlightedIdx,
    gallery,
    product,
    colors,
    sizes,
  ]);

  // safe share URL / title (client-only fallback)
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/shop/${product?.id ?? product?.printful_id ?? ""}`;

  const shareTitle = product?.name ?? "Check out this product";

  return (
    <section className="product-detail-container flex flex-col md:flex-row gap-8 ">
      
      {/* LEFT: Images */}
      <div className="product-images flex flex-col gap-4">
        <div className="main-image relative"> {/* made relative so overlay can be positioned */}
          {/* top-right favorite toggle */}
          <button
            type="button"
            onClick={toggleFavorite}
            aria-pressed={isFavorited ? "true" : "false"}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/90 hover:bg-white 
            shadow-none border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {isFavorited ? (
              // filled / red heart (favorited)
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden="true"
                className="w-9 h-9"
              >
                <path
                  d="M12 21L10.55 19.7C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 
                  5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 19.7L12 21Z"
                  stroke="#FF0000"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#FF0000"
                />
              </svg>
            ) : (
              // outline heart (not favorited)
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden="true"
                className="w-9 h-9 text-black"
              >
                <path
                  d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 
                  12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z"
                  stroke="black"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          {gallery[highlightedIdx]?.url ? (
            <>
              <img
                src={gallery[highlightedIdx].url}
                alt={product.name}
                className="rounded-xl object-cover"
                width={500}
                height={500}
                style={{ aspectRatio: "1 / 1" }}
              />
              
            </>
          ) : (
            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

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
            <label className="block font-medium mb-1 text-gray-800">Color:</label>
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
        
       
        {sizes.length > 0 && (
          <div className="product-option mb-4 ">
            <label className="block font-medium mb-1 text-gray-800">Size:</label>
            <div className="flex gap-3 flex-nowrap overflow-x-auto">
              {sizes
                .sort((a, b) => {
                  // Define size mapping for standard and extended sizes
                  const getSizeValue = (size) => {
                    // Normalize size (remove spaces, convert to uppercase)
                    const s = size.trim().toUpperCase();

                    // Handle sizes with regex
                    const match = s.match(/^(X{0,2})(S|M|L)?(\d{0,2})(XL)?$/);
                    if (!match) return 999; // Fallback for unknown sizes

                    const [, xPrefix, base, number, xlSuffix] = match;
                    let value = 0;

                    // Base size values
                    const baseValues = { S: 1, M: 2, L: 3 };
                    if (base) {
                      value = baseValues[base];
                    }

                    // Handle XL explicitly
                    if (s === "XL") {
                      value = 4; // XL comes after L, before 2XL
                    }

                    // Adjust for X prefixes (e.g., XS, XXS)
                    if (xPrefix && base) {
                      value = baseValues[base] - xPrefix.length; // XS = 0, XXS = -1
                    }

                    // Adjust for numbered XL sizes (e.g., 2XL, 3XL)
                    if (number && xlSuffix) {
                      value = 4 + parseInt(number); // 2XL = 6, 3XL = 7
                    }

                    return value;
                  };

                  const valueA = getSizeValue(a);
                  const valueB = getSizeValue(b);

                  // Sort by size value, fallback to alphabetical for equal values
                  return valueA - valueB || a.localeCompare(b);
                })
                .map((s) => (
                  <div
                    key={s || "none"}
                    onClick={() => setSelectedSize(s)}
                    aria-selected={selectedSize === s}
                    className={`px-3 py-1 rounded-xl text-gray-800 cursor-pointer transition-all whitespace-nowrap ${
                      selectedSize === s
                        ? "bg-blue-100 text-blue-700 border border-blue-500"
                        : "bg-white/10 border border-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {s}
                  </div>
                ))}
            </div>
          </div>
        )}

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

        <div
          className={`stock-status mb-2 font-medium ${
            inStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </div>

        {/* <button
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
        </button> */}

        {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to Cart"
            className="add-to-cart-btn btn btn-primary px-4 py-2 rounded bg-blue-600 text-white flex items-center gap-2"
            disabled={!inStock || loading || cart == null}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Adding...
              </>
            ) : (
              "Add to Cart"
            )}
          </button>

        {/* Product Description */}
        {product.description && (
          <div className="product-description mt-6 overflow-auto">
            <p>{product.description}</p>
          </div>
        )}
      </div>

        {/* Share Product */}
        <div className="ins-tile__row ins-tile__row--social ">
          <p>Share this product with your friends:</p>
          <div className="flex flex-row flex-nowrap gap-6 mt-6">
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              title="Facebook"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="ins-tile__icon ins-tile__icon--plain"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.65H8.031v-2.629h2.474v-1.749 c0-2.896,1.411-4.167,3.818-4.167c1.153,0,1.762,0.085,2.051,0.124v2.294h-1.642c-1.022,0-1.379,0.969-1.379,2.061v1.437h2.995 l-0.406,2.629h-2.588v7.247C18.235,21.236,22,17.062,22,12C22,6.477,17.523,2,12,2z"></path>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              title="Instagram"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="ins-tile__icon ins-tile__icon--plain"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
                  <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"></path>
              </svg>
              
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
              title="WhatsApp"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className="ins-tile__icon ins-tile__icon--plain"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
                  <path d="M 15 3 C 8.373 3 3 8.373 3 15 C 3 17.251208 3.6323415 19.350068 4.7109375 21.150391 L 3.1074219 27 L 9.0820312 25.431641 C 10.829354 26.425062 12.84649 27 15 27 C 21.627 27 27 21.627 27 15 C 27 8.373 21.627 3 15 3 z M 10.892578 9.4023438 C 11.087578 9.4023438 11.287937 9.4011562 11.460938 9.4101562 C 11.674938 9.4151563 11.907859 9.4308281 12.130859 9.9238281 C 12.395859 10.509828 12.972875 11.979906 13.046875 12.128906 C 13.120875 12.277906 13.173313 12.453437 13.070312 12.648438 C 12.972312 12.848437 12.921344 12.969484 12.777344 13.146484 C 12.628344 13.318484 12.465078 13.532109 12.330078 13.662109 C 12.181078 13.811109 12.027219 13.974484 12.199219 14.271484 C 12.371219 14.568484 12.968563 15.542125 13.851562 16.328125 C 14.986562 17.342125 15.944188 17.653734 16.242188 17.802734 C 16.540187 17.951734 16.712766 17.928516 16.884766 17.728516 C 17.061766 17.533516 17.628125 16.864406 17.828125 16.566406 C 18.023125 16.268406 18.222188 16.319969 18.492188 16.417969 C 18.766188 16.515969 20.227391 17.235766 20.525391 17.384766 C 20.823391 17.533766 21.01875 17.607516 21.09375 17.728516 C 21.17075 17.853516 21.170828 18.448578 20.923828 19.142578 C 20.676828 19.835578 19.463922 20.505734 18.919922 20.552734 C 18.370922 20.603734 17.858562 20.7995 15.351562 19.8125 C 12.327563 18.6215 10.420484 15.524219 10.271484 15.324219 C 10.122484 15.129219 9.0605469 13.713906 9.0605469 12.253906 C 9.0605469 10.788906 9.8286563 10.071437 10.097656 9.7734375 C 10.371656 9.4754375 10.692578 9.4023438 10.892578 9.4023438 z"></path>
              </svg>
            </a>

            {/* Twitter/X */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
              title="Share on X"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="ins-tile__icon ins-tile__icon--plain"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M22,3.999c-0.78,0.463-2.345,1.094-3.265,1.276c-0.027,0.007-0.049,0.016-0.075,0.023c-0.813-0.802-1.927-1.299-3.16-1.299 c-2.485,0-4.5,2.015-4.5,4.5c0,0.131-0.011,0.372,0,0.5c-3.353,0-5.905-1.756-7.735-4c-0.199,0.5-0.286,1.29-0.286,2.032 c0,1.401,1.095,2.777,2.8,3.63c-0.314,0.081-0.66,0.139-1.02,0.139c-0.581,0-1.196-0.153-1.759-0.617c0,0.017,0,0.033,0,0.051 c0,1.958,2.078,3.291,3.926,3.662c-0.375,0.221-1.131,0.243-1.5,0.243c-0.26,0-1.18-0.119-1.426-0.165 c0.514,1.605,2.368,2.507,4.135,2.539c-1.382,1.084-2.341,1.486-5.171,1.486H2C3.788,19.145,6.065,20,8.347,20 C 15.777,20,20,14.337,20,8.999c0-0.086-0.002-0.266-0.005-0.447C19.995,8.534,20,8.517,20,8.499c0-0.027-0.008-0.053-0.008-0.08 c-0.003-0.136-0.006-0.263-0.009-0.329c0.79-0.57,1.475-1.281,2.017-2.091c-0.725,0.322-1.503,0.538-2.32,0.636 C20.514,6.135,21.699,4.943,22,3.999z"></path>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/"
              title="TikTok"
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
              className="ins-tile__icon ins-tile__icon--plain"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
                  <path d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.104,4,24,4z M22.689,13.474 c-0.13,0.012-0.261,0.02-0.393,0.02c-1.495,0-2.809-0.768-3.574-1.931c0,3.049,0,6.519,0,6.577c0,2.685-2.177,4.861-4.861,4.861 C11.177,23,9,20.823,9,18.139c0-2.685,2.177-4.861,4.861-4.861c0.102,0,0.201,0.009,0.3,0.015v2.396c-0.1-0.012-0.197-0.03-0.3-0.03 c-1.37,0-2.481,1.111-2.481,2.481s1.11,2.481,2.481,2.481c1.371,0,2.581-1.08,2.581-2.45c0-0.055,0.024-11.17,0.024-11.17h2.289 c0.215,2.047,1.868,3.663,3.934,3.811V13.474z"></path>
              </svg>
            </a>

            {/* Copy Link */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
              }}
              title="Copy Link"
              aria-label="Copy Link"
              className="ins-tile__icon ins-tile__icon--plain"
              type="button"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H14V14H4V4Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 10H20V20H10V10Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div> 
    </section>
  );
}
