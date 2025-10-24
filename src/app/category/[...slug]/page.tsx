// src/app/category/[...slug]/page.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSafeImageUrl } from "@/lib/utils/utils";
import { Category } from "@/types/category";

type Props = {
  params: { slug?: string[] };
  searchParams?: { page?: string };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";

// ✅ Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const slugArray = slug || [];
  const currentSlug = slugArray[slugArray.length - 1] || "Categories";

  return {
    title: `${currentSlug} | Selsa Store`,
    description: `Browse ${currentSlug} products and related categories at Selsa Store.`,
  };
}

export default async function CategoryPage(props: Props) {
  const { slug = [] } = await props.params;
  const searchParams = await props.searchParams;
  const slugArray = slug;
  const fullSlugPath = slugArray.join("/");
  const currentPage = Number(searchParams?.page || 1);
  const limit = 60;

  try {
    // 1️⃣ Fetch the category itself
    const categoryRes = await fetch(`${API_BASE_URL}/categories/${fullSlugPath}/`, {
      next: { revalidate: 60 },
    });

    if (!categoryRes.ok) {
      const errorData = await categoryRes.json().catch(() => ({}));
      if (errorData.detail === "Category not found.") {
        redirect(`/shop?category=${encodeURIComponent(fullSlugPath)}`);
        // redirect(`/shop`);
      }
      throw new Error(`Failed to fetch category: ${categoryRes.statusText}`);
    }

    const category: Category & { children?: Category[] } = await categoryRes.json();

    // 2️⃣ If category has subcategories → show them
    if (category.children && category.children.length > 0) {
      return (
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl font-bold mb-6 justify-center">{category.name}</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 product-container">
            {category.children.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${[...slugArray, sub.slug].join("/")}`}
                className="border rounded-xl p-4 hover:shadow-md transition hovercontainer"
              >
                <div className="relative w-full aspect-square mb-2 arrowButton">
                  {sub.image ? (
                    <Image
                      src={sub.image}
                      alt={sub.name}
                      width={250}
                      height={250}
                      className="object-cover w-full h-64 rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <p className="text-center mt-3 font-semibold">{sub.name}</p>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    // 3️⃣ Leaf category → fetch paginated products for this category
    const lastSlug = slugArray[slugArray.length - 1];
    const productsUrl = `${API_BASE_URL}/printful/products/by-category/${lastSlug}/?limit=${limit}&offset=${(currentPage - 1) * limit}`;

    // const productsUrl = `${API_BASE_URL}/products/?category_slug=${fullSlugPath}&limit=${limit}&offset=${
    //   (currentPage - 1) * limit
    // }`;

    const productsRes = await fetch(productsUrl, { next: { revalidate: 60 } });

    if (!productsRes.ok) {
      throw new Error(`Failed to fetch products: ${productsRes.statusText}`);
    }

    const { results: products = [], count = 0 } = await productsRes.json();

    // ✅ Improved redirect logic: only redirect if truly a leaf (and its subcategories have no products)
    const hasChildren = category.children && category.children.length > 0;
    let hasProductsOrNonLeafChild = products.length > 0;

    if (hasChildren) {
      for (const child of category.children) {
        if (
          (child.children && child.children.length > 0) ||
          (child.product_count && child.product_count > 0)
        ) {
          hasProductsOrNonLeafChild = true;
          break;
        }
      }
    }

    if (!hasProductsOrNonLeafChild) {
      redirect(`/shop?category=${encodeURIComponent(fullSlugPath)}`);
      // redirect(`/shop`);
    }

    const totalPages = Math.ceil(count / limit);

    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ✅ Breadcrumb Navigation */}
        <nav className="text-sm text-gray-500 mb-4 text-left">
          <Link href="/" className="hover:text-gray-800">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/shop" className="hover:text-gray-800">
            Store
          </Link>
          {slugArray.map((s, i) => {
            const path = `/category/${slugArray.slice(0, i + 1).join("/")}`;
            return (
              <span key={i}>
                {" "}
                /{" "}
                <Link
                  href={path}
                  className={`hover:text-gray-800 ${
                    i === slugArray.length - 1 ? "font-semibold text-gray-800" : ""
                  }`}
                >
                  {decodeURIComponent(s)}
                </Link>
              </span>
            );
          })}
        </nav>

        <h1 className="text-3xl font-bold mb-6">{category.name}</h1>

        {/* ✅ Products grid */}
        {products.length === 0 ? (
          <p className="text-gray-500 text-center">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.printful_id}
                href={`/shop/${product.printful_id}`}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="relative w-full aspect-square mb-2">
                  <Image
                    src={getSafeImageUrl(product)}
                    alt={product.name}
                    width={250}
                    height={250}
                    className="object-cover w-full h-64 rounded-xl"
                  />
                </div>
                <div className="text-center">
                  <p className="mt-3 font-semibold">{product.name}</p>
                  <p className="text-gray-700">
                    ${product.variants?.[0]?.price?.toFixed(2) || "N/A"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i + 1}
                href={`/category/${fullSlugPath}?page=${i + 1}`}
                className={`px-4 py-2 border rounded ${
                  currentPage === i + 1
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Category fetch error:", error);
    redirect(`/shop?category=${encodeURIComponent(fullSlugPath)}`);
    // redirect(`/shop`);
  }
}
