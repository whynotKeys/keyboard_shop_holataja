import Image from 'next/image';
import { Search, ShoppingCart, ThumbsUp, ThumbsDown, User } from 'lucide-react';

export default function Icons() {
  return (
    <div>
      <ShoppingCart />
      <User />
      <Search />
      <ThumbsUp />
      <ThumbsDown />
      <Image src="/icon/off_star.svg" alt="찜하기 비활성" width={24} height={24} />
      <Image src="/icon/on_star.svg" alt="찜하기 비활성" width={24} height={24} />
    </div>
  );
}
