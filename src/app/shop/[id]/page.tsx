// src/app/shop/[id]/page.tsx

import ProductView from "./product-view.tsx";
import { getProduct } from "@/lib/api/api";
import { Product } from "@/types/printful_product";

type Props = {
  params: Promise<{ id: string }>; // 👈 notice params is a Promise
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params; // 👈 await params
  const product: Product = await getProduct(id, 900);

  const title = product?.name ?? "Product";
  const img = product?.mainImage ?? product?.mockups?.[0];

  return {
    title,
    openGraph: {
      images: [img],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params; // 👈 await params
  const product: Product = await getProduct(id);

  return <ProductView product={product} />;
}
