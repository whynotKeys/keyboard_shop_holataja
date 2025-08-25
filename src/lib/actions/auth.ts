'use server';

import type { User, OAuthUser } from '@/types/user';
import type { ApiResPromise, ApiRes } from '@/types/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signIn } from '@/app/auth/login/socialAuth';

//로그인 액션
export async function loginAction(prevState: ApiRes<User> | null, formData: FormData): ApiResPromise<User> {
  let response: Response;
  let data: ApiRes<User>;
  try {
    const loginData = {
      email: formData.get('email'),
      password: formData.get('password'),
    };
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-id': process.env.NEXT_PUBLIC_API_CLIENT_ID!,
      },
      body: JSON.stringify(loginData),
    });

    data = await response.json();
    // console.log('위치 액션', data);
    if (data.ok === 1) {
      (await cookies()).set('accessToken', data.item.token?.accessToken as string, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      (await cookies()).set('refreshToken', data.item.token?.refreshToken as string, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      delete data.item.token;
    }
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message: '일시적인 네트워크 문제가 발생했습니다.',
    };
  }
  return data;
}

//회원가입 액션
export async function signupAction(prevState: ApiRes<User> | null, formData: FormData): ApiResPromise<User> {
  let response: Response;
  let data: ApiRes<User>;

  try {
    const signupData = {
      type: 'user',
      email: formData.get('email'),
      name: formData.get('name'),
      password: formData.get('password'),
      phone: formData.get('phone'),
      address: formData.get('address'),
    };
    // 서버에서 API 호출
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-id': process.env.NEXT_PUBLIC_API_CLIENT_ID!,
      },
      body: JSON.stringify(signupData),
    });

    data = await response.json();
    // console.log(data);
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message: '일시적인 네트워크 문제가 발생했습니다.',
    };
  }
  return data;
}

//회원정보 수정 액션
export async function userPatchAction(prevState: ApiRes<User> | null, formData: FormData): ApiResPromise<User> {
  const accessToken = (await cookies()).get('accessToken')?.value;
  let response: Response;
  let data: ApiRes<User>;
  // console.log('유저 정보 수정 액션', formData);
  try {
    const userId = formData.get('_id');
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
    };
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'client-id': process.env.NEXT_PUBLIC_API_CLIENT_ID!,
        ...(accessToken && { authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(userData),
    });
    data = await response.json();
    // console.log(data);
  } catch (error) {
    console.error(error);
    return {
      ok: 0,
      message: '일시적인 네트워크 문제가 발생했습니다.',
    };
  }
  return data;
}
//로그아웃 액션
export async function logout() {
  const cookieStore = await cookies();

  // 서버에서 쿠키 삭제
  cookieStore.set('accessToken', '', { expires: new Date(0), path: '/' });
  cookieStore.set('refreshToken', '', { expires: new Date(0), path: '/' });

  // 로그인 페이지로 리다이렉트
  redirect('/auth/login');
}

// OAuth 사용자 회원가입 액션
export async function createOAuthUserAction(user: OAuthUser): ApiResPromise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup/oauth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': process.env.NEXT_PUBLIC_API_CLIENT_ID!,
    },
    body: JSON.stringify(user),
  });

  return res.json();
}

// OAuth 로그인 액션
export async function loginWithOAuth(providerAccountId: string): ApiResPromise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login/with`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Client-Id': process.env.NEXT_PUBLIC_API_CLIENT_ID!,
    },
    body: JSON.stringify({ providerAccountId }),
  });
  return res.json();
}

export async function loginWithAuthjs(provider: string, formData: FormData) {
  // 로그인 후에 이동해야 할 페이지(redirect 파라미터) 추출
  const redirectTo = (formData.get('redirect') as string) || '/';

  await signIn(provider, { redirectTo });
}
