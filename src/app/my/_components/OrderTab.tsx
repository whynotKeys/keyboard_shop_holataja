'use client';

import { useState } from 'react';

import { History } from 'lucide-react';

import Pagination from '@/components/ui/Pagination';
import { SubTitle } from '@/components/ui/Typography';
import { getOrderStatusLabel } from '@/lib/mappers/mappingTables';
import type { OrderItem } from '@/types/order';

import HistoryCard from './HistoryCard';

interface OrderTabProps {
  orderHistoryList: OrderItem[];
}

export default function OrderTab({ orderHistoryList }: OrderTabProps) {
  //Pagination
  const [page, setPage] = useState(1);
  const limit = 3;
  const totalPages = Math.ceil(orderHistoryList.length / limit);
  const pagedOrderList = orderHistoryList.slice((page - 1) * limit, page * limit);

  return (
    <>
      <SubTitle className="label-l">구매 내역</SubTitle>
      <div>
        {!pagedOrderList.length ? (
          <div className="flex flex-col items-center py-8 border-b-1 border-b-lightgray text-darkgray">
            <History className="mb-4" size={32} />
            <p>구매 내역이 없습니다.</p>
          </div>
        ) : (
          pagedOrderList.map((order: OrderItem, index: number) => (
            <HistoryCard
              key={index}
              id={order._id}
              status={getOrderStatusLabel(order.state)}
              products_info={order.products.map(product => ({
                id: product._id,
                name: product.name,
              }))}
              src={order.products?.[0]?.image?.path ? `${order.products[0].image.path}` : '/product_images/holataja_circle.webp'}
              name={order.products[0].name}
              price={order.cost.total}
              quantity={order.products.length}
              date={order.createdAt}
            />
          ))
        )}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
