import { Metadata } from 'next';
import { Title } from '@/components/ui/Typography';
import LoginForm from './_components/LoginForm';

export const metadata: Metadata = {
  title: '로그인 - HOLATAJA',
  description: 'HOLATAJA에 로그인하세요.',
  robots: 'noindex, nofollow',
};

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center px-20 sm:px-20 sm:max-w-2xl sm:mx-auto">
      <Title className="mx-auto mb-6">로그인</Title>
      <LoginForm />
    </div>
  );
}
