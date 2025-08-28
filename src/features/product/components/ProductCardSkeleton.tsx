import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductCardSkeleton() {
  return (
    <SkeletonTheme>
      <div className="w-full rounded" role="status" aria-busy="true" aria-label="상품 카드 로딩 중">
        <div className="relative w-full overflow-hidden rounded-lg aspect-square">
          <Skeleton height="100%" width="100%" />
        </div>

        <div className="mt-2 space-y-2">
          <Skeleton height={16} width="92%" />
          <Skeleton height={16} width="66%" />
          <Skeleton height={20} width={96} />
        </div>
      </div>
    </SkeletonTheme>
  );
}
