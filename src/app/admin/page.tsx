import { Metadata } from 'next';

import Tab, { TabItem } from '@/components/ui/Tab';
import { Title } from '@/components/ui/Typography';
// import { getBookmarkList } from '@/lib/api/bookmark';
// import { getOrderList } from '@/lib/api/order';

import AdminOrdersTab from './_components/AdminOrdersTab';
import AdminProductsTab from './_components/AdminProductsTab';
import AdminCustomersTab from './_components/AdminCustomersTab';
import AdminQnaTab from './_components/AdminQnaTab';
import AdminAnalyticsTab from './_components/AdminAnalyticsTab';

export const metadata: Metadata = {
  title: '관리자 페이지 - HOLATAJA',
  description: '관리자만 사용할 수 있는 페이지입니다.',
  robots: 'noindex, nofollow', // 검색엔진 노출 방지
};

export default async function AdminPage() {
  // 주문 목록 불러오기
  // const orderHistoryData = await getOrderList();
  // const orderHistoryList = orderHistoryData.ok === 1 ? orderHistoryData.item : [];

  // 상품 목록 불러오기
  // const bookmarkData = await getBookmarkList();
  // const bookmarkList = bookmarkData.ok === 1 ? bookmarkData.item : [];

  //회원 목록 불러오기

  //문의 목록 불러오기

  const tabItems: TabItem[] = [
    { id: 'orders', title: '주문관리', content: <AdminOrdersTab /> },
    { id: 'products', title: '상품관리', content: <AdminProductsTab /> },
    { id: 'customers', title: '회원관리', content: <AdminCustomersTab /> },
    { id: 'qna', title: '문의관리', content: <AdminQnaTab /> },
    { id: 'analytics', title: '대시보드', content: <AdminAnalyticsTab /> },
  ];

  return (
    <>
      <Title className="mb-6">관리자 페이지</Title>
      <Tab tabItems={tabItems} defaultActiveTabId={'product'} />
    </>
  );
}
