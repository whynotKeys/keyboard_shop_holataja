'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import useAuthStore from '@/features/auth/store';
import { clearCart } from '@/lib/actions/carts';

// 결제 방식 타입
type PaymentMethod = '간편결제' | '체크/신용 카드' | '무통장 입금';
// 간편결제 옵션 타입
type SimplePaymentOption = '토스' | '네이버';

// 세션스토리지 체크아웃 데이터 타입
interface CheckoutData {
  _id: number;
  color: string;
  quantity: number;
}

// 배송지 정보 타입
interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  postalCode: string;
}

// 상품 정보 타입
interface ProductInfo {
  cartId?: number;
  id: number;
  name: string;
  image: string;
  options: string;
  quantity: number;
  price: number;
}

// 주문 정보 타입
interface OrderInfo {
  products: ProductInfo[];
  subtotal: number; // 상품 총액
  shippingFee: number; // 배송비
  total: number; // 총 결제 금액
}

// 결제 데이터 타입 (결제 완료 시 전달)
interface PaymentData {
  deliveryInfo: DeliveryInfo;
  orderInfo: OrderInfo;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    type: PaymentMethod;
    option?: SimplePaymentOption;
    cardNumber?: string;
    expiryDate?: string;
    cvc?: string;
    cardPassword?: string;
    selectedBank?: string;
    depositorName?: string;
  };
}

// 컴포넌트 Props 타입
interface CheckoutPageProps {
  token: string;
  deliveryInfo?: DeliveryInfo;
  orderInfo: OrderInfo;
  onDeliveryChange?: () => void;
  onPaymentComplete?: (paymentData: PaymentData) => void;
}

