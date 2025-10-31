// ProductGallery.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGallery, GalleryItem } from "@/features/Variant/hooks/useGallery";
import type { Product } from "@/types/printful_product";

interface ProductGalleryProps {
  product: Product;
  onHighlightChange?: (idx: number) => void;
  onColorSelect?: (color: string) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  onHighlightChange,
  onColorSelect,
}) => {
  const { galleryState, highlightedIdx, setHighlightedIdx, galleryByColor } =
    useGallery(product);

  const colors = Object.keys(galleryByColor);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "default");

  const imagesToShow: GalleryItem[] = galleryByColor[selectedColor] || [];
  
    
  // --- Handle color selection ---
  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    onColorSelect?.(color);
    const firstImgIdx = gallery_color.findIndex((g) => g.color === color);
    console.log(firstImgIdx)
    // const secondImgIdx =galler_color.findIndex((g) => g.color === color);
    // console.log(secondImgIdx)
    if (firstImgIdx >= 0) setHighlightedIdx(firstImgIdx);
    onHighlightChange?.(firstImgIdx);
  };

  // --- Handle thumbnail click ---
  const handleThumbnailClick = (idx: number) => {
    setHighlightedIdx(idx);
    onHighlightChange?.(idx);
  };

    // ✅ Add console logs here, before returning JSX
  console.log("Gallery State:", galleryState);
  console.log("Highlighted Index:", highlightedIdx);


  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Color Swatches
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            style={{
              backgroundColor: color !== "default" ? color.toLowerCase() : "#ccc",
              border: selectedColor === color ? "2px solid black" : "1px solid gray",
              width: 24,
              height: 24,
              borderRadius: "50%",
            }}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>

      {/* Main Image */}
      {/* {imagesToShow[highlightedIdx] && (
        <div className=" aspect-square mx-auto">
          <Image
            src={imagesToShow[highlightedIdx].url}
            alt={product.name}
            className="object-cover rounded-xl"
            width={80}
            height={80}
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>
      )} */}

      {/* Thumbnail Carousel */}
      {/* <div className="flex gap-2 overflow-x-auto mt-2 pb-2">
        {imagesToShow.map((item, idx) => (
          <div
            key={item.key}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden border-2 cursor-pointer ${
              highlightedIdx === idx ? "border-black" : "border-gray-300"
            }`}
            onClick={() => handleThumbnailClick(idx)}
          >
            <Image
              src={item.url}
              alt={item.variantId ?? "thumbnail"}
              className="object-cover"
              width={80}
              height={80}
            />
          </div>
        ))}
      // </div> */} 
      
      <div className="image-gallery flex gap-2 flex-wrap gallery-container">
        {galleryState.map((g, i) => (
          <img
            key={g.key}
            src={g.url}
            alt={`${product.name} thumbnail ${i + 1}`}
            width={80}
            height={80}
            className={`gallery-thumbnail ${i === highlightedIdx ? "selected" : ""}
              w-20 h-20 rounded overflow-hidden transition-all duration-200 cursor-pointer border-2 ${
                i === highlightedIdx ? "border-blue-600" : "border-transparent"
              }`}
            onClick={() => handleThumbnailClick(i)}
          />
        ))}
      </div>
    </div>
  );
};


