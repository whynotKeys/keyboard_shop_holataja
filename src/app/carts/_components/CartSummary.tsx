import React from 'react';

import Button from '@/components/ui/Button';
import { Contents } from '@/components/ui/Typography';
import type { CartTotalCost } from '@/types/cart';

interface CartSummaryProps {
  cost?: CartTotalCost;
  onOrderClick: () => void;
  onContinueShoppingClick: () => void;
  itemCount: number;
  isLoading?: boolean;
  isOrderDisabled?: boolean;
}

export default function CartSummary({
  cost,
  onOrderClick,
  onContinueShoppingClick,
  itemCount,
  isLoading = false,
  isOrderDisabled = false,
}: CartSummaryProps) {
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ko-KR')}원`;
  };

  const productsCost = cost?.products || 0;

  return (
    <div>
      <h3 className="sr-only">금액 정보</h3>
      <div className="p-6 space-y-4 bg-white border rounded-lg border-lightgray">
        {/* 상품 금액 */}
        <div className="flex items-center justify-between">
          <Contents className="text-secondary">상품 금액</Contents>
          <Contents className="text-secondary">{formatPrice(productsCost)}</Contents>
        </div>

        {/* 배송비 */}
        <div className="flex items-center justify-between">
          <Contents className="text-secondary">배송비</Contents>
          <Contents className="text-secondary">{formatPrice(cost?.shippingFees || 0)}</Contents>
        </div>

        {/* 총 주문금액 */}
        <div className="flex items-center justify-between">
          <Contents className="text-lg font-bold text-primary">총 주문금액</Contents>
          <Contents className="text-lg font-bold text-primary">{formatPrice(cost?.total || 0)}</Contents>
        </div>
      </div>
      <div className="flex justify-between gap-2 mt-4">
        <Button outlined size="medium" onClick={onContinueShoppingClick}>
          쇼핑 계속하기
        </Button>
        <Button size="medium" onClick={onOrderClick} disabled={isLoading || isOrderDisabled || itemCount === 0}>
          주문하기
        </Button>
      </div>
    </div>
  );
}
