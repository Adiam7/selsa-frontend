// context/FavouritesContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavouritesContextType {
  favourites: string[];
  toggleFavourite: (productId: string) => void;
  isFavourite: (productId: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favourites');
    if (stored) setFavourites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = (productId: string) => {
    setFavourites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isFavourite = (productId: string) => favourites.includes(productId);

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavouritesContext = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavouritesContext must be used within a FavouritesProvider');
  }
  return context;
};
