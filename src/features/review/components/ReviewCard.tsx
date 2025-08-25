import React, { useState } from 'react';

import { Check, Pencil, Trash, X } from 'lucide-react';

import Rating from '@/app/products/[id]/_components/Rating';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';

import '@/app/globals.css';

interface ReviewCardProps {
  name: string;
  createdAt: string;
  rating: number;
  content: string;
  isMyReview?: boolean;
  handleDelete: () => void;
  handleEdit: () => void;
  handleSave: (newRating: number, newContent: string) => void;
  handleCancel: () => void;
  isEditing: boolean;
}

function ReviewCard({
  name,
  createdAt,
  rating,
  content,
  isMyReview,
  handleDelete,
  handleEdit,
  handleSave,
  handleCancel,
  isEditing,
}: ReviewCardProps) {
  const [newRating, setNewRating] = useState(rating);
  const [newContent, setNewContent] = useState(content);
  const [error, setError] = useState(false);

  return (
    <>
      <div className="relative flex items-center w-full py-4 border-b-1 border-b-disabled">
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-col">
            <span>{name}</span>
            <span className="label-s text-secondary">{createdAt.split(' ')[0]}</span>
          </div>
          <div className="flex gap-0.5">
            <span className="sr-only">{`별점 ${newRating}/5점`}</span>
            <Rating rating={newRating} setRating={(newRating: number) => setNewRating(newRating)} editable={isEditing} />
          </div>
          <div>
            {isEditing ? (
              <div>
                <label htmlFor="content" className="sr-only">
                  내용
                </label>
                <Textarea id="content" name="content" value={newContent} onChange={e => setNewContent(e.target.value)}></Textarea>
                {error && <p className="mt-1 label-s text-negative">2글자 이상 입력해야 합니다.</p>}
              </div>
            ) : (
              <p>{newContent}</p>
            )}
          </div>
        </div>
        {isMyReview && (
          <div className="absolute right-0 flex top-4">
            {isEditing ? (
              <>
                <Button
                  icon
                  size="small"
                  aria-label="저장"
                  onClick={() => {
                    if (newContent.trim().length < 2) {
                      setError(true);
                    } else {
                      setError(false);
                      handleSave(newRating, newContent);
                    }
                  }}
                >
                  <Check color="var(--color-darkgray)" size={20} />
                </Button>
                <Button
                  icon
                  size="small"
                  aria-label="취소"
                  onClick={() => {
                    setNewRating(rating);
                    setNewContent(content);
                    handleCancel();
                  }}
                >
                  <X color="var(--color-darkgray)" size={20} />
                </Button>
              </>
            ) : (
              <>
                <Button icon size="small" aria-label="수정" onClick={handleEdit}>
                  <Pencil color="var(--color-darkgray)" size={20} />
                </Button>
                <Button icon size="small" aria-label="삭제" onClick={handleDelete}>
                  <Trash color="var(--color-darkgray)" size={20} />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ReviewCard;
