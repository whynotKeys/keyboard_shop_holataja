'use server';

import getCartList from '@/lib/api/carts';
import { revalidateTag } from 'next/cache';
import type { ApiRes, ApiResPromise } from '@/types/api';
import type { CartItemData } from '@/types/cart';

// API 응답 기본 타입 정의
interface ApiBaseResponse {
  ok: number;
  message?: string;
}

// 장바구니 아이템 삭제 응답 타입
interface CartItemDeleteResponse extends ApiBaseResponse {
  deleted?: boolean; // 삭제 성공 여부 (성공시)
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_API_CLIENT_ID ?? '';

/**
 * 장바구니 아이템 삭제 API 함수
 * 장바구니에서 특정 상품을 완전히 제거합니다.
 *
 * @param token - JWT 인증 토큰
 * @param cartItemId - 삭제할 장바구니 아이템의 고유 ID
 * @returns API 응답 결과
 *
 * API 명세서 참고: DELETE /carts/{_id}
 * - 경로 매개변수: _id (장바구니 아이템 ID)
 * - 응답: 삭제 성공/실패 정보
 */
export async function removeCartItem(token: string, cartItemId: number): ApiResPromise<CartItemDeleteResponse> {
  let resData: ApiRes<CartItemDeleteResponse>;

  try {
    // 토큰 유효성 검사
    if (!token) {
      return { ok: 0, message: '인증 토큰이 필요합니다' };
    }

    // DELETE 요청으로 아이템 삭제
    const response = await fetch(`${API_URL}/carts/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });

    resData = await response.json();

    // HTTP 상태 코드 확인
    if (!resData.ok) {
      return {
        ok: 0,
        message: resData.message || `상품 삭제에 실패했습니다. (${response.status})`,
      };
    }
  } catch (error) {
    // 네트워크 오류 등 예외 처리
    console.error('장바구니 아이템 삭제 오류:', error);
    return { ok: 0, message: '상품 삭제에 실패했습니다.' };
  }
  if (resData.ok) {
    revalidateTag('cart-list');
  }
  return resData;
}

/**
 * 장바구니 전체 비우기 API 함수 (선택적 구현)
 * 사용자의 장바구니에 담긴 모든 상품을 삭제합니다.
 *
 * @param token - JWT 인증 토큰
 * @returns API 응답 결과
 *
 * 참고: API 명세서에서 해당 엔드포인트 확인 필요
 * 보통 DELETE /carts 또는 POST /carts/clear 등의 형태
 */
export async function clearCart(token: string): Promise<{ ok: 0 | 1; message?: string }> {
  // let resData: ApiRes<{ ok: 0 | 1; message?: string }>;

  try {
    if (!token) {
      return { ok: 0, message: '인증 토큰이 필요합니다' };
    }
    const cartData = await getCartList(token);

    if (cartData.ok === 1 && Array.isArray(cartData.item)) {
      const deletePromises = cartData.item.map((item: CartItemData) => removeCartItem(token, item._id));
      await Promise.all(deletePromises);
      revalidateTag('cart-list');

      // API 호출은 성공했지만 데이터 또는 API 실패 응답
      return { ok: 1, message: '장바구니가 비워졌습니다.' };
    }

    return { ok: 0, message: '장바구니 비우기에 실패했습니다.' };
  } catch (error) {
    // 네트워크 오류, 서버 오류 등의 예외
    console.error('장바구니 비우기 오류:', error);
    return { ok: 0, message: '네트워크 오류로 장바구니 비우기에 실패하였습니다..' };
  }
}

/**
 * 장바구니 아이템 수량 변경
 * @param token
 * @param cartItemId - 수정할 장바구니 고유 ID
 * @param quantity - 변경할 수량
 * @returns - API 응답 결과
 * API 명세: PATCH /carts/{id}
 * - 경로 매개변수: _id(장바구니 아이템 ID)
 * 요청: 브루노 확인 결과 {quantity: number}
 * 응답: 업데이트 된 장바구니 전체 정보
 */

export async function updateCartItemQuantity(token: string, cartItemId: number, quantity: number): ApiResPromise<CartItemData[]> {
  let resData: ApiRes<CartItemData[]>;

  try {
    if (!token) {
      return { ok: 0, message: '인증 토큰이 필요합니다.' };
    }

    if (quantity < 1) {
      return { ok: 0, message: '수량은 1개 이상이어야 합니다.' };
    }

    // PATCH 요청으로 수량 업데이트 =
    const response = await fetch(`${API_URL}/carts/${cartItemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': `application/json`,
        'Client-Id': CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantity: quantity,
      }),
    });
    resData = await response.json();

    // HTTP 상태 코드 확인
    if (!resData.ok) {
      return {
        ok: 0,
        message: resData.message || `수량 변경에 실패했습니다. (${response.status})`,
      };
    }
    revalidateTag('cart-list');

    return resData;
  } catch (error) {
    console.error('장바구니 수량 변경 오류: ', error);
    return { ok: 0, message: '수량 변경에 실패했습니다.' };
  }
}
