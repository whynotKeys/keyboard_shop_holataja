'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function Component() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full h-full space-y-8 text-center py-30">
        {/* ERROR 표시 */}
        <div className="flex justify-center gap-1 sm:gap-3">
          {['E', 'R', 'R', 'O', 'R'].map((letter, index) => (
            <div key={index} className="w-[4.375rem] h-[4.375rem] flex items-start justify-center bg-secondary border-3 border-[#3e5c6b] rounded-xl">
              <div className="w-[4.375rem] h-14 flex items-center justify-center pb-1 bg-white text-secondary font-bold text-4xl rounded-xl">
                {letter}
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">오류가 발생했습니다.</h1>

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-600">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Button */}
        <Button onClick={() => router.push('/')}>메인 페이지로 이동</Button>
      </div>
    </div>
  );
}
