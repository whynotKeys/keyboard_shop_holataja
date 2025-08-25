'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogOut, ShoppingCart, User } from 'lucide-react';

import useAuthStore from '@/features/auth/store';
import Button from '@/components/ui/Button';

export default function Header() {
  const { user, logout } = useAuthStore();
  const path = usePathname();

  return (
    <header className="bg-white flex justify-between items-center sub-title h-[60px]">
      <div className="flex items-center justify-between w-full max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        <Link className="flex gap-2" href="/products">
          <Image src="/icon/holataja_logo.svg" alt="올라타자 로고" width={54} height={30} style={{ width: 54, height: 30 }} />
          <h1 className="text-2xl">HOLA TAJA!</h1>
        </Link>
        {user ? (
          <div className="flex items-center justify-center gap-2">
            <Link href="/my" title="마이페이지">
              <User color={path === '/my' ? 'var(--color-primary)' : 'currentColor'} />
            </Link>
            <Link href="/carts" title="장바구니">
              <ShoppingCart color={path === '/cart' ? 'var(--color-primary)' : 'currentColor'} />
            </Link>
            <Button
              icon
              size="small"
              onClick={() => {
                logout();
              }}
              aria-label="로그아웃"
            >
              <LogOut />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/auth/login" className="label-m hover:underline">
              로그인
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
