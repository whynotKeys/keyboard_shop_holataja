import { cookies } from 'next/headers';

import type { ApiResPromise } from '@/types/api';
import type { OrderItem } from '@/types/order';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * 유저가 주문했던 구매 목록을 모두 가져옴
 * @returns {Promise<ApiResPromise<OrderItem[]>>} - 구매 목록 응답 객체
 */
export async function getOrderList(): ApiResPromise<OrderItem[]> {
  const accessToken = (await cookies()).get('accessToken')?.value;
  try {
    const response = await fetch(`${API_URL}/orders/?sort={"createdAt": -1}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // 인증 토큰
      },
      next: { tags: ['my-order-list'] },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '내 구매 목록 조회에 실패했습니다.' };
  }
}

/**
 * 유저가 구매한 주문 1건의 정보를 가져옴
 * @param {number} _id - 구매 id
 * @returns {Promise<ApiResPromise<OrderItem[]>>} - 구매 상세 정보 응답 객체
 */
export async function getOrderInfo(_id: number): ApiResPromise<OrderItem> {
  const accessToken = (await cookies()).get('accessToken')?.value;
  try {
    const response = await fetch(`${API_URL}/orders/${_id}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // 인증 토큰
      },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '구매 내역 상세 조회에 실패했습니다.' };
  }
}
