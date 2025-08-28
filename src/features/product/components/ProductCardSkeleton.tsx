export default function ProductCardSkeleton() {
  return (
    <div className="w-full rounded" role="status" aria-busy="true" aria-label="상품 카드 로딩 중">
      <div className="relative w-full overflow-hidden rounded-lg aspect-square animate-pulse">
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
      </div>

      <div className="mt-2 space-y-2 duration-[10] ease-in-out animate-pulse">
        <div className="w-11/12 h-4 bg-gray-200 rounded dark:bg-gray-800" />
        <div className="w-8/12 h-4 bg-gray-200 rounded dark:bg-gray-800" />
        <div className="w-24 h-5 bg-gray-200 rounded dark:bg-gray-800" />
      </div>
    </div>
  );
}
