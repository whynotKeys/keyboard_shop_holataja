'use client';

import React, { useState, Suspense } from 'react';

import { PackageX } from 'lucide-react';

import ProductCard from '@/features/product/components/ProductCard';
import Tab, { TabItem } from '@/components/ui/Tab';
import type { Product } from '@/types/product';

import SearchBar from './SearchBar';
import SortToggle from './SortToggle';
import ProductCardSkeleton from '@/features/product/components/ProductCardSkeleton';

export type sortType = '가나다순' | '최신순' | '가격 낮은순' | '가격 높은순';

export default function ProductList({ productData }: { productData: Product[] }) {
  // 검색어
  const [searchValue, setSearchValue] = useState('');
  // 카테고리
  const [sort, setSort] = useState<sortType>('최신순');

  // Tab category에 맞게 content 생성해주는 함수
  function getTabContent(category: Product['category'] | 'ALL') {
    let filtered = category === 'ALL' ? productData : productData.filter(product => product.category === category);

    // 검색어 입력 시 일치하는 상품 목록 생성해주는 함수
    filtered =
      searchValue.trim() === '' ? filtered : filtered.filter(product => product.name.toLowerCase().includes(searchValue.trim().toLowerCase()));

    // 검색 기준 선택 시 기준에 맞게 상품 목록 생성해주는 함수
    switch (sort) {
      case '가나다순':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case '최신순':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case '가격 낮은순':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case '가격 높은순':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
    }

    return (
      <>
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
        <SortToggle selected={sort} setSelected={setSort} />
        {filtered.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 min-h-[40vh]">
            {filtered.map((product, index) => (
              <Suspense key={index} fallback={<ProductCardSkeleton />}>
                <ProductCard
                  key={index}
                  _id={product._id}
                  imageSrc={product.imgSrc}
                  title={product.name}
                  price={product.price}
                  bookmarkId={product.bookmarkId}
                />
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center mx-auto min-h-[40vh] text-darkgray">
            <PackageX className="mb-4" />
            <p>상품을 찾을 수 없습니다.</p>
          </div>
        )}
      </>
    );
  }

  const tabItems: TabItem[] = [
    { id: 'ALL', title: '전체 보기', content: getTabContent('ALL') },
    { id: 'BLUE', title: '청축(Click Tactile)', content: getTabContent('BLUE') },
    { id: 'BROWN', title: '갈축(Soft Tactile)', content: getTabContent('BROWN') },
    { id: 'RED', title: '적축(Linear)', content: getTabContent('RED') },
    { id: 'OTHER', title: '기타', content: getTabContent('OTHER') },
  ];

  return <Tab tabItems={tabItems} />;
}
