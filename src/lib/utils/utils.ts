// src/lib/utils.ts
import type { Product } from '@/types/printful_product';
import type { Category } from '@/types/category';

export function getSafeImageUrl(product: Product): string {
  const base = 'http://localhost:8000';

  const images = product.gallery_images || product.images;

  if (!images || images.length === 0) {
    return '/placeholder.jpg';
  }

  const primaryImage = images.find(img => img.is_primary);
  const imagePath = primaryImage?.url || images[0]?.url || primaryImage?.image || images[0]?.image;

  // console.log('Image URL:', imagePath);

  if (!imagePath) {
    return '/placeholder.jpg';
  }

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  return `${base}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

export function getImageAltText(product: Product): string {
  const primaryImage = product.images?.find(img => img.is_primary);
  return primaryImage?.alt_text || product.name;
}

export function getSafeCategoryImageUrl(category: Category): string {
  const imageUrl = category.image;

  if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'))) {
    return imageUrl;
  }

  // fallback image
  return '/placeholder.jpg';
}

export function name_option(option_values: any[]): string {
  console.log("name_option called with:", option_values);

  if (!option_values || option_values.length === 0) {
    console.log("No option values provided");
    return "";
  }

  const valuesOnly = option_values.map((ov) => {
    if (ov?.value) {
      return ov.value;
    }
    console.log("Skipped invalid option value:", ov);
    return null;
  }).filter(Boolean);

  const result = valuesOnly.join(", ");
  console.log("Result string:", result);
  return result;
}

