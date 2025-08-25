'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import type { ApiRes, ApiResPromise } from '@/types/api';
import type { ProductInfo } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * 상품 id, 옵션, 수량을 받아 상품을 장바구니에 추가함
 * @param {ApiRes<ProductInfo[]> | null} state - 이전 정보 (사용 X)
 * @param {FormData} formData - 상품 구매 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<ProductInfo[]>>} - 장바구니 추가 결과 생성 객체
 */
export async function addToCart(state: ApiRes<ProductInfo[]> | null, formData: FormData): ApiResPromise<ProductInfo[]> {
  let data: ApiRes<ProductInfo[]>;
  const body = { ...Object.fromEntries(formData), product_id: Number(formData.get('product_id')), quantity: Number(formData.get('quantity')) };
  const accessToken = (await cookies()).get('accessToken')?.value;
  try {
    const response = await fetch(`${API_URL}/carts`, {
      method: 'POST',
      headers: { 'Client-Id': CLIENT_ID, 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    });
    data = await response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '장바구니 추가에 실패했습니다.' };
  }

  if (data.ok) {
    revalidateTag('cart-list');
  }
  return data;
}
