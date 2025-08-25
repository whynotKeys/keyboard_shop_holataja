import { cookies } from 'next/headers';

import type { ApiResPromise } from '@/types/api';
import type { ReviewItem } from '@/types/review';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * 상품 id에 해당하는 구매 후기 목록을 가져옴
 * @param {number} productId - 상품 id를 가져옴
 * @returns {Promise<ApiRes<ReviewItem[]>>} - 상품 id에 해당하는 구매 후기 목록 응답 객체
 */
export default async function getReview(productId: number): ApiResPromise<ReviewItem[]> {
  try {
    const response = await fetch(`${API_URL}/replies/products/${productId}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
      next: { tags: [`review-list`] },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '상품 구매 후기 목록 조회에 실패했습니다.' };
  }
}

/**
 * 사용자가 작성한 구매 후기 목록을 가져옴
 * @returns {Promise<ApiRes<ReviewItem[]>>} - 상품 id에 해당하는 구매 후기 목록 응답 객체
 */
export async function getMyReview(): ApiResPromise<ReviewItem[]> {
  const accessToken = (await cookies()).get('accessToken')?.value;

  try {
    const response = await fetch(`${API_URL}/replies/`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`, // 인증 토큰
      },
      cache: 'force-cache',
      next: { tags: ['my-review-list'] },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '내 구매 후기 목록 조회에 실패했습니다.' };
  }
}
