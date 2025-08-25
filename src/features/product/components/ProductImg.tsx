'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

import Modal from '@/components/ui/Modal';
import useAuthStore from '@/features/auth/store';
import { deleteBookmark, postBookmark } from '@/lib/actions/bookmark';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductImgProps {
  title: string;
  // 하나의 이미지라도 배열 형태로 전달받음
  srcList: string[];
  swipe?: boolean;
  productId?: number;
  bookmarkId: number; // 찜하지 않은 데이터는 0으로 들어옴
}

function ProductImg({ title, srcList, swipe, productId, bookmarkId: initialBookmarkId }: ProductImgProps) {
  const { user, hasHydrated } = useAuthStore(); // 유저 값 불러오기

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 정보
  const router = useRouter();

  // 처음 들어온 bookmarkId props를 initialBookmarkId로 지정, 버튼 눌리면 전환
  const [liked, setLiked] = useState(!!initialBookmarkId); // boolean값
  const buttonBg = liked ? 'bg-[#FFCC00]' : 'bg-darkgray';

  const [bookmarkId, setBookmarkId] = useState<number>(initialBookmarkId);
  const [isLoading, setLoading] = useState(false); // 중복 클릭 방지

  // 북마크 상태 변경 시에 rerender
  useEffect(() => {
    setLiked(!!initialBookmarkId);
    setBookmarkId(initialBookmarkId);
  }, [initialBookmarkId]);

  const handleBookmarkClick = async () => {
    if (isLoading || !productId) return;

    // 로그인 여부 확인
    if (!hasHydrated || user === null) {
      setIsModalOpen(true); // 모달 띄움
      return;
    }

    setLoading(true);
    try {
      if (liked) {
        // 북마크 삭제
        if (!bookmarkId) {
          console.error('bookmarkId가 없습니다.');
          setLoading(false);
          return;
        }
        const res = await deleteBookmark(bookmarkId, productId);
        if (res.ok) {
          setLiked(false);
          setBookmarkId(0);
        } else {
          console.error(res.message);
        }
      } else {
        // 북마크 추가
        const res = await postBookmark(productId);
        if (res.ok && res.item) {
          setLiked(true);
          setBookmarkId(res.item._id);
        } else {
          if (!res.ok) console.error(res.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {swipe ? (
        // 제품 상세에 들어갈 슬라이드형 이미지
        <div className="relative aspect-square" style={{ maxWidth: 'calc(100vw - 2rem - 15px)' }}>
          <button
            className={`${buttonBg} z-10 rounded-full w-[24px] aspect-square text-white flex justify-center items-center absolute bottom-4 right-4 cursor-pointer`}
            onClick={handleBookmarkClick}
            type="button"
            aria-label="찜하기"
          >
            <Star fill="#fff" size={16} />
          </button>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
            pagination={{ clickable: true }}
            className="relative"
          >
            {srcList.map((src, idx) => (
              <SwiperSlide key={idx}>
                <div className="relative w-full overflow-hidden rounded-lg aspect-square max-w-screen">
                  <Image src={src} alt={title} fill className="object-cover" sizes="(max-width: 640px) 100vw - 2rem - 15px, 100vw" priority />
                </div>
              </SwiperSlide>
            ))}
            <button className="rounded-full swiper-button-prev bg-white/80" type="button" aria-label="이전 슬라이드">
              <ChevronLeft size={32} color="var(--color-darkgray)" />
            </button>
            <button className="rounded-full swiper-button-next bg-white/80" type="button" aria-label="다음 슬라이드">
              <ChevronRight size={32} color="var(--color-darkgray)" />
            </button>
          </Swiper>
        </div>
      ) : (
        // 제품 목록에 들어갈 고정형 이미지
        <div className="relative w-full h-full overflow-hidden rounded-lg aspect-square">
          <Link href={`./products/${productId}`} className="relative block w-full h-full">
            <Image
              src={srcList[0]}
              alt={title + '이미지'}
              fill
              className="object-cover transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-2"
              sizes="(min-width: 768px) 100vw, 100vw"
            />
          </Link>
          <button
            className={`${buttonBg} rounded-full w-[24px] aspect-square text-white flex justify-center items-center absolute bottom-2.5 right-2.5 cursor-pointer`}
            onClick={handleBookmarkClick}
            type="button"
            aria-label="찜하기"
          >
            <Star fill="#fff" size={16} />
          </button>
        </div>
      )}

      {/* 로그인 요청 모달 */}
      <Modal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleConfirm={() => {
          setIsModalOpen(false);
          router.push('/auth/login');
        }}
        description={`로그인 사용자에게만 제공되는 기능입니다.\n로그인 화면으로 이동할까요?`}
        isChoiceModal={true}
        choiceOptions={['그냥 보기', '로그인 하러 가기']}
      ></Modal>
    </>
  );
}

export default ProductImg;
