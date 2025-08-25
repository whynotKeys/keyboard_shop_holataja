import Link from 'next/link';
import ProductImg from './ProductImg';

interface ProductCardProps {
  _id: number;
  imageSrc: string;
  title: string;
  price: number;
  bookmarkId?: number;
}

export default function ProductCard({ _id, imageSrc, title, price, bookmarkId }: ProductCardProps) {
  const formatPrice = price.toLocaleString();

  return (
    <div className="w-full rounded">
      <div className="relative w-full rounded-lg aspect-squre">
        <ProductImg title={title} srcList={[imageSrc]} productId={_id} bookmarkId={bookmarkId ? bookmarkId : 0} />
      </div>

      <Link href={`./products/${_id}`}>
        <span className="text-sm leading-5 text-gray-700 sm:text-md line-clamp-2 webkit-line-clamp-2">{title}</span>
        <span className="pb-3 font-bold">{formatPrice}원</span>
      </Link>
    </div>
  );
}
