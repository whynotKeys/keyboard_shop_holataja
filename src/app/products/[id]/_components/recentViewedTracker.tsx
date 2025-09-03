'use client';

import { useEffect } from 'react';
import { RecentViewProps, addRecent } from '@/lib/utils/recentView';

export default function RecentViewedTracker(props: RecentViewProps) {
  useEffect(() => {
    if (!props.id) return;
    addRecent(props);
  }, [props]);

  return null; // 보여주는 UI는 없음.
}
