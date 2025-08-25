import NextAuth from 'next-auth'; // Importing the auth handler
import Kakao from 'next-auth/providers/kakao';
import Google from 'next-auth/providers/google'; // Importing the auth middleware
import { createOAuthUserAction, loginWithOAuth } from '@/lib/actions/auth';
import type { OAuthUser, User } from '@/types/user'; // Importing the user type

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [Kakao, Google],
  callbacks: {
    async signIn({ user, account, profile /* credentials */ }) {
      // console.log(user, account, profile, credentials);
      switch (account?.provider) {
        case 'credentials':
          // console.log('id/pwd 로그인', user);
          break;
        case 'kakao':
        case 'naver':
        case 'google':
          // console.log('OAuth 로그인', user);
          let userInfo: User | null = null;
          try {
            // 자동 회원 가입
            const newUser: OAuthUser = {
              type: 'user',
              loginType: account.provider,
              name: user.name || undefined,
              email: user.email || undefined,
              image: user.image || undefined,
              // 인증 제공자에서 받은 정보를 extra 객체에 저장
              extra: { ...profile, providerAccountId: account.providerAccountId },
            };

            // 이미 가입된 회원이면 회원가입이 되지 않고 에러를 응답하므로 무시하면 됨
            await createOAuthUserAction(newUser);

            // 자동 로그인
            const resData = await loginWithOAuth(account.providerAccountId);
            if (resData.ok) {
              userInfo = resData.item;
              // console.log('자동로그인', userInfo);
            } else {
              // API 서버의 에러 메시지 처리
              throw new Error(resData.message);
            }
          } catch (err) {
            console.error(err);
            throw err;
          }

          user.id = String(userInfo._id);
          user.type = userInfo.type;
          user.accessToken = userInfo.token!.accessToken;
          user.refreshToken = userInfo.token!.refreshToken;
          break;

        default:
          console.warn('알 수 없는 로그인 방식입니다:', account?.provider);
          throw new Error('알 수 없는 로그인 방식입니다.');
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.type = token.type as string;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      return session;
    },
  },
});
