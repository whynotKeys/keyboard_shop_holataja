import type { ApiResPromise } from '@/types/api';
import type { CartItemData } from '@/types/cart';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * 장바구니 목록 조회 API 함수
 * 서버에서 사용자의 장바구니에 담긴 모든 상품들을 가져옵니다.
 *
 * @param token - JWT 인증 토큰 (Authorization 헤더에 Bearer 토큰으로 전송)
 * @returns 장바구니 데이터 (상품 목록, 총 비용 정보 포함)
 *
 * API 명세서 참고: GET /carts
 * - 헤더: Client-Id, Authorization
 * - 응답: { ok: number, item: CartItemData[], cost: CartTotalCost }
 */
export default async function getCartList(token: string): ApiResPromise<CartItemData[]> {
  try {
    // 토큰 유효성 검사
    if (!token) {
      return { ok: 0, message: '인증 토큰이 필요합니다' };
    }

    const response = await fetch(`${API_URL}/carts`, {
      method: 'GET',
      headers: {
        'Client-Id': CLIENT_ID, // API 클라이언트 식별자
        Authorization: `Bearer ${token}`, // JWT 토큰 인증
      },
      next: { tags: ['cart-list'] },
    });

    const result = await response.json();
    // API 응답이 실패인 경우 그대로 반환
    if (result.ok !== 1) {
      return { ok: 0, message: result.message || '장바구니 조회 실패' };
    }

    return {
      ok: 1,
      item: result.item,
      cost: result.cost,
    };
  } catch (error) {
    // 네트워크 오류, 서버 오류 등의 예외 처리
    console.error('장바구니 목록 조회 오류:', error);
    return { ok: 0, message: '장바구니 목록 조회에 실패 했습니다.' };
  }
}
