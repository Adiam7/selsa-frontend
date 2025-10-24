import { Suspense } from 'react';
import { Metadata } from 'next';
import FavouritesPage from './page';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Your Favourites | Selsa Store',
  description: 'View all your favourite items saved from the Selsa Store.',
};

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Your Favourites</h1>
      
      <Suspense fallback={<LoadingSpinner message="Loading your favourites..." />}>
        <FavouritesPage />
      </Suspense>
    </main>
  );
}
