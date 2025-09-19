"use client";

import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
  size?: number;
}

export function StarRating({ rating, totalStars = 5, className, size = 4 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - halfStar;

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={cn(`h-${size} w-${size} text-yellow-400 fill-yellow-400`)} />
      ))}
      {halfStar === 1 && (
        <StarHalf className={cn(`h-${size} w-${size} text-yellow-400 fill-yellow-400`)} />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={cn(`h-${size} w-${size} text-muted-foreground/50 fill-muted-foreground/20`)} />
      ))}
    </div>
  );
}
