'use server';

import type { ApiRes, ApiResPromise } from '@/types/api';
import type { BookmarkResData } from '@/types/bookmark';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * id에 해당하는 상품을 찜 목록에 추가
 * @param {number} productId - 찜하기에 추가할 상품 id
 * @returns {Promise<ApiRes<BookmarkResData>>} - 찜하기 결과 응답 객체
 * */
export async function postBookmark(productId: number): ApiResPromise<BookmarkResData> {
  let resData: ApiRes<BookmarkResData>;
  const accessToken = (await cookies()).get('accessToken')?.value;
  // FormData를 일반 Object로 변환: string -> number 변환
  const body = {
    target_id: Number(productId),
  };

  try {
    const response = await fetch(`${API_URL}/bookmarks/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    resData = await response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '찜하기 등록에 실패했습니다.' };
  }

  if (resData.ok) {
    revalidateTag(`bookmark-list`);
    revalidateTag(`product-list`);
    revalidateTag(`product-${productId}`);
  }
  return resData;
}

/**
 * 찜하기 데이터 삭제 (찜하기 취소)
 * @param {number} bookmarkId - 북마크 id
 * @returns {Promise<ApiRes>} - Q&A id에 해당하는 Q&A 응답 객체
 */
export async function deleteBookmark(bookmarkId: number, productId: number): ApiResPromise<BookmarkResData> {
  let resData: ApiRes<BookmarkResData>;
  const accessToken = (await cookies()).get('accessToken')?.value;
  try {
    const response = await fetch(`${API_URL}/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    resData = await response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '찜하기 데이터 삭제에 실패했습니다.' };
  }

  if (resData.ok) {
    revalidateTag('bookmark-list');
    revalidateTag(`product-list`);
    revalidateTag(`product-${productId}`);
  }
  return resData;
}
