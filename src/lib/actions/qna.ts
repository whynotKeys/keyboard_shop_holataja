'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import type { ApiRes, ApiResPromise } from '@/types/api';
import type { QuestionItem } from '@/types/qna';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * 입력된 제목과 내용으로 이루어진 질문 게시글을 등록함
 * @param {ApiRes<QuestionItem> | null} state - 이전 상태 (사용 X)
 * @param {FormData} formData - 질문 게시글 정보를 담은 FormData 객체
 * @returns {Promise<ApiRes<QuestionItem>} - 질문 게시글 생성 결과 응답 객체
 */
export async function postQuestion(state: ApiRes<QuestionItem> | null, formData: FormData): ApiResPromise<QuestionItem> {
  let data: ApiRes<QuestionItem>;
  const accessToken = (await cookies()).get('accessToken')?.value;
  // FormData를 일반 Object로 변환: 모든 값이 string이 되므로 상품 id는 Number로 다시 변환
  const body = { ...Object.fromEntries(formData), product_id: Number(formData.get('product_id')) };

  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    data = await response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: 'Q&A 등록에 실패했습니다.' };
  }

  if (data.ok) {
    // 캐시 갱신
    revalidateTag('qna-list');
    revalidateTag('my-qna-list');
  }
  return data;
}

/**
 * Q&A id에 해당하는 Q&A를 삭제함
 * @param {number} _id - Q&A id
 * @returns {Promise<ApiRes<QuestionItem>>} - Q&A id에 해당하는 Q&A 응답 객체
 */
export async function deleteQnA(_id: number): ApiResPromise<QuestionItem> {
  let data: ApiRes<QuestionItem>;
  const accessToken = (await cookies()).get('accessToken')?.value;
  try {
    const response = await fetch(`${API_URL}/posts/${_id}`, {
      method: 'DELETE',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    data = await response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: 'Q&A 삭제에 실패했습니다.' };
  }

  if (data.ok) {
    revalidateTag('qna-list');
    revalidateTag('my-qna-list');
  }
  return data;
}

/**
 * Q&A id에 해당하는 질문 게시글을 입력된 제목과 내용으로 수정함
 * @param {number} _id - 수정할 Q&A id
 * @param {string} title - 수정된 Q&A 제목
 * @param {string} content: 수정된 Q&A 내용
 * @returns {Promise<ApiRes<QuestionItem>>}
 */
export async function patchQnA(_id: number, title: string, content: string): ApiResPromise<QuestionItem> {
  let data: ApiRes<QuestionItem>;
  const accessToken = (await cookies()).get('accessToken')?.value;
  const body = { _id, title, content };

  try {
    const response = await fetch(`${API_URL}/posts/${_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Client-Id': CLIENT_ID, Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    });
    data = await response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: 'Q&A 수정에 실패했습니다.' };
  }

  if (data.ok) {
    revalidateTag('qna-list');
    revalidateTag('my-qna-list');
  }
  return data;
}