export default function CheckOutForm({ token, orderInfo }: CheckoutPageProps) {
  const router = useRouter();
  // URL searchParams에서 from 파라미터 확인
  const [isFromCart, setIsFromCart] = useState<boolean>(false);
  // 결제 방법(탭) 상태
  const [activePaymentMethod, setActivePaymentMethod] = useState<PaymentMethod>('간편결제');
  // 간편결제 옵션 상태
  const [selectedSimplePayment, setSelectedSimplePayment] = useState<SimplePaymentOption>('토스');
  // 카드 결제 정보 상태
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardPassword: '',
  });
  // 무통장 입금 정보 상태
  const [bankInfo, setBankInfo] = useState({
    selectedBank: '',
    depositorName: '',
  });
  // 결제 처리 중 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 세션스토리지 데이터를 반영한 주문 정보 상태
  const [currentOrderInfo, setCurrentOrderInfo] = useState<OrderInfo>(orderInfo);
  // 유저 배송지 정보 (props가 없을 때 사용)
  const { user, hasHydrated } = useAuthStore();

  const deliveryInfo: DeliveryInfo = {
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    postalCode: user?.postalCode || '',
  };

  // 결제에만 사용하는 배송지 정보 state
  const [currentDeliveryInfo, setCurrentDeliveryInfo] = useState<DeliveryInfo>(deliveryInfo);

  // 세션스토리지에서 checkoutData 확인하여 주문 정보 업데이트
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const fromParam = urlParams.get('from');
      setIsFromCart(fromParam === 'cart' || !fromParam);

      const checkoutDataStr = sessionStorage.getItem('checkoutData');
      if (checkoutDataStr) {
        try {
          const checkoutData: CheckoutData = JSON.parse(checkoutDataStr);

          // orderInfo의 products를 세션스토리지 데이터로 업데이트
          const updatedProducts = orderInfo.products.map(product => {
            // _id가 일치하는 상품의 경우 세션스토리지 데이터로 교체
            if (product.id === checkoutData._id) {
              return {
                ...product,
                options: checkoutData.color, // 세션스토리지의 color로 교체
                quantity: checkoutData.quantity, // 세션스토리지의 quantity로 교체
              };
            }
            return product;
          });

          // 총액 재계산
          const subtotal = updatedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
          const shippingFee = orderInfo.shippingFee; // 배송비는 기존 값 유지
          const total = subtotal + shippingFee;

          // 업데이트된 주문 정보로 상태 변경
          setCurrentOrderInfo({
            products: updatedProducts,
            subtotal,
            shippingFee,
            total,
          });
        } catch (error) {
          console.error('세션스토리지 checkoutData 파싱 오류:', error);
          // 파싱 오류 시 기본 orderInfo 사용
          setCurrentOrderInfo(orderInfo);
        }
      } else {
        // 세션스토리지에 데이터가 없으면 기본 orderInfo 사용
        setCurrentOrderInfo(orderInfo);
      }
    }
  }, [orderInfo]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (user) {
      setCurrentDeliveryInfo({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        postalCode: user.postalCode || '00000',
      });
    }
  }, [hasHydrated, user]);

  // 배송지 수정 모드 상태
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);
  // 배송지 수정 입력값 상태 (수정 모드에서 사용)
  const [editDeliveryInfo, setEditDeliveryInfo] = useState<DeliveryInfo>(currentDeliveryInfo);

  // -----------------------------
  // 핸들러 함수들
  // -----------------------------

  // 결제 방법(탭) 변경
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setActivePaymentMethod(method);
  };

  // 간편결제 옵션 변경
  const handleSimplePaymentChange = (option: SimplePaymentOption) => {
    setSelectedSimplePayment(option);
  };

  // 카드 정보 입력 변경
  const handleCardInfoChange = (field: keyof typeof cardInfo, value: string) => {
    setCardInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 무통장 입금 정보 입력 변경
  const handleBankInfoChange = (field: keyof typeof bankInfo, value: string) => {
    setBankInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 배송지 변경 버튼 클릭 시 수정 모드로 전환
  const handleDeliveryChange = () => {
    setEditDeliveryInfo(currentDeliveryInfo); // 현재 배송지 정보로 초기화
    setIsEditingDelivery(true); // 수정 모드 활성화
  };

  // 배송지 입력값 변경 핸들러 (수정 모드에서 사용)
  const handleDeliveryInputChange = (field: keyof DeliveryInfo, value: string) => {
    setEditDeliveryInfo(prev => ({ ...prev, [field]: value }));
  };

  // 배송지 저장 버튼 클릭 시
  const handleSaveDeliveryInfo = () => {
    setCurrentDeliveryInfo(editDeliveryInfo); // 수정된 정보 저장
    setIsEditingDelivery(false); // 수정 모드 종료
  };

  // 배송지 취소 버튼 클릭 시
  const handleCancelEdit = () => {
    setIsEditingDelivery(false); // 수정 모드 종료
  };

  // 금액 포맷팅 함수 (숫자를 "1,000원" 형태로 변환)
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  // -----------------------------
  // 결제 탭별 렌더 함수
  // -----------------------------

  // 간편결제 탭 내용
  const renderSimplePaymentContent = () => (
    <div className="p-3 rounded-lg tab-content sm:p-4">
      <h4 className="mb-4 text-base font-semibold sm:text-lg">간편결제 선택</h4>
      {/* 토스페이 옵션 */}
      <div className="p-2 mb-3 cursor-pointer payment-option sm:p-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="simplePayment"
            value="toss"
            checked={selectedSimplePayment === '토스'}
            onChange={() => handleSimplePaymentChange('토스')}
            className="mr-2 sm:mr-3"
          />
          <div className="flex items-center">
            <div className="w-[80px] sm:w-[130px] me-2">
              <Image
                src="/toss-logo.png"
                alt="토스페이"
                width={130}
                height={49}
                className="w-[80px] sm:w-[130px] h-[16px] sm:h-[49px] object-contain"
              />
            </div>
            <span className="text-sm font-medium sm:text-base">토스페이</span>
          </div>
        </label>
      </div>
      {/* 네이버페이 옵션 */}
      <div className="p-2 mb-3 cursor-pointer payment-option sm:p-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="simplePayment"
            value="naver"
            checked={selectedSimplePayment === '네이버'}
            onChange={() => handleSimplePaymentChange('네이버')}
            className="mr-2 sm:mr-3"
          />
          <div className="flex items-center">
            <div className="w-[80px] sm:w-[130px] me-2">
              <Image
                src="/npay-logo.svg"
                alt="네이버페이"
                width={82}
                height={28}
                className="w-[55px] sm:w-[82px] h-[19px] sm:h-[28px] object-contain"
              />
            </div>
            <span className="text-sm font-medium sm:text-base">네이버페이</span>
          </div>
        </label>
      </div>
    </div>
  );

  // 카드 결제 탭 내용
  const renderCardPaymentContent = () => (
    <div className="p-3 rounded-lg tab-content sm:p-4">
      <h4 className="mb-4 text-base font-semibold sm:text-lg">카드 정보 입력</h4>
      {/* 카드 번호 */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium" htmlFor="cardNumber">
          카드 번호
        </label>
        <Input
          id="cardNumber"
          type="text"
          placeholder="0000-0000-0000-0000"
          maxLength={19}
          value={cardInfo.cardNumber}
          onChange={e => handleCardInfoChange('cardNumber', e.target.value)}
        />
      </div>
      {/* 유효기간 & CVC */}
      <div className="grid grid-cols-2 gap-2 mb-4 sm:gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium" htmlFor="expiryTitle">
            유효기간
          </label>
          <Input
            id="expiryTitle"
            type="text"
            placeholder="MM/YY"
            maxLength={5}
            value={cardInfo.expiryDate}
            onChange={e => handleCardInfoChange('expiryDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium" htmlFor="cvcNumber">
            CVC
          </label>
          <Input
            id="cvcNumber"
            type="text"
            placeholder="000"
            maxLength={3}
            value={cardInfo.cvc}
            onChange={e => handleCardInfoChange('cvc', e.target.value)}
          />
        </div>
      </div>
      {/* 카드 비밀번호 */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium" htmlFor="pwdNumber">
          카드 비밀번호 앞 2자리
        </label>
        <Input
          id="pwdNumber"
          type="password"
          placeholder="**"
          maxLength={2}
          value={cardInfo.cardPassword}
          onChange={e => handleCardInfoChange('cardPassword', e.target.value)}
        />
      </div>
    </div>
  );

  // 무통장 입금 탭 내용
  const renderBankPaymentContent = () => {
    const bankOptions = ['국민은행', '신한은행', '우리은행', '하나은행', '농협', '카카오뱅크'];
    return (
      <div className="p-3 rounded-lg tab-content sm:p-4">
        <h4 className="mb-4 text-base font-semibold sm:text-lg">무통장 입금 정보</h4>
        {/* 은행 선택 */}
        <div className="mb-4">
          <Select
            label="입금 은행 선택"
            showLabel={true}
            options={bankOptions}
            id="selectedBank"
            name="selectedBank"
            selectedValue={bankInfo.selectedBank}
            onChange={e => handleBankInfoChange('selectedBank', e.target.value)}
            size="medium"
            placeholder="은행을 선택하세요"
            className="!w-full sm:!w-64 md:!w-48"
          />
        </div>
        {/* 입금자명 입력 */}
        <div className="mb-4">
          <h4 className="mb-4 text-base font-semibold sm:text-lg">입금자명</h4>
          <label className="block mb-2 text-sm font-medium" htmlFor="buyerName"></label>
          <Input
            id="buyerName"
            type="text"
            placeholder="입금자명을 입력하세요"
            value={bankInfo.depositorName}
            onChange={e => handleBankInfoChange('depositorName', e.target.value)}
          />
        </div>
        {/* 선택된 은행 계좌 정보 표시 */}
        {bankInfo.selectedBank && (
          <div className="p-3 rounded-lg bg-blue-50 sm:p-4">
            <h5 className="mb-2 text-sm font-semibold sm:text-base">입금 계좌 정보</h5>
            <p className="text-sm text-gray-700">
              {bankInfo.selectedBank === '국민은행' && '국민은행 123-456-789012'}
              {bankInfo.selectedBank === '신한은행' && '신한은행 987-654-321098'}
              {bankInfo.selectedBank === '우리은행' && '우리은행 1002-123-456789'}
              {bankInfo.selectedBank === '하나은행' && '하나은행 111-222-333444'}
              {bankInfo.selectedBank === '농협은행' && '농협은행 999-888-777666'}
              {bankInfo.selectedBank === '카카오뱅크' && '카카오뱅크 3333-02-9023121'}
            </p>
            <p className="mt-1 text-sm text-gray-700">예금주: (주)올라타자</p>
          </div>
        )}
      </div>
    );
  };

  // 결제 방법에 따라 탭 내용 렌더링
  const renderActiveTabContent = () => {
    switch (activePaymentMethod) {
      case '간편결제':
        return renderSimplePaymentContent();
      case '체크/신용 카드':
        return renderCardPaymentContent();
      case '무통장 입금':
        return renderBankPaymentContent();
      default:
        return <div>결제 방법을 선택해주세요.</div>;
    }
  };

  // 결제 버튼 클릭 시 결제 데이터 생성 및 처리
  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const products = currentOrderInfo.products.map(product => ({
        _id: product.id,
        quantity: product.quantity,
      }));
      const options = currentOrderInfo.products.map(product => ({
        option: product.options,
      }));
      const address = {
        name: currentDeliveryInfo.name,
        phone: currentDeliveryInfo.phone,
        address: currentDeliveryInfo.address,
        postalCode: currentDeliveryInfo.postalCode,
      };
      const payment = {
        method: activePaymentMethod,
        info:
          activePaymentMethod === '간편결제'
            ? selectedSimplePayment
            : activePaymentMethod === '체크/신용 카드'
              ? `${cardInfo.cardNumber}&${cardInfo.expiryDate}&${cardInfo.cvc}&${cardInfo.cardPassword}`
              : activePaymentMethod === '무통장 입금'
                ? `${bankInfo.selectedBank}&${bankInfo.depositorName}`
                : '',
      };
      const requestBody = {
        products,
        options,
        address,
        payment,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': process.env.NEXT_PUBLIC_API_CLIENT_ID!,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const response = await res.json();
      //결제 완료 후처리

      if (response.ok === 1) {
        if (isFromCart) {
          // 장바구니에서 결제한 경우 장바구니 비우기
          await clearCart(token);
        }
      }
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('checkoutData'); // 결제 후 세션스토리지 데이터 삭제
      }
      router.push(`/my/${response.item._id}`);
    } catch (error) {
      console.error('결제 처리 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-3 mb-6 bg-white rounded-lg sm:p-6 sm:mb-8 border-1 border-lightgray">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl">배송지</h2>
            <div className="space-y-2 text-gray-700">
              {/* 배송지 수정 모드: 인풋 필드로 표시 */}
              {isEditingDelivery ? (
                <>
                  <div>
                    <label className="block mb-1 text-sm font-medium" htmlFor="recipientName">
                      수령인 이름
                    </label>
                    <Input
                      id="recipientName"
                      type="text"
                      value={editDeliveryInfo.name}
                      onChange={e => handleDeliveryInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium" htmlFor="recipientPhoneNumber">
                      연락처
                    </label>
                    <Input
                      id="recipientPhoneNumber"
                      type="text"
                      value={editDeliveryInfo.phone}
                      onChange={e => handleDeliveryInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium" htmlFor="recipientAddress">
                      주소
                    </label>
                    <Input
                      id="recipientAddress"
                      type="text"
                      value={editDeliveryInfo.address}
                      onChange={e => handleDeliveryInputChange('address', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium" htmlFor="recipientPostCode">
                      우편번호
                    </label>
                    <Input
                      id="recipientPostCode"
                      type="text"
                      value={editDeliveryInfo.postalCode}
                      onChange={e => handleDeliveryInputChange('postalCode', e.target.value)}
                    />
                  </div>
                  {/* 저장/취소 버튼 */}
                  <div className="flex justify-end gap-4 mt-2">
                    <Button size="small" outlined onClick={handleCancelEdit}>
                      취소
                    </Button>
                    <Button size="small" onClick={handleSaveDeliveryInfo}>
                      저장
                    </Button>
                  </div>
                </>
              ) : (
                // 배송지 정보 표시
                <>
                  <p className="text-sm font-medium sm:text-base">{currentDeliveryInfo.name}</p>
                  <p className="text-sm sm:text-base">{currentDeliveryInfo.phone}</p>
                  <p className="text-sm sm:text-base">{currentDeliveryInfo.address}</p>
                  <p className="text-sm sm:text-base">우) {currentDeliveryInfo.postalCode}</p>
                </>
              )}
            </div>
          </div>
          {/* 변경하기 버튼: 수정 모드가 아닐 때만 표시 */}
          {!isEditingDelivery && (
            <div className="flex-shrink-0">
              <Button size="small" outlined onClick={handleDeliveryChange}>
                변경하기
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 주문 상품 정보 섹션 */}
      <div className="p-3 mb-6 bg-white rounded-lg sm:p-6 sm:mb-8 border-1 border-lightgray">
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">주문 상품</h2>
        <div className="space-y-3 sm:space-y-4">
          {currentOrderInfo.products.map(product => (
            <div key={product.id} className="flex items-center gap-3 sm:gap-4">
              <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className="flex-shrink-0 object-cover rounded-lg sm:w-24 sm:h-24"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium md:text-base">{product.name}</h3>
                <p className="text-sm text-gray-500">옵션: {product.options}</p>
                <p className="text-sm text-gray-500">{product.quantity}개</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-semibold md:text-base">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
        {/* 주문 금액 요약 */}
        <div className="pt-6 mt-6 border-t border-lightgray">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 sm:text-base">상품 금액</span>
            <span className="text-sm sm:text-base">{formatPrice(currentOrderInfo.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 sm:text-base">배송비</span>
            <span className="text-sm sm:text-base">{formatPrice(currentOrderInfo.shippingFee)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-bold sm:text-xl">
            <span>주문 금액</span>
            <span>{formatPrice(currentOrderInfo.total)}</span>
          </div>
        </div>
      </div>

      {/* 결제 수단 선택 섹션 */}
      <div className="p-3 mb-6 bg-white rounded-lg sm:p-6 sm:mb-8 border-1 border-lightgray">
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">결제 수단</h2>
        {/* 결제 방법 탭 버튼 */}
        <div className="flex flex-col gap-2 mb-6 sm:gap-4 sm:flex-row">
          <Button
            size="full"
            outlined={activePaymentMethod === '간편결제'}
            select={activePaymentMethod === '간편결제' ? false : true}
            onClick={() => handlePaymentMethodChange('간편결제')}
            // className="flex-1 px-1 text-sm md:text-base sm:px-3"
          >
            간편결제
          </Button>
          <Button
            size="full"
            outlined={activePaymentMethod === '체크/신용 카드'}
            select={activePaymentMethod === '체크/신용 카드' ? false : true}
            onClick={() => handlePaymentMethodChange('체크/신용 카드')}
            // className="flex-1 px-1 text-sm md:text-base sm:px-3"
          >
            체크/신용카드 결제
          </Button>
          <Button
            size="full"
            outlined={activePaymentMethod === '무통장 입금'}
            select={activePaymentMethod === '무통장 입금' ? false : true}
            onClick={() => handlePaymentMethodChange('무통장 입금')}
            // className="flex-1 px-1 text-sm md:text-base sm:px-3"
          >
            무통장 입금
          </Button>
        </div>
        {/* 선택된 결제 방법의 상세 입력 영역 */}
        <div className="tab-content-wrapper">{renderActiveTabContent()}</div>
      </div>

      {/* 최종 결제 버튼 */}
      <div className="flex justify-end mt-6 sm:mt-8">
        <Button
          size="medium"
          submit
          onClick={handleCheckout}
          disabled={
            isLoading ||
            (activePaymentMethod === '체크/신용 카드' && (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvc)) ||
            (activePaymentMethod === '무통장 입금' && (!bankInfo.selectedBank || !bankInfo.depositorName))
          }
          className="w-full sm:w-auto min-w-[120px]"
        >
          {isLoading ? '결제 처리 중...' : '결제하기'}
        </Button>
      </div>
    </>
  );
}
