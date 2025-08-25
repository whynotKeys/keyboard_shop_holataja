import { Metadata } from 'next';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://final-15-holataja.vercel.app/'),
  title: {
    default: 'HOLATAJA - 온라인 프리미엄 타건샵',
    template: '%s | 올라타자',
  },
  description:
    '키보드 전문 쇼핑몰 HOLA TAJA! 커스텀 키보드, 게이밍 키보드, 무선 키보드까지. Craft Your Perfect Keyboard로 나만의 완벽한 키보드를 찾아보세요.',
  keywords: [
    '타건샵',
    '올라타자',
    '프리미엄 타건샵',
    '온라인 타건샵',
    'NUPHY',
    '기계식키보드',
    '커스텀키보드',
    '게이밍키보드',
    '무선키보드',
    '블루투스키보드',
    '키보드쇼핑몰',
    '적축',
    '갈축',
    '청축',
    '자석축',
  ],
  authors: [{ name: '올라타자', url: 'final-15-holataja.vercel.app/' }],
  creator: 'teamXV',

  openGraph: {
    title: '올라타자',
    description: '온라인 프리미엄 타건샵',
    url: 'https://final-15-holataja.vercel.app/',
    siteName: '올라타자',
    images: [
      {
        url: '/icon/holataja_logo.svg',
        width: 1200,
        height: 630,
        alt: '올라타자 - 온라인 프리미엄 타건샵',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://final-15-holataja.vercel.app',
  },

  category: '전자제품',
  classification: 'Business',
  icons: [
    {
      rel: 'icon',
      url: '/icon/favicon_light.svg',
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      url: '/icon/favicon_dark.svg',
      media: '(prefers-color-scheme: dark)',
    },
    {
      rel: 'icon',
      url: '/icon/favicon_light.svg',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="text-sm sm:text-base">
      <body className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 w-full max-w-5xl p-4 mx-auto sm:p-6 lg:p-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
