'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogOut, ShoppingCart, User, Wrench } from 'lucide-react';

import useAuthStore from '@/features/auth/store';
import Button from '@/components/ui/Button';

export default function Header() {
  const { user, logout } = useAuthStore();
  const path = usePathname();

  return (
    <header className="flex items-center justify-center bg-white h-14">
      <div className="flex justify-between w-full max-w-5xl px-4 sm:px-6 ">
        <Link className="flex gap-2" href="/products" aria-label="상품 목록으로 이동">
          <Image src="/icon/holataja_logo.svg" alt="올라타자 로고" width={54} height={30} style={{ width: 54, height: 30 }} priority />
          <h1 className="text-2xl sub-title">HOLA TAJA!</h1>
        </Link>

        {user ? (
          <nav className="flex items-center justify-center gap-2">
            <Link href="/my" title="마이페이지">
              <User color={path === '/my' ? 'var(--color-primary)' : 'currentColor'} />
            </Link>
            <Link href="/carts" title="장바구니">
              <ShoppingCart color={path === '/carts' ? 'var(--color-primary)' : 'currentColor'} />
            </Link>
            {/* 관리자(판매자)에게만 표시 */}
            {user.type == 'seller' && (
              <Link href="/admin" title="관리자 페이지" className="pt-1">
                <Wrench color={path === '/admin' ? 'var(--color-primary)' : 'currentColor'} />
              </Link>
            )}
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
          </nav>
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
