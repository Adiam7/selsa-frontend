// File: src/features/product/ProductDetail.tsx
'use client';

import { addToCart } from '@/lib/api/cart';
import { useCart } from '@/features/cart/hooks/useCart';
import { toast } from 'react-hot-toast';
import Image from "next/image";
import { useUser } from '@/features/auth/hooks/useUser';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Product,
  ProductImage,
  ProductOptionType,
  ProductOptionValue,
  ProductVariant,
} from "@/types/product";


interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useUser();
  const { cart, loading } = useCart();
  const callbackUrl = searchParams.get('callbackUrl') || '/cart';
  
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const galleryImages = product.gallery_images ?? product.images ?? [];
  const primaryImage = galleryImages.find((img) => img.is_primary) || galleryImages[0];
  const [mainImage, setMainImage] = useState<string>(primaryImage?.image || "");
  

  // Extract option types and group option values by type
  const optionTypesMap: Record<number, ProductOptionType> = {};
  const optionValuesByType: Record<number, ProductOptionValue[]> = {};

  product.variants?.forEach((variant) => {
    variant.option_values.forEach((optionValue) => {
      const type = optionValue.option_type;
      const typeId = typeof type === "object" ? type.id : type;

      // Build optionTypesMap
      if (!optionTypesMap[typeId]) {
        // DEBUG: See what this actually logs
        // console.log('DEBUG: See what this actually logs');
        // console.log("🔍 Option Type:", type);
        // console.log("🔍 Option Type Name:", type.name);

        optionTypesMap[typeId] = {
          id: typeId,
          name: typeof type === "object" ? type.name || `Option ${typeId}` : `Option ${typeId}`,
          field_type: typeof type === "object" ? type.field_type || "dropdown" : "dropdown",
          
        };
      }


      // Build optionValuesByType
      if (!optionValuesByType[typeId]) {
        optionValuesByType[typeId] = [];
      }

      if (!optionValuesByType[typeId].some((v) => v.id === optionValue.id)) {
        optionValuesByType[typeId].push(optionValue);
      }
    });
  });

  // #const optionTypes = Object.values(optionTypesMap);
  console.log("🔍 selectedOptions:", selectedOptions);
  // console.log("🔍 optionValuesByType:", optionValuesByType);
  // console.log("🔍 optionValuesBy Product:",  product.variants?.values);
  // console.log("optionValuesBy Product: ", Array.from(product.variants.values()));
  

  const inStock = product.variants
    ? product.variants.some((variant) => !variant.is_out_of_stock)
    : product.availability;

  // Handle image click
  const handleImageClick = (img: ProductImage) => {
    console.log("🖼️ Image clicked:", img);

    if (!img) {
      console.warn("⚠️ No image passed to handleImageClick.");
      return;
    }

    const { id, image, is_primary, alt_text, option_values } = img;

    console.log("Image Details:");
    console.log("🆔 id:", id);
    console.log("🌐 image:", image);
    console.log("⭐ is_primary:", is_primary);
    console.log("📝 alt_text:", alt_text);
    console.log("🎯 option_values:", option_values);

    if (!option_values || option_values.length === 0) {
      console.warn("⚠️ No option_values on image — cannot derive variant info.");
      return;
    }

    // Build a map of selected option_type.id -> option_value.id
    const updatedOptions = option_values.reduce((acc, value) => {
      if (!value.option_type || value.option_type.id == null) {
        console.warn("⚠️ Missing option_type or ID in option_value:", value);
        return acc;
      }
      acc[value.option_type.id] = value.id;
      return acc;
    }, {} as Record<number, number>);

    console.log("✅ Derived selectedOptions from image:", updatedOptions);

    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      ...updatedOptions,
    }));
  };




  const findMatchingVariant = (): ProductVariant | undefined => { 
  const selectedIds = Object.values(selectedOptions).sort();

    return product.variants?.find((variant) => {
      const variantIds = variant.option_values.map((v) => v.id).sort();
      console.log("🔍 Checking variant:", variant.id);
      console.log("🔍 Variant option IDs:", variantIds);
      console.log("🔍 Selected option IDs:", selectedIds);
      return (
        selectedIds.length === variantIds.length &&
        selectedIds.every((id, i) => id === variantIds[i])
      );
    });
  };
  

  useEffect(() => {

    if (!Object.keys(optionTypes).length) {
        console.log("⏳  Waiting for product.option_types to load...");
        return;
      }

      const requiredOptions = Object.keys(optionTypes).length;
      const selectedCount = Object.keys(selectedOptions).length;

      if (selectedCount < requiredOptions) {
        console.log("⛔ Not all options selected yet.");
        return;
      }
      
    const matchedVariant = findMatchingVariant();
    console.log("🧩 Selected Options:", selectedOptions);
    console.log("🔍 Matched Variant:", matchedVariant);
    
    if (!matchedVariant || !matchedVariant.option_values?.length) {
      console.warn("⚠️ Incomplete or missing matched variant.");
      return;
    }

    if (matchedVariant) {
      
      const matchImg = galleryImages.find((img) => {
        if (!img.option_values || img.option_values.length === 0) {
          console.log("⛔ Skipping image with no option_values:", img);
          return false;
        }

        const variantOptionIds = matchedVariant.option_values.map((v) => v.id).sort();
        const imageOptionIds = img.option_values.map((v) => v.id).sort();

        const isMatch =
          variantOptionIds.length === imageOptionIds.length &&
          variantOptionIds.every((id, i) => id === imageOptionIds[i]);

        console.log("🔍 Checking image:", img.image);
        console.log("   Image option IDs:", imageOptionIds);
        console.log("   Variant option IDs:", variantOptionIds);
        console.log("   Is full match:", isMatch);

        return isMatch;
      });

      if (matchImg) {
        console.log("✅ Found matching image:", matchImg.image);
        setMainImage(matchImg.image);
        return;
      }
      console.warn("⚠️ No matching image found for variant options.");

      // Fallback: match by SKU
      const skuImage = galleryImages.find((img) =>
        img.image.includes(matchedVariant.sku || "")
      );
      if (skuImage) {
        console.log("🪄 Fallback match by SKU:", skuImage.image);
        setMainImage(skuImage.image);
        return;
      }

      console.warn("❌ No matching image found for variant. Falling back...");
    }

    if (primaryImage?.image) {
      console.log("🔁 Using primary image fallback:", primaryImage.image);
      setMainImage(primaryImage.image);
    } else {
      console.warn("⚠️ No primary image available!");
    }

    
  }, [selectedOptions, galleryImages, product.variants, primaryImage]);

  
    // Add these lines:
  const [shareUrl, setShareUrl] = useState("");
  const [shareTitle, setShareTitle] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
    setShareTitle(document.title);
  }, []);

  
  // const router = useRouter();
  // // Example: using a custom hook
  // const { cart, loading } = useCart(); // Replace with your actual cart hook or context

  // console.log("userCart:", cart);
  // const searchParams = useSearchParams();
  
  // const callbackUrl = searchParams.get("callbackUrl") || "/"; // ← fallback to dashboard

  
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
        quantity,
        optionValues: Object.values(selectedOptions),
      });

      toast.success('Added to cart!');
      router.push(callbackUrl);
    } catch (error: any) {
      toast.error(`Failed: ${error.response?.data?.error || error.message}`);
    }
  }, [
    cart,
    selectedOptions,
    quantity,
    isAuthenticated,
    callbackUrl,
    router,
    findMatchingVariant,
  ]); 

  const [optionTypes, setOptionTypes] = useState<Record<number, OptionType>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/option-types/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch option types");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Option Types Fetched:", data);
        const map = Object.fromEntries(data.map((t) => [t.id, t]));
        setOptionTypes(map);
      })
      .catch((err) => console.error("Error fetching option types:", err))
      .finally(() => setIsLoading(false));
  }, []);


  return (
    <section className="product-detail-container flex flex-col md:flex-row gap-8">

      {/* Product Images */}
      <div className="product-images flex flex-col gap-4">
        <div className="main-image">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={primaryImage?.alt_text || product.name}
              width={400}
              height={400}
              className="rounded-xl object-cover"
              priority
            />
          ) : (
            <p>No images available.</p>
          )}
        </div>

       <div className="image-gallery flex gap-2 flex-wrap">
          {galleryImages.length > 0 ? (
            galleryImages.map((img: ProductImage, index) => (
              <div key={img.id ?? index}> {/* 👈 key used here */}
              {/* <div key={img.id}> */}
                <Image
                  src={img.image}
                  alt={img.alt_text || product.name}
                  width={80}
                  height={80}
                  className="gallery-thumb cursor-pointer border rounded"
                  onClick={() => handleImageClick(img)} // ✅ Make sure this uses your handler!
                />
                {/* 👶 Add this below each image */}
                {/* <span className="text-xs block">
                  Option Type: {img.option_type}, Value: {img.option_value}
                </span> */}
              </div>
            ))
          ) : (
            <p>No additional images.</p>
          )}
       </div>

      </div>

      {/* Product Info */}
      <div className="product_info flex-1">
        <h1 className="product-title text-2xl font-bold mb-2">{product.name}</h1>
        <p className="product-price text-xl text-primary mb-4">${product.price}</p>

        {/* Product Options */}
        <form  className="space-y-4">
          <input type="hidden" name="product_slug" value={product.slug} />

          {isLoading ? (
            <p>Loading options...</p>
          ) : (
            Object.values(optionTypes).map((optionType) => (
              <div className="product-option mb-4" key={optionType.id}>
                <label
                  htmlFor={`option-${optionType.id}`}
                  className="block font-medium mb-1 text-gray-800"
                >
                  {optionType.name || `Option ${optionType.id}`}:
                </label>
                <select
                  id={`option-${optionType.id}`}
                  name={`option-${optionType.id}`}
                  value={selectedOptions[optionType.id] || ""}
                  onChange={(e) =>
                    setSelectedOptions({
                      ...selectedOptions,
                      [optionType.id]: Number(e.target.value),
                    })
                  }
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="">
                    -- Select {optionType.name || `Option ${optionType.id}`} --
                  </option>
                  {optionValuesByType[optionType.id]?.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.value}
                    </option>
                  ))}
                </select>
              </div>
            ))
          )}

          
          {/* Quantity */}
          <div className="product-option">
            <label htmlFor="quantity" className="block font-medium mb-1">
              Quantity:
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={quantity}
              min={1}
              max={product.variants?.[0]?.stock_quantity ?? 99}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
            />
          </div>

          {/* Stock Status */}
          <div className={`stock-status mb-2 ${inStock ? "text-green-600" : "text-red-600"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </div>

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

          {/* Validation Message */}
          {/* {optionTypes.some(type => !selectedOptions[type.id]) && (
            <div className="text-yellow-600 text-sm mb-2">
              Please select all options to add to cart.
            </div>
          )} */}

        </form>

        {/* Product Description */}
        <div className="product-description mt-6 overflow-auto">
          <p > Product Details:{product.description}</p>
        </div>

       {/* Share Product */}
        <div className="ins-tile__row ins-tile__row--social">
          <p>Share this product with your friends:</p>
          <div className="ins-tile__row-inner flex flex-row gap-6 mt-6">
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
      </div>
    </section>
  );
}
