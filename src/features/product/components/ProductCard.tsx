import Link from 'next/link';
import ProductImg from './ProductImg';

import { devDelay } from '@/lib/dev/delay';

interface ProductCardProps {
  _id: number;
  imageSrc: string;
  title: string;
  price: number;
  bookmarkId?: number;
}

export default async function ProductCard({ _id, imageSrc, title, price, bookmarkId }: ProductCardProps) {
  await devDelay(1000);
  const formatPrice = price.toLocaleString();

  return (
    <div className="w-full rounded">
      <div className="relative w-full rounded-lg aspect-square">
        <ProductImg title={title} srcList={[imageSrc]} productId={_id} bookmarkId={bookmarkId ? bookmarkId : 0} />
      </div>

      <Link href={`./products/${_id}`}>
        <span className="text-sm leading-5 text-gray-700 sm:text-md line-clamp-2 webkit-line-clamp-2">{title}</span>
        <span className="pb-3 font-bold">{formatPrice}원</span>
      </Link>
    </div>
  );
}
