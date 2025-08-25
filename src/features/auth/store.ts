import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { logout as serverLogout } from '@/lib/actions/auth';
import type { User } from '@/types/user';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  hasHydrated: boolean; // hydration 완료 여부
  setHasHydrated: (value: boolean) => void;
}

const useAuthStore = create(
  persist<UserState>(
    set => ({
      user: null,
      hasHydrated: false,
      setUser: user => set({ user }),
      logout: async () => {
        // 클라이언트 상태 먼저 정리
        set({ user: null });

        // 서버 액션으로 쿠키 삭제 및 리다이렉트
        await serverLogout();
      },
      setHasHydrated: isReady => set({ hasHydrated: isReady }), // hydration 완료 여부를 외부에서 설정
    }),
    {
      name: 'user', //스토리지에 저장될 키 이름
      storage: createJSONStorage(() => sessionStorage), //세션스토리지에 저장
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true); // 상태 복원(hydration) 완료 시 true로 설정
      },
    },
  ),
);

export default useAuthStore;
