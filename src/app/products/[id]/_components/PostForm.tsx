'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import { Contents } from '@/components/ui/Typography';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import useAuthStore from '@/features/auth/store';
import type { ApiRes, ApiResPromise } from '@/types/api';

import Rating from './Rating';

interface PostFormProps<itemState> {
  productId: number;
  orderId?: number;
  action: (state: ApiRes<itemState> | null, formData: FormData) => ApiResPromise<itemState>;
  type: 'Q&A' | '구매 후기';
}

export default function PostForm<itemState>({ productId, orderId, action, type }: PostFormProps<itemState>) {
  const [state, formAction /* isPending*/] = useActionState(action, null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  // 별점 등록 상태
  const [rating, setRating] = useState<number>(0);

  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (state?.ok) {
      // 목록 화면 갱신
      router.refresh();
      // 별점 초기화
      setRating(0);
    }

    if (state?.ok === 1 || (state?.ok === 0 && !state.errors)) {
      // 등록 성공/실패(서버 오류) 시 모달 표시
      setIsModalOpen(true);
    }
  }, [state, router]); // state가 변경될 때마다 모달 상태 변경

  return (
    <div>
      <Contents size="large" className="mb-4">
        {`${type} 등록하기`}
      </Contents>
      <form
        className="flex flex-col gap-4"
        action={formData => {
          if (!user) {
            setLoginModal(true);
            return;
          }
          if (!orderId && type === '구매 후기') {
            setOrderModal(true);
            return;
          }
          formAction(formData);
        }}
      >
        {type === '구매 후기' && <input type="hidden" name="order_id" defaultValue={orderId} />}
        {type === 'Q&A' && <input type="hidden" name="type" defaultValue="qna" />}
        <input type="hidden" name="product_id" defaultValue={productId ?? ''} />
        {type === 'Q&A' && (
          <div>
            <label htmlFor="title" className="inline-block mb-2">
              제목
            </label>
            <Input id="title" name="title" type="text" className="bg-white" error={!state?.ok && !!state?.errors?.title} />
            {!state?.ok && <p className="mt-1 label-s text-negative">{state?.errors?.title?.msg}</p>}
          </div>
        )}
        {type === '구매 후기' && (
          <div>
            <span className="sr-only">{`별점 ${rating}/5점`}</span>
            <Rating rating={rating} setRating={(rating: number) => setRating(rating)} editable />
            <input type="hidden" name="rating" value={rating ?? 0} />
          </div>
        )}
        <div>
          <label htmlFor="content" className={`mb-2 inline-block ${type === '구매 후기' && 'sr-only'}`}>
            내용
          </label>
          <Textarea id="content" name="content" error={!state?.ok && !!state?.errors?.content} />
          {!state?.ok && <p className="mt-1 label-s text-negative">{state?.errors?.content?.msg}</p>}
        </div>
        <div className="flex justify-end">
          <Button size="small" submit>
            등록
          </Button>
        </div>
      </form>

      {/* 등록 완료/실패 모달 */}
      <Modal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleConfirm={() => setIsModalOpen(false)}
        description={state?.ok ? `${type} 등록이 완료되었습니다.` : `${type} 등록에 실패했습니다.`}
        hideCancelButton
      ></Modal>

      {/* 로그인 필요 모달 */}
      <Modal
        isOpen={loginModal}
        handleClose={() => setLoginModal(false)}
        handleConfirm={() => router.push('/auth/login')}
        description={'로그인이 필요합니다.'}
        isChoiceModal
        choiceOptions={['닫기', '로그인하기']}
      />

      {/* 구매 내역 없음 모달 */}
      <Modal
        isOpen={orderModal}
        handleClose={() => setOrderModal(false)}
        handleConfirm={() => setOrderModal(false)}
        description={'구매하지 않은 상품입니다.'}
        hideCancelButton
      />
    </div>
  );
}
