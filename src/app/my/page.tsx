import { Metadata } from 'next';

import Tab, { TabItem } from '@/components/ui/Tab';
import { Title } from '@/components/ui/Typography';
import { getBookmarkList } from '@/lib/api/bookmark';
import { getOrderList } from '@/lib/api/order';

import BookmarkTab from './_components/BookmarkTab';
import OrderTab from './_components/OrderTab';
import QnATab from './_components/QnATab';
import ReviewTab from './_components/ReviewTab';
import UserInfo from './_components/UserInfo';
import RecentViewTab from './_components/RecentViewTab';

export const metadata: Metadata = {
  title: '마이페이지 - HOLATAJA',
  description: '회원님의 정보와 활동 내역을 확인할 수 있습니다.',
  robots: 'noindex, nofollow', // 검색엔진 노출 방지
};

export default async function MyPage() {
  // 구매 내역 목록 데이터 불러오기
  const orderHistoryData = await getOrderList();
  const orderHistoryList = orderHistoryData.ok === 1 ? orderHistoryData.item : [];

  // 찜 목록 데이터 불러오기
  const bookmarkData = await getBookmarkList();
  const bookmarkList = bookmarkData.ok === 1 ? bookmarkData.item : [];

  const tabItems: TabItem[] = [
    { id: 'info', title: '회원 정보', content: <UserInfo /> },
    { id: 'orders', title: '구매 내역', content: <OrderTab orderHistoryList={orderHistoryList} /> },
    { id: 'bookmarks', title: '찜 목록', content: <BookmarkTab bookmarkList={bookmarkList} /> },
    { id: 'recentview', title: '최근 본 상품', content: <RecentViewTab /> },
    { id: 'reviews', title: '나의 구매 후기', content: <ReviewTab /> },
    { id: 'qna', title: '나의 Q&A', content: <QnATab /> },
  ];

  return (
    <>
      <Title className="mb-6">마이 페이지</Title>
      <Tab tabItems={tabItems} defaultActiveTabId={'info'} />
    </>
  );
}
