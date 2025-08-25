'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { z } from 'zod';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { loginAction } from '@/lib/actions/auth';
import useAuthStore from '@/features/auth/store';

// import { signIn } from 'next-auth/react';
// import { loginWithAuthjs } from '@/data/actions/auth';

const loginSchema = z.object({
  email: z.string().min(1, '아이디를 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다'),
});

type FormField = 'email' | 'password';

export default function LoginForm() {
  const initInputState = { email: '', password: '' };
  const initTouchedState = Object.fromEntries(Object.keys(initInputState).map(key => [key, false]));
  const [formData, setFormData] = useState(initInputState);
  const [error, setError] = useState(initInputState);
  const [touched, setTouched] = useState(initTouchedState);
  const { setUser } = useAuthStore();
  const router = useRouter();
  const [actionState, formAction, isPending] = useActionState(loginAction, null);
  const [loginmodal, setLoginModal] = useState(false);

  const validateField = (field: string, value: string) => {
    try {
      const fieldSchema = loginSchema.shape[field as keyof typeof loginSchema.shape];
      fieldSchema.parse(value);
      return '';
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0].message;
      }
      return '입력값을 확인해주세요';
    }
  };

  const updateFieldError = (field: FormField, value?: string) => {
    const fieldValue = value ?? formData[field];
    const errorMessage = validateField(field, fieldValue);
    setError(prev => ({ ...prev, [field]: errorMessage }));
  };

  const handleInputChange = (field: FormField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value, // field가 여기서 객체의 키로 사용됨
    }));
    if (touched[field]) {
      updateFieldError(field, value);
    }
  };

  // 필드를 터치된 것으로 표시
  const handleInputBlur = (field: FormField) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
    updateFieldError(field);
  };

  const handleSubmit = async (formData: FormData) => {
    // 전체 유효성 검사
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const result = loginSchema.safeParse(data);

    let newError = {
      email: '',
      password: '',
    };

    if (!result.success) {
      const zodError = result.error.flatten().fieldErrors;
      newError = {
        email: zodError.email?.[0] || '',
        password: zodError.password?.[0] || '',
      };
    }
    setError(newError);
    return formAction(formData);
  };

  useEffect(() => {
    if (actionState?.ok) {
      setUser(actionState.item);
      setLoginModal(true);
    } else if (actionState?.ok === 0 && !actionState?.errors) {
      setLoginModal(true);
    }
  }, [actionState, router, setUser]);

  return (
    <>
      <form className="flex flex-col w-full gap-6" action={handleSubmit} noValidate>
        <div>
          <Input
            id="id"
            type="email"
            name="email"
            placeholder="이메일"
            gap="gap-4"
            value={formData.email}
            onChange={handleInputChange('email')}
            onBlur={handleInputBlur('email')}
            disabled={isPending}
          />
          {!!error.email && <p className="label-s w-full text-negative mx-[2%] mt-2">{error.email}</p>}
        </div>
        <div>
          <Input
            id="pw"
            type="password"
            name="password"
            placeholder="비밀번호"
            gap="gap-4"
            value={formData.password}
            onChange={handleInputChange('password')}
            onBlur={handleInputBlur('password')}
            disabled={isPending}
          />
          {!!error.password && <p className="label-s w-full text-negative mx-[2%] mt-2">{error.password}</p>}
        </div>
        <Button submit>로그인</Button>
      </form>
      <Link href={'/auth/signup'} className="text-secondary self-start mt-2 text-[14px]">
        회원가입
      </Link>
      <Modal
        isOpen={loginmodal}
        hideCancelButton={true}
        handleClose={() => setLoginModal(false)}
        handleConfirm={() => (actionState?.ok === 1 ? router.push('/products') : setLoginModal(false))}
        title={actionState?.ok === 1 ? '로그인 성공!' : ''}
        description={
          actionState?.ok === 1
            ? `${actionState.item.name}님 \n 오늘도 즐거운 쇼핑하세요! 올라타자♬`
            : actionState?.message || '로그인에 실패했습니다.'
        }
      />

      {/* <div>
        <button
          onClick={() => {
            signIn('kakao');
          }}
        >
          카카오 로그인
        </button>
      </div> */}
    </>
  );
}
