import { Title } from '@/components/ui/Typography';
import { getProductList } from '@/lib/api/product';
import type { Product } from '@/types/product';

import Carousel from './_components/Carousel';
import ProductList from './_components/ProductList';

export default async function ProductPage() {
  // 상품 목록 데이터 불러오기
  const productData = await getProductList();
  const productList: Product[] =
    productData.ok === 1
      ? productData.item.map(item => ({
          _id: item._id,
          imgSrc: item.mainImages[0]?.path ? `${item.mainImages[0].path}` : '/product_images/holataja_circle.webp',
          name: item.name,
          price: item.price,
          category: item.extra.category,
          quantity: item.quantity,
          createdAt: item.createdAt,
          bookmarkId: item.myBookmarkId ? Number(item.myBookmarkId) : 0,
        }))
      : [];

  return (
    <>
      <section className="py-2">
        <Carousel />
      </section>

      <section className="max-w-5xl py-3 mx-auto">
        <Title className="mb-6">상품 목록</Title>
        <ProductList productData={productList} />
      </section>
    </>
  );
}
