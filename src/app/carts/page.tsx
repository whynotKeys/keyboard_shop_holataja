import { Metadata } from 'next';
import { cookies } from 'next/headers';

import getCartList from '@/lib/api/carts';
import type { CartResponse } from '@/types/cart';

import CartContainer from './_components/CartContainer';

export const metadata: Metadata = {
  title: '장바구니 - HOLATAJA',
  description: '선택한 상품을 확인하고 결제로 이동하세요.',
  robots: 'noindex, nofollow',
};
/**
 * 장바구니 페이지 서버 컴포넌트
 *
 * 주요 역할:
 * - 서버에서 초기 장바구니 데이터 페칭
 * - 쿠키에서 인증 토큰 추출
 * - 클라이언트 컴포넌트(CartContainer)에 데이터 전달
 * - 렌더링만 담당 (비즈니스 로직 없음)
 *
 * 데이터 흐름:
 * 1. 서버에서 쿠키로부터 토큰 추출
 * 2. 토큰이 있으면 장바구니 API 호출
 * 3. 초기 데이터와 토큰을 CartContainer로 전달
 * 4. CartContainer에서 모든 클라이언트 로직 처리
 */
export default async function CartPage() {
  // ==================== 서버 사이드 데이터 페칭 ====================

  /**
   * 쿠키에서 인증 토큰 추출
   * Next.js 서버 컴포넌트에서 쿠키 접근
   */
  const cookieStore = cookies();
  const token = (await cookieStore).get('accessToken')?.value || null;

  /**
   * 초기 장바구니 데이터 가져오기
   * 토큰이 있는 경우에만 API 호출
   */
  let initialCartData = null;
  let serverError = null;

  if (token) {
    const result = await getCartList(token);
    // console.log('서버 장바구니 데이터:', result);

    if (result.ok !== 1) {
      // API 호출은 성공했지만 비즈니스 로직 에러
      serverError = result.message || '장바구니 데이터를 불러올 수 없습니다.';
    }
    if (result.ok === 1) {
      initialCartData = result as CartResponse;
    }
  }

  // ==================== 클라이언트 컴포넌트에 전달 ====================

  /**
   * CartContainer 클라이언트 컴포넌트에 필요한 props 전달
   * - initialData: 서버에서 가져온 초기 장바구니 데이터
   * - token: 인증 토큰 (클라이언트에서 API 호출용)
   * - serverError: 서버에서 발생한 에러 (있는 경우)
   */

  return <CartContainer initialData={initialCartData} token={token} serverError={serverError} />;
}
