// src/app/product/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { getProducts } from '@/lib/api/products';
import { getSafeImageUrl } from '@/lib/utils/utils';

//  Add SEO Support
export const metadata = {
  title: 'Our Products',
  description: 'Browse the latest products available in our store.',
};

export default async function ProductPage() {
  //const products: Product[] = await getProducts();
  const products = await getProducts();

  return (  
    <div className="p-6 ">
      <>
        <Head>
          <link rel="stylesheet" href="stylesheets/product.css" />
        </Head>
      </>
      <h1 className="text-3xl font-bold mb-6 carousel pagination ">Products</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 
          carousel product-container ">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <Image
                src={getSafeImageUrl(product)}
                alt={product.name}
                width={250}
                height={250}
                className="product object-cover w-full h-64 rounded-xl arrowButton product-item:hover"
              />
              <h3 className="h3 mt-3 font-sm font-semibold text-sm">{product.name}</h3>
              <p className="text-gray-600">€{product.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}