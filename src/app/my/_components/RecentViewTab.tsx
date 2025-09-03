'use client';

import { Star } from 'lucide-react';

import { SubTitle } from '@/components/ui/Typography';
import { getRecent } from '@/lib/utils/recentView';

import BookmarkCard from './BookmarkCard';

export default function RecentViewTab() {
  const recentViewedList = getRecent();
  return (
    <>
      <div className="flex items-baseline gap-2">
        <SubTitle className="label-l">최근 본 상품 목록</SubTitle>
        <span className="text-secondary label-s sm:label-m"> ※ 최대 5개까지 표시됩니다. </span>
      </div>

      <div className="justify-center items-center min-h-[40vh]">
        {!recentViewedList.length ? (
          <div className="flex flex-col items-center py-8 text-darkgray">
            <Star className="mb-4" size={32} />
            <p>최근 본 상품이 없습니다.</p>
          </div>
        ) : (
          recentViewedList.map((item, index) => (
            <BookmarkCard
              key={index}
              id={item.id}
              src={item.src ? item.src : '/product_images/holataja_circle.webp'}
              name={item.name}
              price={item.price}
              bookmarkId={item.bookmarkId}
              summary={item.summary}
            />
          ))
        )}
      </div>
    </>
  );
}
