// src/app/product/[slug]/page.tsx

import { getProductBySlug } from "@/lib/api/products";
import { notFound } from "next/navigation";
import ProductDetail from "@/features/product/ProductDetail"; // adjust if different

type PageProps = {
  params: {
    slug: string;
  };
};


export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;  // await here

  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) return notFound();

  return (
    <main className="p-6">
      <ProductDetail product={product} />
    </main>
  );
}
