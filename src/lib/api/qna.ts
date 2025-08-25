'use server';

import { cookies } from 'next/headers';

import type { ApiResPromise } from '@/types/api';
import type { AnswerItem, QuestionItem } from '@/types/qna';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * 전체 Q&A 목록을 가져옴
 * @returns {Promise<ApiRes<QuestionItem[]>>} - Q&A 목록 응답 객체
 */
export async function getQuestion(): ApiResPromise<QuestionItem[]> {
  try {
    const response = await fetch(`${API_URL}/posts?type=qna&sort={"createdAt": -1}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
      },
      next: { tags: ['qna-list'] },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '질문 목록 조회에 실패했습니다.' };
  }
}

/**
 * Q&A 게시글 id에 해당하는 답변 목록을 가져옴
 * @param {number} _id - Q&A 게시글 id
 * @returns {Promise<ApiRes<AnswerItem[]>>} - 답변 목록 응답 객체
 */
export async function getAnswer(_id: number): ApiResPromise<AnswerItem[]> {
  try {
    const response = await fetch(`${API_URL}/posts/${_id}/replies`, {
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json',
      },
      next: { tags: [`answer-list-${_id}`] },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '답변 조회에 실패했습니다.' };
  }
}
/**
 * 유저가 작성한 Q&A 질문 게시글을 모두 가져옴
 * @returns {Promise<ApiRes<QuestionItem[]>>} - 질문 목록 응답 객체
 */
export async function getMyQnA(): ApiResPromise<QuestionItem[]> {
  const accessToken = (await cookies()).get('accessToken')?.value;
  try {
    const response = await fetch(`${API_URL}/posts/users?type=qna&sort={"createdAt": -1}`, {
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`, // 인증 토큰
      },
      next: { tags: ['my-qna-list'] },
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return { ok: 0, message: '내 질문 조회에 실패했습니다.' };
  }
}
