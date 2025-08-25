'use client';

import React, { startTransition, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Check, CircleAlert, Pencil, Trash, X } from 'lucide-react';

import Button from '@/components/ui/Button';
import CheckboxButton from '@/components/ui/CheckboxButton';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { deleteQnA, patchQnA } from '@/lib/actions/qna';
import { getAnswer } from '@/lib/api/qna';
import useAuthStore from '@/features/auth/store';
import type { AnswerItem, QuestionItem } from '@/types/qna';

const modalMessage = {
  editSuccess: 'Q&A 수정이 완료되었습니다.',
  editFail: 'Q&A 수정에 실패했습니다.',
  deleteSuccess: 'Q&A 삭제가 완료되었습니다.',
  deleteFail: 'Q&A 삭제에 실패하였습니다.',
};

type ModalType = 'editSuccess' | 'editFail' | 'deleteSuccess' | 'deleteFail' | null;

function QnA({ qnaList, my }: { qnaList: QuestionItem[]; my?: boolean }) {
  const selectOptions = ['답변 대기', '답변 완료'];

  const [isMyQnA, setIsMyQnA] = useState(false);
  const [selectedValue, setSelectedValue] = useState('답변 상태');
  const [isOpen, setIsOpen] = useState(0);
  const [answers, setAnswers] = useState<{ [id: number]: AnswerItem }>({});

  // 삭제 확인 모달
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // 완료/실패 모달
  const [modal, setModal] = useState<ModalType>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState(0);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [error, setError] = useState({ title: false, content: false });

  const { user } = useAuthStore();
  const router = useRouter();

  // 답변 상태별 Q&A 필터링
  const qnaFilteredByAnswer =
    selectedValue === '답변 대기'
      ? qnaList.filter(qna => qna.repliesCount === 0)
      : selectedValue === '답변 완료'
        ? qnaList.filter(qna => qna.repliesCount > 0)
        : qnaList;

  // 내 QnA 보기 필터링 적용
  const qnaFilteredByUser = isMyQnA ? qnaFilteredByAnswer.filter(qna => user?._id === qna.user._id) : qnaFilteredByAnswer;

  // 클릭한 질문글 답변 조회
  const showAnswer = async (questionId: number) => {
    if (answers[questionId]) return;

    const res = await getAnswer(questionId);
    if (res.ok === 1 && res.item.length) setAnswers(prev => ({ ...prev, [questionId]: res.item[0] }));
  };

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5;
  const totalPages = Math.ceil(qnaFilteredByUser.length / limit);
  const pagedQnaList = qnaFilteredByUser.slice((page - 1) * limit, page * limit);

  // Q&A 삭제
  const handleDelete = (_id: number) => {
    startTransition(async () => {
      try {
        await deleteQnA(_id);
        setIsConfirmModalOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        setIsConfirmModalOpen(false);
        setModal('deleteFail');
      }
    });
  };

  // Q&A 수정
  const handleEdit = (_id: number, title: string, content: string) => {
    startTransition(async () => {
      try {
        await patchQnA(_id, title, content);
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
    <div className="text-[14px]">
      <div className="flex flex-col gap-2 mb-4 sm:gap-4 sm:items-center sm:flex-row">
        <p className="hidden me-auto sm:block">{my ? 'Q&A 답변 현황을 확인해보세요.' : '상품에 대한 문의사항을 남겨주세요.'}</p>
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div>
            {my ? (
              ''
            ) : (
              <CheckboxButton
                id="myQna"
                name="myQna"
                checked={isMyQnA}
                onChange={() => {
                  setIsMyQnA(!isMyQnA);
                }}
                label="내 Q&A 보기"
              />
            )}
          </div>
          <Select
            label="답변 여부"
            showLabel={false}
            name="isAnswer"
            id="isAnswer"
            options={selectOptions}
            selectedValue={selectedValue}
            placeholder="답변 상태"
            size="small"
            onChange={e => {
              setSelectedValue(e.target.value);
            }}
          ></Select>
        </div>
      </div>
      <div>
        {/* 웹: 테이블 형식 */}
        <div className="hidden w-full overflow-auto sm:block whitespace-nowrap">
          <table className="w-full border-b-1 border-text">
            <thead className="border-t-2 border-y">
              <tr>
                <th className="p-4">제목</th>
                {my ? '' : <th className="p-4 ">작성자</th>}
                <th className="p-4 ">작성일</th>
                <th className="p-4 ">답변상태</th>
                {my ? <th className="px-2 py-4 ">문의 제품</th> : ''}
              </tr>
            </thead>
            <tbody>
              {!qnaFilteredByUser.length ? (
                <tr>
                  <td colSpan={4} align="center" className="py-8 text-darkgray">
                    <CircleAlert className="mb-4" size={32} />
                    <p>작성된 Q&A가 없습니다.</p>
                  </td>
                </tr>
              ) : (
                pagedQnaList.map(qna => (
                  <React.Fragment key={qna._id}>
                    <tr
                      className="border-b border-b-lightgray"
                      onClick={() => {
                        if (editingId !== 0) return;
                        setIsOpen(isOpen === qna._id ? 0 : qna._id);
                        if (isOpen !== qna._id) showAnswer(qna._id);
                      }}
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          if (e.key === ' ') e.preventDefault();
                          if (editingId !== 0) return;
                          setIsOpen(isOpen === qna._id ? 0 : qna._id);
                          if (isOpen !== qna._id) showAnswer(qna._id);
                        }
                      }}
                    >
                      <td className="p-4">
                        {editingId === qna._id ? (
                          <>
                            <Input
                              id="title"
                              name="title"
                              type="text"
                              value={newTitle}
                              onChange={e => {
                                setNewTitle(e.currentTarget.value);
                              }}
                            ></Input>
                            {error.title && <p className="mt-1 label-s text-negative">2글자 이상 입력해야 합니다.</p>}
                          </>
                        ) : (
                          <span className="block overflow-hidden truncate cursor-pointer whitespace-nowrap">{qna.title}</span>
                        )}
                      </td>
                      {my ? '' : <td className="p-4 text-center">{qna.user.name}</td>}
                      <td className="p-4 text-center">{qna.createdAt?.split(' ')[0]}</td>
                      {qna.repliesCount > 0 ? (
                        <td className="p-4 text-center text-primary">답변 완료</td>
                      ) : (
                        <td className="p-4 text-center text-darkgray">답변 대기</td>
                      )}
                      {my ? (
                        <td className="text-center">
                          <Link
                            href={`/products/${qna.product_id}?tap=3`}
                            className=" py-1 px-2 w-[2rem] border-1 border-primary rounded-lg transition duration-200 ease-in-out bg-white text-primary hover:bg-accent"
                          >
                            보러 가기
                          </Link>
                        </td>
                      ) : (
                        ''
                      )}
                    </tr>
                    {isOpen === qna._id && (
                      <tr className="p-4 border-b bg-lightgray border-b-lightgray">
                        <td colSpan={4} className="p-4 bg-lightgray">
                          <div className={`flex gap-2 ${qna.repliesCount > 0 && 'mb-4'}`}>
                            <span className="content-center inline-block w-6 h-6 text-xs font-semibold text-center bg-white rounded-full shrink-0 text-primary">
                              Q
                            </span>
                            {editingId === qna._id ? (
                              <div className="w-full">
                                <Textarea
                                  id="content"
                                  name="content"
                                  value={newContent}
                                  onChange={e => {
                                    setNewContent(e.currentTarget.value);
                                  }}
                                />
                                {error.content && <p className="mt-1 label-s text-negative ">2글자 이상 입력해야 합니다.</p>}
                              </div>
                            ) : (
                              <p className="block break-words whitespace-pre-wrap">{qna.content}</p>
                            )}
                            {user?._id === qna.user._id && (
                              <div className="flex ms-auto">
                                {editingId === qna._id ? (
                                  <>
                                    <Button
                                      icon
                                      size="small"
                                      aria-label="저장"
                                      onClick={() => {
                                        if (newTitle.trim().length < 2 || newContent.trim().length < 2) {
                                          setError({ title: newTitle.trim().length < 2, content: newContent.trim().length < 2 });
                                        } else {
                                          setError({ title: false, content: false });
                                          handleEdit(qna._id, newTitle, newContent);
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
                                        setNewTitle(qna.title);
                                        setNewContent(qna.content);
                                        setError({ title: false, content: false });
                                        setEditingId(0);
                                      }}
                                    >
                                      <X color="var(--color-darkgray)" size={20} />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    {' '}
                                    <Button
                                      icon
                                      size="small"
                                      aria-label="수정"
                                      onClick={() => {
                                        setEditingId(qna._id);
                                        setNewTitle(qna.title);
                                        setNewContent(qna.content);
                                      }}
                                    >
                                      <Pencil color="var(--color-darkgray)" size={20} />
                                    </Button>
                                    <Button
                                      icon
                                      size="small"
                                      aria-label="삭제"
                                      onClick={() => {
                                        setSelectedId(qna._id);
                                        setIsConfirmModalOpen(true);
                                      }}
                                    >
                                      <Trash color="var(--color-darkgray)" size={20} />
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          {answers[qna._id] && (
                            <div className="flex gap-2">
                              <span className="content-center inline-block w-6 h-6 text-xs font-semibold text-center text-white rounded-full shrink-0 bg-primary">
                                A
                              </span>
                              <div>
                                <p className="block mb-2 break-words whitespace-pre-wrap">
                                  안녕하세요. <br />
                                  {answers[qna._id].content}
                                  <br />
                                  <br />
                                  올라타자 담당자 드림.
                                </p>
                                <span className="text-xs text-darkgray">{answers[qna._id].createdAt?.split(' ')[0]}</span>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 모바일: 카드 형식 */}
        <div className="block sm:hidden">
          {!qnaFilteredByUser.length ? (
            <div className="py-8 text-center text-darkgray">
              <CircleAlert className="mx-auto mb-4" size={32} />
              <p>작성된 Q&A가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {pagedQnaList.map(qna => (
                <div key={qna._id} className="overflow-hidden border border-gray-200 rounded-lg">
                  <div
                    className="p-4 bg-white cursor-pointer"
                    onClick={() => {
                      if (editingId !== 0) return;
                      setIsOpen(isOpen === qna._id ? 0 : qna._id);
                      if (isOpen !== qna._id) showAnswer(qna._id);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        {editingId === qna._id ? (
                          <div>
                            <Input
                              id="title"
                              name="title"
                              type="text"
                              value={newTitle}
                              onChange={e => {
                                setNewTitle(e.currentTarget.value);
                              }}
                            />
                            {error.title && <p className="mt-1 label-s text-negative">2글자 이상 입력해야 합니다.</p>}
                          </div>
                        ) : (
                          <h3 className="font-medium truncate">{qna.title}</h3>
                        )}
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        {qna.repliesCount > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-accent text-primary">
                            답변 완료
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-lightgray">답변 대기</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {!my && <span>{qna.user.name}</span>}
                        <span>{qna.createdAt?.split(' ')[0]}</span>
                      </div>
                      {my && (
                        <Link
                          href={`/products/${qna.product_id}`}
                          className="px-2 py-1 text-xs border rounded border-primary text-primary hover:bg-accent"
                          onClick={e => e.stopPropagation()}
                        >
                          보러 가기
                        </Link>
                      )}
                    </div>
                  </div>

                  {isOpen === qna._id && (
                    <div className="p-4 border-t bg-accent border-t-gray">
                      <div className={`flex gap-2 ${qna.repliesCount > 0 && 'mb-4'}`}>
                        <span className="content-center inline-block w-6 h-6 text-xs font-semibold text-center bg-white rounded-full shrink-0 text-primary">
                          Q
                        </span>
                        {editingId === qna._id ? (
                          <div className="w-full">
                            <Textarea
                              id="content"
                              name="content"
                              value={newContent}
                              onChange={e => {
                                setNewContent(e.currentTarget.value);
                              }}
                            />
                            {error.content && <p className="mt-1 label-s text-negative">2글자 이상 입력해야 합니다.</p>}
                          </div>
                        ) : (
                          <p className="flex-1 block break-words whitespace-pre-wrap">{qna.content}</p>
                        )}
                        {user?._id === qna.user._id && (
                          <div className="flex flex-col gap-1">
                            {editingId === qna._id ? (
                              <>
                                <Button
                                  icon
                                  size="small"
                                  aria-label="저장"
                                  onClick={() => {
                                    if (newTitle.trim().length < 2 || newContent.trim().length < 2) {
                                      setError({
                                        title: newTitle.trim().length < 2,
                                        content: newContent.trim().length < 2,
                                      });
                                    } else {
                                      setError({ title: false, content: false });
                                      handleEdit(qna._id, newTitle, newContent);
                                    }
                                  }}
                                >
                                  <Check color="var(--color-darkgray)" size={16} />
                                </Button>
                                <Button
                                  icon
                                  size="small"
                                  aria-label="취소"
                                  onClick={() => {
                                    setNewTitle(qna.title);
                                    setNewContent(qna.content);
                                    setError({ title: false, content: false });
                                    setEditingId(0);
                                  }}
                                >
                                  <X color="var(--color-darkgray)" size={16} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  icon
                                  size="small"
                                  aria-label="수정"
                                  onClick={() => {
                                    setEditingId(qna._id);
                                    setNewTitle(qna.title);
                                    setNewContent(qna.content);
                                  }}
                                >
                                  <Pencil color="var(--color-darkgray)" size={16} />
                                </Button>
                                <Button
                                  icon
                                  size="small"
                                  aria-label="삭제"
                                  onClick={() => {
                                    setSelectedId(qna._id);
                                    setIsConfirmModalOpen(true);
                                  }}
                                >
                                  <Trash color="var(--color-darkgray)" size={16} />
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {answers[qna._id] && (
                        <div className="flex gap-2">
                          <span className="content-center inline-block w-6 h-6 text-xs font-semibold text-center text-white rounded-full shrink-0 bg-primary">
                            A
                          </span>
                          <div>
                            <p className="block mb-2 break-words whitespace-pre-wrap">
                              안녕하세요. <br />
                              {answers[qna._id].content}
                              <br />
                              <br />
                              올라타자 담당자 드림.
                            </p>
                            <span className="text-xs text-darkgray">{answers[qna._id].createdAt?.split(' ')[0]}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {qnaFilteredByUser.length ? <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /> : null}
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isConfirmModalOpen}
        handleClose={() => setIsConfirmModalOpen(false)}
        handleConfirm={() => selectedId && handleDelete(selectedId)}
        description="정말 삭제하시겠습니까?"
      ></Modal>

      {/* 완료/실패 모달 */}
      {modal && (
        <Modal
          isOpen={!!modal}
          handleClose={() => setModal(null)}
          handleConfirm={() => setModal(null)}
          description={modalMessage[modal]}
          hideCancelButton
        ></Modal>
      )}
    </div>
  );
}

export default QnA;
