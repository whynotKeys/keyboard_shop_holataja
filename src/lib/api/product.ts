import { cookies } from 'next/headers';

import type { ApiResPromise } from '@/types/api';
import type { ProductInfo } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * 전체 상품 목록을 가져옴
 * @returns {Promise<ApiRes<ProductInfo[]>>} - 상품 목록 응답 객체
 */
export async function getProductList(): ApiResPromise<ProductInfo[]> {
  const accessToken = (await cookies()).get('accessToken')?.value;

  try {
    const response = await fetch(`${API_URL}/products/`, {
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // 인증 토큰
      },
      cache: 'force-cache',
      next: { tags: ['product-list'] },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '상품 목록 조회에 실패했습니다.' };
  }
}

/**
 * 해당하는 id의 상품 상세 정보를 가져옴
 * @param {number} _id - 상품 id
 * @returns {Promise<ApiRes<ProductInfo>>} - 상품 상세 응답 객체
 */
export default async function getProduct(_id: number): ApiResPromise<ProductInfo> {
  const accessToken = (await cookies()).get('accessToken')?.value;
  try {
    const response = await fetch(`${API_URL}/products/${_id}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // 인증 토큰
      },
      cache: 'force-cache',
      next: { tags: [`product-${_id}`] },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '상품 상세 조회에 실패했습니다.' };
  }
}
