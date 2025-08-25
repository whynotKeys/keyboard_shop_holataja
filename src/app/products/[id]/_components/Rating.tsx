'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Button from '@/components/ui/Button';

interface RatingProps {
  rating: number;
  setRating: (rating: number) => void;
  editable?: boolean;
}

export default function Rating({ rating, setRating, editable }: RatingProps) {
  // 별점 hover 상태
  const [ratingHovered, setRatingHovered] = useState<number>(0);

  return (
    <div className="flex" role="radiogroup" aria-label="별점">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Button
          key={idx}
          icon
          size="small"
          className={`w-7 group ${!editable && 'pointer-events-none'}`}
          aria-label={`${idx + 1}점`}
          aria-checked={idx + 1 <= rating}
          role="radio"
          // 별점 등록 후 다시 같은 별점 클릭 시 초기화
          onClick={() => {
            if (editable) {
              setRating(rating === idx + 1 ? 0 : idx + 1);
            }
          }}
          onMouseEnter={() => {
            if (editable) {
              setRatingHovered(idx + 1);
            }
          }}
          onMouseLeave={() => {
            if (editable) {
              setRatingHovered(0);
            }
          }}
        >
          <Star size={24} className={idx + 1 <= rating || idx + 1 <= ratingHovered ? 'fill-primary stroke-primary' : 'stroke-gray'} />
        </Button>
      ))}
    </div>
  );
}
