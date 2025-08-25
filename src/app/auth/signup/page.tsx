import { Metadata } from 'next';
import { Title } from '@/components/ui/Typography';
import SignupForm from './_components/SignupForm';

export const metadata: Metadata = {
  title: '회원가입 - HOLATAJA',
  description: 'HOLATAJA에 가입하셔서 회원 혜택을 누려보세요.',
  robots: 'noindex, nofollow',
};

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center px-5 sm:px-20 sm:max-w-2xl sm:mx-auto">
      <Title className="mb-6">회원 가입</Title>
      <SignupForm />
    </div>
  );
}
