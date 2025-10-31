import React from "react";
import { Heart } from "lucide-react"; // Only Heart exists

interface FavoriteSelectorProps {
  isFavorited: boolean;
  toggleFavorite: () => void;
  size?: number;
}

export const FavoriteSelector: React.FC<FavoriteSelectorProps> = ({
  isFavorited,
  toggleFavorite,
  size = 24,
}) => {
  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-pressed={isFavorited}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={`favorite-btn ${isFavorited ? "favorited" : "not-favorited"}`}
    >
      <Heart
        size={size}
        fill={isFavorited ? "#dc2626" : "none"} // Red fill when favorited
        stroke={isFavorited ? "#dc2626" : "#4b5563"} // Gray stroke when not
      />
    </button>
  );
};
