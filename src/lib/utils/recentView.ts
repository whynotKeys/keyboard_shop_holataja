export type RecentViewProps = {
  id: number;
  src: string;
  name: string;
  price: number;
  bookmarkId: number;
  summary: string;
};

const key = 'recent_viewed_products';
const saveLimit = 5;

export function getRecent(): RecentViewProps[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

export function addRecent(item: RecentViewProps) {
  if (typeof window === 'undefined') return;
  const time = Date.now();
  const list = getRecent();

  // 중복 제거 후 맨 앞에 삽입
  const filtered = list.filter(listed => listed.id !== item.id);
  const next = [{ ...item, ts: time }, ...filtered].slice(0, saveLimit);

  localStorage.setItem(key, JSON.stringify(next));
}
