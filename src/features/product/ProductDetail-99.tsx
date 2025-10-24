'use client';

import { useCart } from '@/features/cart/hooks/useCart';
import { useUser } from '@/features/auth/hooks/useUser';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/features/cart/components/AddToCartButton';
import { toast } from 'react-hot-toast';

import {
  Product,
  ProductImage,
  ProductOptionType,
  ProductOptionValue,
  ProductVariant,
} from '@/types/product';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useUser();
  const { cart, loading } = useCart();
  const callbackUrl = searchParams.get('callbackUrl') || '/cart';

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const [mainImage, setMainImage] = useState<string>(primaryImage?.image || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');

  const galleryImages = product.images ?? [];

  useEffect(() => {
    setShareUrl(window.location.href);
    setShareTitle(document.title);
  }, []);

  // Build option type/value lookup maps
  const optionTypesMap: Record<number, ProductOptionType> = {};
  const optionValuesByType: Record<number, ProductOptionValue[]> = {};

  product.variants?.forEach((variant) => {
    variant.option_values.forEach((optionValue) => {
      const type = optionValue.option_type;
      const typeId = typeof type === 'object' ? type.id : type;

      if (!optionTypesMap[typeId]) {
        optionTypesMap[typeId] = {
          id: typeId,
          name: typeof type === 'object' ? type.name || `Option ${typeId}` : `Option ${typeId}`,
          field_type: typeof type === 'object' ? type.field_type || 'dropdown' : 'dropdown',
        };
      }

      if (!optionValuesByType[typeId]) {
        optionValuesByType[typeId] = [];
      }

      if (!optionValuesByType[typeId].some((v) => v.id === optionValue.id)) {
        optionValuesByType[typeId].push(optionValue);
      }
    });
  });

  const optionTypes = Object.values(optionTypesMap);

  const inStock = product.variants
    ? product.variants.some((variant) => !variant.is_out_of_stock)
    : product.availability;

  const handleImageClick = (img: ProductImage) => {
    setMainImage(img.image);

    if (img.option_type && img.option_value) {
      setSelectedOptions((prev) => ({
        ...prev,
        [img.option_type]: img.option_value,
      }));
    }
  };

  const findMatchingVariant = (): ProductVariant | undefined => {
    const selectedIds = Object.values(selectedOptions).sort();

    return product.variants?.find((variant) => {
      const variantIds = variant.option_values.map((v) => v.id).sort();
      return (
        selectedIds.length === variantIds.length &&
        selectedIds.every((id, i) => id === variantIds[i])
      );
    });
  };

  useEffect(() => {
    const matchedVariant = findMatchingVariant();

    if (matchedVariant) {
      for (const value of matchedVariant.option_values) {
        const img = galleryImages.find(
          (img) =>
            img.option_type?.id === value.option_type.id &&
            img.option_value?.id === value.id
        );
        if (img) {
          setMainImage(img.image);
          return;
        }
      }

      const skuImage = galleryImages.find((img) =>
        img.image.includes(matchedVariant.sku || '')
      );
      if (skuImage) {
        setMainImage(skuImage.image);
        return;
      }
    }

    if (primaryImage?.image) {
      setMainImage(primaryImage.image);
    }
  }, [selectedOptions, galleryImages, product.variants, primaryImage]);

  return (
    <section className="product-detail-container flex flex-col md:flex-row gap-8">

    {/* ✅ Debug Output */}
    {/* <pre className="text-sm bg-gray-100 p-2 rounded">
      {JSON.stringify(selectedOptions, null, 2)}
    </pre>
    <pre className="text-xs bg-yellow-100 p-2 rounded">
      Matched variant: {JSON.stringify(findMatchingVariant(), null, 2)}
    </pre>
    <pre className="text-xs bg-gray-200 p-2 rounded mt-2">
      {JSON.stringify(galleryImages, null, 2)}
    </pre>
    <pre className="text-xs bg-green-100 p-2 mt-2 rounded">
      Current main image: {mainImage}
    </pre> */}
    

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
            galleryImages.map((img: ProductImage) => (
              <div key={img.id}>
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
        <form action={`/api/cart/add`} method="POST" className="space-y-4">
          <input type="hidden" name="product_slug" value={product.slug} />

          {optionTypes.map((optionType) => (
            <div className="product-option" key={optionType.id}>
              <label htmlFor={`option-${optionType.id}`} className="block font-medium mb-1 text-gray-800">
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
                className="border rounded px-2 py-1"
              >
                <option value="">-- Select {optionType.name || `Option ${optionType.id}`} --</option>
                {optionValuesByType[optionType.id]?.map((value) => (
                  <option key={value.id} value={value.id}>
                    {value.value}
                  </option>
                ))}
              </select>
              {Object.entries(selectedOptions).map(([typeId, valueId]) => (
              <input
                key={typeId}
                type="hidden"
                name={`option-${typeId}`}
                value={valueId}
              />
            ))}

            </div>
          ))}

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
            type="submit"
            className="add-to-cart-btn btn btn-primary px-4 py-2 rounded bg-blue-600 text-white"
            disabled={!inStock}
          >
            Add to Cart
          </button>
        </form>

        {/* Product Description */}
        <div className="product-description mt-6">
          <p>{product.description}</p>
        </div>
      </div>
    </section>
  );
}

