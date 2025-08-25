'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // 아이콘 import

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  if (totalPages < 1) return null;

  // 클릭 시 실행되는 함수 : 입력값 정수화 + 함수 실행(페이지 전환)
  const handlePageClick = (p: number) => {
    const page = Math.floor(p);
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  // 전체 페이지 구성하는 배열 생성
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4 font-sans">
      {/* prev button */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 cursor-pointer disabled:opacity-30 disabled:cursor-default"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => handlePageClick(p)}
          className={`w-6 h-6 p-0 rounded-full text-text label-s cursor-pointer ${p === currentPage ? 'bg-primary text-white font-semibold pointer-events-none' : 'hover:bg-gray-200 transition'}`}
        >
          {p}
        </button>
      ))}

      {/* next button */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 cursor-pointer disabled:opacity-30 disabled:cursor-default"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
