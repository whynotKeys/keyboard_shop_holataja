'use server';

import type { ApiRes, ApiResPromise } from '@/types/api';
import type { ReviewItem } from '@/types/review';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * 입력된 별점과 내용으로 이루어진 구매 후기를 등록함
 * @param {ApiRes<ReviewItem> | null} state - 이전 상태 (사용 X)
 * @param {FormData} formData - 구매 후기 정보를 담은 formData 객체
 * @returns {Promise<ApiRes<ReviewItem>>} - 구매 후기 생성 결과 응답 객체
 * */
export async function postReview(state: ApiRes<ReviewItem> | null, formData: FormData): ApiResPromise<ReviewItem> {
  let data: ApiRes<ReviewItem>;
  const accessToken = (await cookies()).get('accessToken')?.value;
  // FormData를 일반 Object로 변환: string -> number 변환
  const body = {
    ...Object.fromEntries(formData),
    product_id: Number(formData.get('product_id')),
    order_id: Number(formData.get('order_id')),
    rating: Number(formData.get('rating')),
  };

  try {
    const response = await fetch(`${API_URL}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Client-Id': CLIENT_ID, Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    });
    data = await response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '구매 후기 등록에 실패했습니다.' };
  }

  if (data.ok) {
    revalidateTag(`review-list`);
    revalidateTag(`my-review-list`);
  }
  return data;
}

/**
 * 구매 후기 id에 해당하는 구매 후기를 삭제함
 * @param {number} _id - 삭제할 구매 후기 id
 * @returns {Promise<ApiRes<ReviewItem>>} - 구매 후기 id에 해당하는 구매 후기 응답 객체
 */
export async function deleteReview(_id: number): ApiResPromise<ReviewItem> {
  let data: ApiRes<ReviewItem>;
  const accessToken = (await cookies()).get('accessToken')?.value;

  try {
    const response = await fetch(`${API_URL}/replies/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    data = await response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '구매 후기 삭제에 실패했습니다.' };
  }

  if (data.ok) {
    revalidateTag('review-list');
    revalidateTag(`my-review-list`);
  }
  return data;
}

/**
 * 구매 후기 id에 해당하는 구매 후기를 입력된 별점과 내용으로 수정함
 * @param {number} _id - 수정할 구매 후기 id
 * @param {number} rating - 수정된 구매 후기 별점
 * @param {string} content - 수정된 구매 후기 내용
 * @returns {Promise<ApiRes<ReviewItem>} -수정된 구매 후기 생성 결과 응답 객체
 */
export async function patchReview(_id: number, rating: number, content: string): ApiResPromise<ReviewItem> {
  let data: ApiRes<ReviewItem>;
  const accessToken = (await cookies()).get('accessToken')?.value;
  const body = { _id, rating, content };

  try {
    const response = await fetch(`${API_URL}/replies/${_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    data = await response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '구매 후기 수정에 실패했습니다.' };
  }

  if (data.ok) {
    revalidateTag('review-list');
    revalidateTag(`my-review-list`);
  }
  return data;
}
