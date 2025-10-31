
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { Variant } from "@/types/printful_product";
import { GalleryItem } from "@/features/Variant/hooks/useGallery";

export const useVariantSelector = (
  variants: Variant[],
  options?: { galleryState: GalleryItem[]; setHighlightedIdx?: (idx: number) => void }
) => {
  const gallery = options?.galleryState ?? [];
  const externalSetHighlightedIdx = options?.setHighlightedIdx ?? (() => {});

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [highlightedIdx, setLocalHighlightedIdx] = useState<number>(0);

  const initializedRef = useRef(false); // ensure auto-selection runs once

  // --- Build variant maps ---
  const variantImages = useMemo(() => {
    const map: Record<string, string> = {};
    variants.forEach((v) => {
      if (v.color && v.image_url && !/printfile-preview/i.test(v.image_url) && !map[v.color]) {
        map[v.color] = v.image_url;
      }
    });
    return map;
  }, [variants]);

  // Map: color -> sizes with availability
  const colorToSizes = useMemo(() => {
    const map: Record<string, { size: string; available: boolean }[]> = {};
    variants.forEach((v) => {
      if (!v.color || !v.size) return;
      map[v.color] ??= [];
      map[v.color].push({ size: v.size, available: v.is_available });
    });
    return map;
  }, [variants]);

  // --- Compute available colors with stock info ---
  const colors = useMemo(() => {
    const map: { color: string; available: boolean }[] = [];
    const seen = new Set<string>();
    variants.forEach((v) => {
      if (!v.color || seen.has(v.color)) return;
      seen.add(v.color);
      const available = variants.some((x) => x.color === v.color && x.is_available);
      map.push({ color: v.color, available });
    });
    return map;
  }, [variants]);

  // --- Combine gallery and colors ---
  const gallery_color = useMemo(
    () =>
      gallery.map((g, i) => ({
        ...g,
        color: colors[i]?.color ?? null,
        available: colors[i]?.available ?? true,
      })),
    [gallery, colors]
  );
  console.log("🖼️ Gallery with Colors:", gallery_color);

  // --- Compute available sizes for selected color ---
  const sizes = useMemo(() => {
    if (!selectedColor) return [];
    return colorToSizes[selectedColor] ?? [];
  }, [selectedColor, colorToSizes]);

  // --- Selected variant ---
  const selectedVariant = useMemo(() => {
    return (
      variants.find(
        (v) =>
          (v.color ?? null) === (selectedColor ?? null) &&
          (v.size ?? null) === (selectedSize ?? null)
      ) ?? null
    );
  }, [variants, selectedColor, selectedSize]);

  const inStock = selectedVariant ? selectedVariant.is_available : true;

  // --- Auto-select initial variant using gallery_color ---
  useEffect(() => {
    if (initializedRef.current || selectedVariant) return;
    initializedRef.current = true;

    const mainGalleryItem = gallery_color.find((g) => !/printfile-preview/i.test(g.url));
    const initialVariant =
      variants.find((v) => v.id === mainGalleryItem?.variantId) ??
      variants.find((v) => v.is_available) ??
      variants[0];

    if (!initialVariant) return;

    setSelectedColor(initialVariant.color ?? null);
    setSelectedSize(initialVariant.size ?? null);

    const idx = gallery_color.findIndex((g) => g.variantId === initialVariant.id);
    if (idx >= 0) {
      setLocalHighlightedIdx(idx);
      externalSetHighlightedIdx(idx);
    }
  }, [variants, gallery_color, selectedVariant, externalSetHighlightedIdx]);

  // --- Unified highlight setter ---
  const updateHighlight = useCallback(
    (idx: number) => {
      setLocalHighlightedIdx(idx);
      externalSetHighlightedIdx(idx);
    },
    [externalSetHighlightedIdx,setLocalHighlightedIdx]
  );

  // --- Handlers ---
  const setColor = useCallback((color: string | null) => {
    setSelectedColor(color);
    setSelectedSize(null);
  }, []);

  const setSize = useCallback((size: string | null) => {
    setSelectedSize(size);
  }, []);

  const handleThumbnailClick = useCallback(
    (idx: number) => {
      updateHighlight(idx);

      const galleryItem = gallery_color[idx];
      if (!galleryItem) return;

      // Instead of calling handleColorSelect (circular), just set the state directly
      setColor(galleryItem.color);
      setSelectedSize(null); // optionally reset size
    },
    [gallery_color, updateHighlight]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      setColor(color);
      setSelectedSize(null);

      // Find gallery index for this color
      const idx = gallery_color.findIndex((g) => g.color === color);
      if (idx >= 0) {
        updateHighlight(idx); // safely update gallery highlight without calling handleThumbnailClick

      }
    },
    [gallery_color, updateHighlight]
  );

  useEffect(() => {
    console.log("🎨 Selected Color:", selectedColor);
    console.log("📏 Selected Size:", selectedSize);
    console.log("🧩 Selected Variant:", selectedVariant);
  }, [selectedColor, selectedSize, selectedVariant]);

  return {
    selectedColor,
    selectedSize,
    selectedVariant,
    colors,        // [{ color, available }]
    sizes,         // [{ size, available }]
    setColor,
    setSize,
    inStock,
    variantImages,
    gallery_color, // unified gallery + color
    highlightedIdx,
    handleThumbnailClick,
    handleColorSelect,
    setHighlightedIdx: updateHighlight,
  };
};

