'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import useAuthStore from '@/features/auth/store';
import { userPatchAction } from '@/lib/actions/auth';
import type { User } from '@/types/user';

type UserDataType = Pick<User, '_id' | 'name' | 'email' | 'phone' | 'address'>;

export default function UserInfo() {
  const { user, setUser, hasHydrated } = useAuthStore(); //유저 값 불러오기
  const [userData, setUserData] = useState<UserDataType>(
    user || {
      _id: 0,
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  );
  const [isdisabled, setIsdisabled] = useState(true);
  const [actionState, formAction] = useActionState(userPatchAction, null);
  const router = useRouter();

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (userData) {
      setUserData(prev => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsdisabled(false);
  };
  const handlesubmit = async (userData: FormData) => {
    if (isdisabled) {
      return;
    }

    formAction(userData);
  };

  useEffect(() => {
    if (!hasHydrated) return;
    if (user) {
      setUserData({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return; // hydration 끝난 이후에 유저 정보 확인하도록 함

    if (user === null) {
      alert('로그인 정보가 없습니다. 로그인 페이지로 이동합니다.');
      router.push('/auth/login');
    }
  }, [user, hasHydrated, router]);

  useEffect(() => {
    if (actionState?.ok === 1) {
      setUserData(actionState.item);
      const updatedUser = {
        ...user,
        ...actionState.item,
      };
      setUser(updatedUser); // 직접 값 전달
      alert('회원 정보가 수정되었습니다.');
      setIsdisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionState, setUser]);

  return (
    <div>
      <form className="flex flex-col gap-4 sm:w-3/5 mt-[-32px]" action={handlesubmit}>
        <Input id="id" type="number" name="_id" defaultValue={userData._id} readOnly hidden />
        <Input id="email" name="email" type="email" defaultValue={userData.email} readOnly hidden />
        <Input id="name" label="이름" name="name" type="text" value={userData.name} onChange={handleInputChange('name')} disabled={isdisabled} />
        <div className="flex items-center justify-between">
          <span className="min-w-[93px] shrink-0 label-m">이메일</span>
          <span className="w-full px-4 py-2.5 border-lightgray border rounded-md bg-disabled text-darkgray">{userData.email}</span>
        </div>

        <Input id="phone" label="연락처" name="phone" type="tel" value={userData.phone} onChange={handleInputChange('phone')} disabled={isdisabled} />
        <Input
          id="address"
          label="주소"
          name="address"
          type="text"
          value={userData.address}
          onChange={handleInputChange('address')}
          disabled={isdisabled}
        />
        <div className="flex justify-end">
          {isdisabled ? (
            <Button onClick={handleEditClick} size="medium">
              수정하기
            </Button>
          ) : (
            <Button submit size="medium">
              수정완료
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
