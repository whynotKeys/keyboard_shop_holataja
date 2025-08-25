import type { ApiResPromise } from '@/types/api';
import type { BookmarkItemData } from '@/types/bookmark';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * 전체 북마크 목록을 가져옴
 * @returns {Promise<ApiRes<BookmarkData[]>>} - 북마크 목록 응답 객체
 */
export async function getBookmarkList(): ApiResPromise<BookmarkItemData[]> {
  const accessToken = (await cookies()).get('accessToken')?.value;
  try {
    const response = await fetch(`${API_URL}/bookmarks/product`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`, // 인증 토큰
        'Content-Type': 'application/json',
      },
      next: { tags: ['bookmark-list'] },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '북마크 목록 조회에 실패했습니다.' };
  }
}

/**
 * 지정 제품에 대한 북마크 정보를 가져옴
 * @returns {Promise<ApiRes<BookmarkData[]>>} - 북마크 1건 정보 응답 객체
 */
export async function getBookmarkInfo(product_id: number): ApiResPromise<BookmarkItemData[]> {
  const accessToken = (await cookies()).get('accessToken')?.value;
  try {
    const response = await fetch(`${API_URL}/bookmarks/product/${product_id}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`, // 인증 토큰
        'Content-Type': 'application/json',
      },
      next: { tags: ['bookmark-list'] },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '북마크 정보가 없습니다.' };
  }
}
