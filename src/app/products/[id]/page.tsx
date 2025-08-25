import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { KeyRound } from 'lucide-react';

import { ContentsTitle, SubTitle, Title } from '@/components/ui/Typography';
import Tab, { TabItem } from '@/components/ui/Tab';
import QnA from '@/features/qna/components/QnA';
import ProductImg from '@/features/product/components/ProductImg';

import { getOrderList } from '@/lib/api/order';
import getProduct from '@/lib/api/product';
import getReview from '@/lib/api/review';
import { getQuestion } from '@/lib/api/qna';
import { postQuestion } from '@/lib/actions/qna';
import { postReview } from '@/lib/actions/review';
import type { QuestionItem } from '@/types/qna';

import ProductPostForm from './_components/ProductPostForm';
import PostForm from './_components/PostForm';
import KeySoundDemo from './_components/KeySoundDemo';
import Review from './_components/Review';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductInfo({ params, searchParams }: PageProps) {
  const { id } = await params;
  const tapParams = await searchParams;

  const activeTabId = Array.isArray(tapParams?.tap) ? tapParams.tap[0] : tapParams?.tap || '1';

  // 상품 상세 조회
  const productData = await getProduct(Number(id));

  // 존재하지 않는 상품이면 404 처리
  if (productData.ok === 0) {
    return notFound();
  }

  // 상품 문의 목록 조회
  const questionData = await getQuestion();

  // 상품 id와 일치하는 문의 목록
  const questionList = questionData.ok === 1 ? questionData.item.filter((question: QuestionItem) => question.product_id === Number(id)) : [];

  // 상품 구매 후기 목록 조회
  const reviewData = await getReview(Number(id));

  // 사용자의 구매 내역 가져오기
  const orderList = await getOrderList();

  // 해당 상품이 포함된 구매 내역 id 가져오기
  const orderId = orderList.ok ? orderList.item.find(order => order.products.some(product => product._id === Number(id)))?._id : 0;

  const tabItems: TabItem[] = [
    {
      id: '1',
      title: '제품 상세 정보',
      content: (
        <div className="flex flex-col gap-6 sm:gap-12">
          <div>
            <ContentsTitle className="mb-4">제품 소개</ContentsTitle>
            <p>{productData.ok === 1 && productData.item?.extra.description}</p>
          </div>
          <div>
            <ContentsTitle className="mb-4">기능</ContentsTitle>
            <ul className="grid gap-2 sm:grid-cols-3 text-[14px]">
              {productData.ok &&
                productData.item.extra['function-tag'].map((tag, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-4 font-medium bg-white border rounded-lg h-14 border-lightgray">
                    <KeyRound />
                    <p>{tag}</p>
                  </li>
                ))}
            </ul>
          </div>
          <div className="hidden px-5 py-3 rounded-lg bg-lightgray sm:block">
            {productData.ok === 1 && (
              <KeySoundDemo
                soundFilePath={productData.item?.extra?.soundfile ? productData.item?.extra?.soundfile : '/sounds/keyboardSound_sample.m4a'}
              />
            )}
          </div>
          {productData.ok === 1 &&
            (productData.item?.mainImages.filter(img => img.type === 'info').map(img => img.path) ?? []).map((img, idx) => (
              <div key={idx} className="relative w-full">
                <Image src={img} alt="" width={0} height={0} priority sizes="100%" className="object-scale-down w-full h-auto" />
              </div>
            ))}
        </div>
      ),
    },
    {
      id: '2',
      title: '구매 후기',
      content: (
        <div className="flex flex-col gap-6 sm:gap-12">
          <Review reviewList={reviewData.ok ? reviewData.item : []} />
          <PostForm productId={Number(id)} orderId={orderId} action={postReview} type="구매 후기" />
        </div>
      ),
    },
    {
      id: '3',
      title: 'Q&A',
      content: (
        <div className="flex flex-col gap-6 sm:gap-12">
          <QnA qnaList={questionList} />
          <PostForm productId={Number(id)} action={postQuestion} type="Q&A" />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-12">
      <Title>상품 상세</Title>
      <div className="grid sm:grid-cols-2 gap-9">
        <ProductImg
          title={productData.ok === 1 ? productData.item?.name : ''}
          srcList={productData.ok === 1 ? productData.item?.mainImages.filter(img => img.type === 'detail').map(img => img.path) : []}
          productId={productData.ok === 1 ? productData.item._id : 0}
          bookmarkId={productData.ok === 1 ? productData.item.myBookmarkId : 0}
          swipe
        ></ProductImg>
        <div className="flex flex-col self-center gap-4">
          <div>
            <SubTitle className="mb-2">{productData.ok === 1 ? productData.item?.name : ''}</SubTitle>
            <p className="text-secondary">{productData.ok === 1 && productData.item?.content}</p>
          </div>
          <div>
            <span className="text-2xl font-bold">{productData.ok === 1 && productData.item?.price?.toLocaleString()}원</span>
          </div>
          <ProductPostForm productData={productData} />
        </div>
      </div>
      <Tab tabItems={tabItems} defaultActiveTabId={activeTabId} />
    </div>
  );
}
