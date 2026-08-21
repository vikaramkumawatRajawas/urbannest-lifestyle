import React from "react";
import { Star } from "lucide-react";

export const StarRating = ({ rating = 5, reviewsCount }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars || (i === fullStars && hasHalfStar)
                ? "fill-amber-400 text-amber-400"
                : "text-stone-300 dark:text-stone-600"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 ml-1">
        {rating.toFixed(1)}
      </span>
      {reviewsCount !== undefined && (
        <span className="text-xs text-stone-400 dark:text-stone-500">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};
