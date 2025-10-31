"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Variant } from "@/types/printful_product";
import type { GalleryItem } from "@/features/Variant/hooks/useGallery";

interface UseVariantSelectorOptions {
  galleryState?: GalleryItem[];
  setHighlightedIdx?: (idx: number) => void;
  mainImageUrl?: string; // main product image url for initial selection
}

export const useVariantSelector = (
  variants: Variant[],
  options?: UseVariantSelectorOptions
) => {
  const galleryState = options?.galleryState ?? [];
  const setHighlightedIdxExternal = options?.setHighlightedIdx ?? (() => {});
  const mainImageUrl = options?.mainImageUrl ?? "";

  // --- State ---
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [highlightedIdx, setHighlightedIdx] = useState<number>(0);

  // --- Available colors & sizes ---
  const colors = useMemo(() => {
    const map = new Map<string, boolean>();
    variants.forEach((v) => {
      if (v.color && !map.has(v.color)) {
        map.set(v.color, variants.some((x) => x.color === v.color && x.is_available));
      }
    });
    return Array.from(map.entries()).map(([color, available]) => ({ color, available }));
  }, [variants]);

  const colorToSizes = useMemo(() => {
    const map: Record<string, { size: string; available: boolean }[]> = {};
    variants.forEach((v) => {
      if (!v.color || !v.size) return;
      map[v.color] ??= [];
      map[v.color].push({ size: v.size, available: v.is_available });
    });
    return map;
  }, [variants]);

  const sizes = useMemo(() => {
    if (!selectedColor) return [];
    return colorToSizes[selectedColor] ?? [];
  }, [selectedColor, colorToSizes]);

  // --- Selected variant ---
  const selectedVariant = useMemo(() => {
    return (
      variants.find(
        (v) =>
          v.color === selectedColor &&
          v.size === selectedSize
      ) ?? null
    );
  }, [variants, selectedColor, selectedSize]);

  const inStock = selectedVariant?.is_available ?? true;

  // --- Initial selection logic ---
  useEffect(() => {
    if (selectedVariant) return;

    // 1️⃣ Try to find a variant whose image matches the main product image
    let initialVariant = variants.find((v) => v.image_url === mainImageUrl);

    // 2️⃣ Fallback: first available variant
    if (!initialVariant) {
      initialVariant = variants.find((v) => v.is_available) ?? variants[0];
    }

    if (!initialVariant) return;

    setSelectedColor(initialVariant.color ?? null);
    setSelectedSize(initialVariant.size ?? null);

    // Set highlighted gallery index if main image exists
    const idx = galleryState.findIndex((g) => g.url === mainImageUrl);
    if (idx >= 0) {
      setHighlightedIdx(idx);
      setHighlightedIdxExternal(idx);
    }
  }, [variants, mainImageUrl, galleryState, selectedVariant, setHighlightedIdxExternal]);

  // --- Handlers ---
  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      // pick first available size for that color
      const variantForColor = variants.find((v) => v.color === color && v.is_available);
      if (variantForColor) setSelectedSize(variantForColor.size ?? null);
    },
    [variants]
  );

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
  }, []);

  const handleThumbnailClick = useCallback(
    (idx: number) => {
      setHighlightedIdx(idx);
      setHighlightedIdxExternal(idx);
      const galleryItem = galleryState[idx];
      if (!galleryItem) return;

      // select color if gallery has color tag
      if (galleryItem.color) {
        setSelectedColor(galleryItem.color);

        // pick first variant with this color
        const variantForGallery = variants.find(
          (v) => v.color === galleryItem.color && v.is_available
        );
        if (variantForGallery) setSelectedSize(variantForGallery.size ?? null);
      }
    },
    [galleryState, variants, setHighlightedIdxExternal]
  );

  const variantImages = useMemo(() => {
    const map: Record<string, string> = {};
    variants.forEach((v) => {
      if (v.color && v.image_url && !map[v.color]) {
        map[v.color] = v.image_url;
      }
    });
    return map;
  }, [variants]);

  return {
    selectedColor,
    selectedSize,
    selectedVariant,
    colors,
    sizes,
    setColor: setSelectedColor,
    setSize: handleSizeSelect,
    inStock,
    variantImages,
    highlightedIdx,
    handleThumbnailClick,
    handleColorSelect,
    setHighlightedIdx,
  };
};
