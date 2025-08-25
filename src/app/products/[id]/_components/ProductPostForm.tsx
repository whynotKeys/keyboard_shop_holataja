'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import QuantityCount from '@/components/ui/QuantityCount';
import useAuthStore from '@/features/auth/store';
import { addToCart } from '@/lib/actions/product';
import type { ApiRes } from '@/types/api';
import type { ProductInfo } from '@/types/product';

function ProductPostForm({ productData }: { productData: ApiRes<ProductInfo> }) {
  const router = useRouter();
  const { user } = useAuthStore();

  const [option, setOption] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartSuccessModal, setCartSuccessModal] = useState(false);
  const [cartFailModal, setCartFailModal] = useState(false);
  const [purchaseFailModal, setPurchaseFailModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  // 구매하기 데이터 담기
  const checkout = () => {
    if (!user) setLoginModal(true);
    else if (!productData.ok || !option) {
      setPurchaseFailModal(true);
    } else {
      const checkoutData = {
        _id: productData.item._id,
        quantity: quantity,
        color: option,
      };

      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      router.push(`/checkout?from=info&product_id=${checkoutData._id}`);
    }
  };

  // 장바구니에 담기
  const [state, formAction] = useActionState(addToCart, null);

  useEffect(() => {
    if (productData.ok === 1 && productData.item?.extra?.option?.length === 1 && user) {
      setOption(productData.item.extra.option[0]);
    }
  }, [productData, user]);

  useEffect(() => {
    if (state?.ok === 1) {
      setCartSuccessModal(true);
    } else if (state?.ok === 0) {
      setCartFailModal(true);
    }
  }, [state]);

  return (
    <div>
      <form
        action={formData => {
          if (!user) {
            setLoginModal(true);
            return;
          }
          if (!option) {
            setCartFailModal(true);
            return;
          }
          formAction(formData);
        }}
      >
        <input type="hidden" name="product_id" value={productData.ok === 1 ? productData.item._id : 0} />
        <div className="mb-4">
          <span className="inline-block mb-2 font-semibold">옵션</span>
          <div className="flex flex-wrap gap-2">
            {productData.ok === 1 &&
              productData.item?.extra?.option?.map((prdOption, idx) => (
                <Button key={idx} size="medium" select={prdOption !== option} outlined={prdOption === option} onClick={() => setOption(prdOption)}>
                  {prdOption}
                </Button>
              ))}
          </div>
          <input type="hidden" name="color" value={option ?? ''} />
        </div>
        <div className="flex flex-col gap-4">
          <QuantityCount quantity={quantity} handleCountQuantity={setQuantity} />
          <input type="hidden" name="quantity" value={quantity} />
          <div className="flex flex-row gap-2 sm:gap-4">
            <Button outlined size="full" submit>
              장바구니
            </Button>
            <Button size="full" onClick={checkout}>
              구매하기
            </Button>
          </div>
        </div>
      </form>
      {/* 장바구니 추가 완료 모달 */}
      <Modal
        isOpen={cartSuccessModal}
        handleClose={() => setCartSuccessModal(false)}
        handleConfirm={() => {
          router.push('/carts');
        }}
        description="상품이 장바구니에 추가되었습니다."
        isChoiceModal
        choiceOptions={['계속 쇼핑하기', '장바구니로 이동']}
      />

      {/* 장바구니 추가 실패 모달 */}
      <Modal
        isOpen={cartFailModal}
        handleClose={() => setCartFailModal(false)}
        handleConfirm={() => setCartFailModal(false)}
        description={option ? '장바구니 추가에 실패했습니다.' : '옵션을 선택해주세요.'}
        hideCancelButton
      />

      {/* 구매 실패 모달 */}
      <Modal
        isOpen={purchaseFailModal}
        handleClose={() => setPurchaseFailModal(false)}
        handleConfirm={() => setPurchaseFailModal(false)}
        description={option ? '구매에 실패했습니다.' : '옵션을 선택해주세요.'}
        hideCancelButton
      />

      {/* 로그인 필요 모달 */}
      <Modal
        isOpen={loginModal}
        handleClose={() => setLoginModal(false)}
        handleConfirm={() => router.push('/auth/login')}
        description={'로그인이 필요합니다.'}
        isChoiceModal
        choiceOptions={['닫기', '로그인하기']}
      />
    </div>
  );
}

export default ProductPostForm;
