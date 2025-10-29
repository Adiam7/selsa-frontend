// useVariantSelector.ts
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


  // --- Get all unique image URLs from variants ---
  const all_image_variants = useMemo(() => {
    const urls = new Set<string>(); // use a Set to automatically avoid duplicates
    variants.forEach((v) => {
      if (v.image_url && !urls.has(v.image_url) && !/printfile-preview/i.test(v.image_url)) {
        urls.add(v.image_url);
      }
    });
    return Array.from(urls); // convert Set to Array
  }, [variants]);

  console.log("🖼️ All Unique Variant Images:", all_image_variants);

  // --- Match gallery_color item to all_image_variants with logging ---
  const matchGalleryItemToVariant = useCallback(
    (item: typeof gallery_color[number]) => {
      // Original gallery URL
      console.log("Gallery URL:", item.url);
      console.log("Gallery Color:", item.color);

      // Clean URL from gallery (remove _preview)
      const cleanUrl = item.url.replace("_preview", "");
      console.log("Clean URL for matching:", cleanUrl);

      // Find variant in all_image_variants that matches URL and color
      const matched = all_image_variants.find(
        (v) => {
          const isMatch = v.variant.image_url === cleanUrl && v.color === item.color;
          console.log(
            "Checking variant:",
            v.variant.image_url,
            "Color:",
            v.color,
            "Match?",
            isMatch
          );
          return isMatch;
        }
      );

      if (!matched) {
        console.log("No matching variant found for this gallery item.");
        return null;
      }

      console.log("Matched Variant:", {
        id: matched.variant.id,
        color: matched.color,
        image_url: matched.variant.image_url,
      });

      return {
        id: matched.variant.id,
        color: matched.color,
        image_url: matched.variant.image_url,
      };
    },
    [all_image_variants]
  );

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
    [externalSetHighlightedIdx]
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
      const clickedItem = gallery_color[idx];
      if (!clickedItem) return;

      const clickedVariant = variants.find((v) => v.id === clickedItem.variantId);
      if (!clickedVariant) return;

      setColor(clickedVariant.color ?? null);
      setSize(clickedVariant.size ?? null);
      updateHighlight(idx);
    },
    [gallery_color, variants, setColor, setSize, updateHighlight]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      setColor(color);

      const galleryItem = gallery_color.find((g) => g.color === color);
      if (!galleryItem) return;

      const idx = gallery_color.findIndex((g) => g.variantId === galleryItem.variantId);
      if (idx >= 0) updateHighlight(idx);
    },
    [gallery_color, setColor, updateHighlight]
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
