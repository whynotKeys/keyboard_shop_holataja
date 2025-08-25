import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ChevronRight, X } from 'lucide-react';

import Button from '@/components/ui/Button';

export interface HistoryCardProps {
  id: number;
  status: string;
  src: string;
  name: string;
  price: number;
  quantity: number;
  date: string;
  products_info: { id: number; name: string }[];
}

export default function HistoryCard({ id, status, src, name, price, quantity, date, products_info }: HistoryCardProps) {
  const formatPrice = price.toLocaleString();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 정보

  return (
    <div className="flex flex-col justify-between px-4 py-4 border-b sm:flex-row sm:items-center sm:gap-6 min-w-80 border-lightgray">
      <div className="flex flex-row gap-4">
        {/* Image */}
        <Link href={`/products/${products_info[0].id}`}>
          {' '}
          <section className="grid shrink-0 rounded-xl w-[7rem] h-[7rem] min-w-28 min-h-28 overflow-hidden">
            <Image
              src={src}
              alt={`${name} 이미지`}
              width={112}
              height={112}
              className="object-cover col-start-1 row-start-1 min-w-28 min-h-28 rounded-xl"
            />
            <div className="flex items-end justify-end col-start-1 row-start-1">
              <div className="flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-black opacity-65">{quantity}</div>
            </div>
          </section>
        </Link>

        {/* Order info */}
        <section className="flex flex-col justify-between flex-grow">
          <p className="text-secondary label-s">Order #{id}</p>
          <p className="text-sm">주문일시: {date}</p>

          <div className="grid grid-cols-[1fr_auto] items-end gap-x-2">
            <h4 className="font-bold leading-snug label-sm sm:label-md line-clamp-2">{name}</h4>
            <p className="text-sm text-secondary shrink-0">
              <span className="text-text">포함</span> 총 {quantity}건
            </p>
          </div>
          <p className="mb-1 text-lg font-semibold text-text">총 {formatPrice}원</p>
          <Link href={`/my/${id}`} className="flex flex-row items-center font-bold text-secondary label-s text-underline">
            <p>상세보기</p>
            <ChevronRight className="w-4.5" />
          </Link>
        </section>
      </div>
      {/* Status & Review button(모바일에선 하단 / sm부터는 우측 위치) */}
      <section className="flex flex-col items-center text-center gap-2 shrink-0 sm:mr-2.5 mt-4 sm:mt-0 min-w-28">
        {status === '배송 완료' ? <h5 className="hidden font-bold text-center label-md sm:block ">{status}</h5> : ''}

        {status === '배송 완료' ? (
          <Button
            size="full"
            outlined
            onClick={() => {
              if (products_info.length === 1) {
                router.push(`/products/${products_info[0].id}`);
              } else {
                setIsModalOpen(true);
              }
            }}
          >
            후기 작성
          </Button>
        ) : (
          <Button size="full" outlined disabled>
            {status}
          </Button>
        )}
      </section>
      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative bg-white rounded-lg w-[25rem]">
            <div className="flex flex-row justify-end w-full bg-white rounded-t-lg">
              <Button onClick={() => setIsModalOpen(false)} className="" size="medium" icon>
                <X size={24} />
              </Button>
            </div>
            <div className="px-6">
              <h2 className="mb-1 text-center sub-title">리뷰 쓰기</h2>
              <p className="mb-6 text-center whitespace-pre-line label-m">어떤 상품의 리뷰를 쓰시겠어요?</p>
              <div className="flex justify-center gap-4 pb-5">
                <>
                  <div className="flex flex-col gap-2 font-normal">
                    {products_info.map(product => (
                      <button
                        key={product.id}
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="w-full max-w-[18.75rem] line-clamp-2 px-3 py-1 bg-background text-text text-sm font-medium border-1 border-lightgray rounded hover:border-primary hover:text-primary transition cursor-pointer "
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
