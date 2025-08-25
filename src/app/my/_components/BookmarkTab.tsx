'use client';

import { useState } from 'react';

import { Star } from 'lucide-react';

import Pagination from '@/components/ui/Pagination';
import { SubTitle } from '@/components/ui/Typography';
import type { BookmarkItemData } from '@/types/bookmark';

import BookmarkCard from './BookmarkCard';

interface BookmarkTabProps {
  bookmarkList: BookmarkItemData[];
}

export default function BookmarkTab({ bookmarkList }: BookmarkTabProps) {
  //Pagination
  const [page, setPage] = useState(1);
  const limit = 4;
  const totalPages = Math.ceil(bookmarkList.length / limit);
  const pagedBookmarkList = bookmarkList.slice((page - 1) * limit, page * limit);

  return (
    <>
      <SubTitle className="label-l">찜 목록</SubTitle>
      <div className="justify-center items-center min-h-[40vh]">
        {!pagedBookmarkList.length ? (
          <div className="flex flex-col items-center py-8 text-darkgray">
            <Star className="mb-4" size={32} />
            <p>찜한 상품이 없습니다.</p>
          </div>
        ) : (
          pagedBookmarkList.map((item, index) => (
            <BookmarkCard
              bookmarkId={item._id}
              key={index}
              id={item.product._id}
              src={item.product.mainImages?.[0]?.path ? `${item.product.mainImages[0].path}` : '/product_images/holataja_circle.webp'}
              name={item.product.name}
              price={item.product.price}
            />
          ))
        )}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
