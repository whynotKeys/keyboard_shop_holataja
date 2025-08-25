import React from 'react';
import { X } from 'lucide-react'; // Lucide 아이콘 import
import Button from './Button';

// 부모 컴포넌트로부터 전달할 props 타입 정의
interface ModalProps {
  isOpen: boolean; // 모달 열림 여부
  handleClose: () => void; // 모달 닫기/취소 처리 함수
  handleConfirm: () => void; // 확인 처리 함수
  title?: string; // 모달 제목(동적)
  description: string; // 모달 본문 메세지(동적)
  hideCancelButton?: boolean; // 취소 버튼 숨기기 여부
  isChoiceModal?: boolean; // 선택 모달 여부
  choiceOptions?: string[]; // 선택 모달 버튼 텍스트
}

export default function Modal({
  isOpen,
  handleClose,
  handleConfirm,
  title,
  description,
  hideCancelButton,
  isChoiceModal,
  choiceOptions,
}: ModalProps) {
  // 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  if (isOpen) {
    document.body.style.overflow = 'hidden';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={() => {
        handleClose();
        document.body.style.overflow = 'auto';
      }}
    >
      {/* 모달 박스 */}
      <div className="relative bg-white rounded-lg shadow-lg w-[400px]" onClick={e => e.stopPropagation()}>
        <div className="flex flex-row justify-end w-full bg-white rounded-t-lg">
          {/* 오른쪽 상단 닫기 버튼 */}
          <Button
            onClick={() => {
              handleClose();
              document.body.style.overflow = 'auto';
            }}
            className="pt-2 pe-2"
            size="medium"
            icon
          >
            <X size={24} /> {/* Lucide X 아이콘 */}
          </Button>
        </div>
        <div className="px-6">
          {/* 모달 제목 */}
          <h2 className="mb-4 text-center sub-title">{title}</h2>

          {/* 모달 본문 */}
          <p className="mb-6 text-center whitespace-pre-line label-m">{description}</p>

          {/* 버튼 그룹 */}
          <div className="flex justify-center gap-4 pb-5">
            <>
              {/* 취소 버튼 */}
              {!hideCancelButton && (
                <Button
                  outlined
                  onClick={() => {
                    handleClose();
                    document.body.style.overflow = 'auto';
                  }}
                  size="medium"
                >
                  {isChoiceModal ? choiceOptions?.[0] : '취소'}
                </Button>
              )}
              {/* 확인 버튼 */}
              <Button
                onClick={() => {
                  handleConfirm();
                  document.body.style.overflow = 'auto';
                }}
                size="medium"
              >
                {isChoiceModal ? choiceOptions?.[1] : '확인'}
              </Button>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
