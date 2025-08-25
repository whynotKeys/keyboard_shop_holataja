import { cookies } from 'next/headers';
import Link from 'next/link';
import { Metadata } from 'next';

import { Title } from '@/components/ui/Typography';
import getCartList from '@/lib/api/carts';
import getProduct from '@/lib/api/product';

import CheckOutForm from './_components/CheckOutForm';

export const metadata: Metadata = {
  title: '결제 - HOLATAJA',
  description: '선택한 상품을 결제합니다.',
  robots: 'noindex, nofollow',
};

interface CheckoutPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  // API 호출을 위해 쿠키에서 토큰 가져오기
  const cookie = (await cookies()).get('accessToken');
  const token = cookie ? cookie.value : '';

  let orderData;

  // 1. 장바구니에서 온 경우 또는 기본 경우
  if (params.from === 'cart' || !params.from) {
    const cartRes = await getCartList(token);
    orderData =
      cartRes.ok === 1
        ? {
            products:
              cartRes.item?.map(item => ({
                cartId: item._id,
                id: item.product_id,
                name: item.product.name,
                image: `${item.product.image.path}` || '',
                options: item.color,
                quantity: item.quantity,
                price: item.product.price,
              })) || [],
            subtotal: cartRes.cost?.products || 0,
            shippingFee: cartRes.cost?.shippingFees || 0,
            total: cartRes.cost?.total || 0,
          }
        : {
            products: [],
            subtotal: 0,
            shippingFee: 0,
            total: 0,
          };
  }

  // 2. 상품 상세에서 온 경우 (기존 URL 형태)
  else if (params.from === 'info' && params.product_id) {
    try {
      const productRes = await getProduct(Number(params.product_id));

      if (productRes.ok === 1 && productRes.item) {
        const product = productRes.item;

        // 기본값으로 생성 (클라이언트에서 sessionStorage로 업데이트 예정)
        const productPrice = product.price;
        const quantity = 1; // 기본값
        const subtotal = productPrice * quantity;
        const shippingFee = product.shippingFees || (subtotal >= 50000 ? 0 : 3000);

        orderData = {
          products: [
            {
              id: product._id,
              name: product.name,
              image: product.mainImages && product.mainImages.length > 0 ? `${product.mainImages[0].path}` : '',
              options: product.extra.option && product.extra.option.length > 0 ? product.extra.option[0] : '',
              quantity: quantity,
              price: productPrice,
            },
          ],
          subtotal: subtotal,
          shippingFee: shippingFee,
          total: subtotal + shippingFee,
        };
      } else {
        orderData = {
          products: [],
          subtotal: 0,
          shippingFee: 0,
          total: 0,
        };
      }
    } catch (error) {
      console.error('상품 정보 조회 실패:', error);
      orderData = {
        products: [],
        subtotal: 0,
        shippingFee: 0,
        total: 0,
      };
    }
  }

  // 결제할 상품이 없는 경우
  if (!orderData || orderData.products.length === 0) {
    return (
      <div className="bg-white rounded-lg">
        <div className="py-12 text-center">
          <h2 className="mb-4 text-xl font-bold text-gray-900">결제할 상품이 없습니다</h2>
          <p className="mb-6 text-gray-600">장바구니에 상품을 담거나 상품을 선택해주세요.</p>
          <div className="space-x-4">
            <Link href="/products" className="px-6 py-3 text-white rounded-lg bg-primary hover:bg-hover">
              상품 둘러보기
            </Link>
            <Link href="/cart" className="px-6 py-3 text-gray-800 rounded-lg bg-lightgray hover:bg-gray-300">
              장바구니 확인
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 페이지 제목 */}
      <Title className="mb-6">결제</Title>
      <CheckOutForm token={token} orderInfo={orderData} />
    </div>
  );
}
