'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getRecent, RecentViewProps } from '@/lib/utils/recentView';

export default function RecentViewFloat() {
  const [recentViewList, setRecentViewList] = useState<RecentViewProps[] | null>(null);

  useEffect(() => {
    setRecentViewList(getRecent());
  }, []);

  return (
    <>
      <div className="fixed z-50 hidden w-24 p-2 bg-gray-100 border border-gray right-4 top-1/3 xl:block">
        <div className="mb-2 text-sm font-semibold text-center">최근 본 상품</div>

        <section className="flex flex-col gap-3">
          {recentViewList?.map((product, index) => (
            <div key={index} className="relative overflow-hidden border aspect-square border-gray">
              <Link href={`/products/${product.id}`} className="relative block w-full h-full">
                <Image
                  src={product.src}
                  alt={product.name + '페이지 바로가기'}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out hover:brightness-90"
                  sizes="(min-width: 100px) 100vw, 100vw"
                />
              </Link>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
//  -translate-y-1/2 z-50 w-80
