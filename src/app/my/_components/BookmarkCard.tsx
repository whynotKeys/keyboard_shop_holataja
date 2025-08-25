import Link from 'next/link';
import ProductImg from '@/features/product/components/ProductImg';

export interface BookmarkCardProps {
  id: number;
  src: string;
  name: string;
  price: number;
  bookmarkId: number;
}

export default function BookmarkCard({ id, src, name, price, bookmarkId }: BookmarkCardProps) {
  return (
    <div className="flex flex-col justify-between px-4 py-4 border-b sm:flex-row sm:items-center sm:gap-6 min-w-80 border-lightgray">
      <div className="flex flex-row justify-between w-full">
        {/* Product info */}
        <section className="flex items-center flex-grow">
          <Link href={`./products/${id}`}>
            <span className="block font-bold leading-snug label-m sm:label-l line-clamp-2"> {name}</span>
            <span className="block mt-2 mb-1 font-semibold text-text text-l">{price.toLocaleString()}원</span>
          </Link>
        </section>

        {/* Image */}
        <section className="grid shrink-0 rounded-xl w-[7rem] h-[7rem] min-w-28 min-h-28 overflow-hidden">
          <ProductImg title={name} srcList={[src]} productId={id} bookmarkId={bookmarkId} />
        </section>
      </div>
    </div>
  );
}
