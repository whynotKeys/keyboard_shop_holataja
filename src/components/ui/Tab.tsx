'use client';

import { useState } from 'react';

export interface TabItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

// 범용적으로 사용할 수 있도록 props로 tabItems/초기 탭 ID를 받음
interface TabProps {
  tabItems: TabItem[];
  defaultActiveTabId?: string; // 초기 탭 설정용 (선택사항, 미입력 시 )
}

export default function Tab({ tabItems, defaultActiveTabId }: TabProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTabId ?? tabItems[0]?.id);

  return (
    <div className="w-full mx-auto">
      {/* Tab Nav */}
      <nav>
        {tabItems.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={
              activeTab === tab.id
                ? 'inline-block w-auto text-[14px] sm:text-base px-2 py-4 sm:p-4 cursor-pointer text-primary font-bold border-b-2 border-b-primary'
                : 'inline-block w-auto text-[14px] sm:text-base px-2 py-4 sm:p-4 cursor-pointer text-secondary hover:border-b-2 hover:border-b-primary'
            }
          >
            {tab.title}
          </button>
        ))}
      </nav>

      {/* Gray Line */}
      <hr className=" border-t-2 border-lightgray relative top-[-2px] -z-1" />

      {/* Tab Content */}
      <div className="p-4">{tabItems.find(tab => tab.id === activeTab)?.content}</div>
    </div>
  );
}
