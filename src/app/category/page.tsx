// src/app/category/page.tsx

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { getCategories } from '@/lib/api/categories';
import { getSafeCategoryImageUrl } from '@/lib/utils/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop by Category',
  description: 'Explore products categorized for easy browsing.',
};

export default async function CategoryPage() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Categories</h1>
        <p className="text-gray-600"> No categories available.</p>
      </div>
    );
  }
 
  return (
     <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4 carousel pagination ">
          Categories
        </h1>
        
        {categories.length === 0 ? (
          <p className="text-gray-500"> No Categories found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 product-container ">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="border rounded-xl p-4 hover:shadow-md transition hovercontainer_category product-item:hover"
              >
                <div className="relative w-full aspect-square mb-2 arrowButton  ">
                  <Image
                    src={getSafeCategoryImageUrl(category)}
                    alt={category.name}
                    width={250}
                    height={250}
                    className="object-cover w-full h-64 rounded-xl"
                  />
                </div>
                <h3 className="h3 mt-3 font-medium font-semibold text-sm text-center overlay_category">{category.name}</h3>                
              </Link>
            ))}
          </div>
        )}
      </div>
  );
}
