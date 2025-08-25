'use client';

import React, { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';

import { MessageCircleMore } from 'lucide-react';

import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import ReviewCard from '@/features/review/components/ReviewCard';
import useAuthStore from '@/features/auth/store';
import { deleteReview, patchReview } from '@/lib/actions/review';
import type { ReviewItem } from '@/types/review';

const modalMessage = {
  editSuccess: '구매 후기 수정이 완료되었습니다.',
  editFail: '구매 후기 수정에 실패했습니다.',
  deleteSuccess: '구매 후기 삭제가 완료되었습니다.',
  deleteFail: '구매 후기 삭제에 실패하였습니다.',
};

type ModalType = 'editSuccess' | 'editFail' | 'deleteSuccess' | 'deleteFail' | null;

export default function Review({ reviewList }: { reviewList: ReviewItem[] }) {
  // 완료/실패 모달
  const [modal, setModal] = useState<ModalType>(null);
  // 삭제 확인 모달
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState(0);

  const { user } = useAuthStore();
  const router = useRouter();

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5;
  const totalPages = Math.ceil(reviewList.length / limit);
  const pagedReviewList = reviewList.slice((page - 1) * limit, page * limit);

  // 구매 후기 삭제
  const handleDelete = (_id: number) => {
    startTransition(async () => {
      try {
        await deleteReview(_id);
        setIsDeleteConfirmModalOpen(false);
        // 목록 새로고침
        router.refresh();
        setTimeout(() => {
          setModal('deleteSuccess');
        }, 200);
      } catch (error) {
        setIsDeleteConfirmModalOpen(false);
        setModal('deleteFail');
        console.error(error);
      }
    });
  };

  // 구매 후기 수정
  const handleEdit = (_id: number, rating: number, content: string) => {
    startTransition(async () => {
      try {
        await patchReview(_id, rating, content);
        router.refresh();
        setEditingId(0);
        setModal('editSuccess');
      } catch (error) {
        setModal('editFail');
        console.error(error);
      }
    });
  };

  return (
    <div>
      {!reviewList.length ? (
        <div className="flex flex-col items-center py-8 border-b-1 border-b-lightgray text-darkgray">
          <MessageCircleMore className="mb-4" size={32} />
          <p>작성된 구매 후기가 없습니다.</p>
        </div>
      ) : (
        pagedReviewList.map(review => (
          <ReviewCard
            key={review._id}
            name={review.user.name}
            createdAt={review.createdAt.split(' ')[0]}
            rating={review.rating}
            content={review.content}
            isMyReview={review.user._id === user?._id}
            handleDelete={() => {
              setIsDeleteConfirmModalOpen(true);
              setSelectedId(review._id);
            }}
            handleEdit={() => {
              setEditingId(review._id);
            }}
            handleSave={(newRating, newContent) => handleEdit(review._id, newRating, newContent)}
            handleCancel={() => {
              setEditingId(0);
            }}
            isEditing={review._id === editingId}
          ></ReviewCard>
        ))
      )}
      {reviewList.length ? <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /> : null}

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteConfirmModalOpen}
        handleClose={() => setIsDeleteConfirmModalOpen(false)}
        handleConfirm={() => selectedId && handleDelete(selectedId)}
        description="정말 삭제하시겠습니까?"
      ></Modal>

      {/* 완료/실패 모달 */}
      {modal && (
        <Modal
          isOpen={!!modal}
          handleClose={() => {
            setModal(null);
          }}
          handleConfirm={() => {
            setModal(null);
          }}
          description={modalMessage[modal]}
          hideCancelButton
        ></Modal>
      )}
    </div>
  );
}
