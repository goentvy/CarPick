import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 회원 정보 store
const useUserStore = create(
  persist(
    (set) => ({
      user: null, // { id, name, email } 형태로 저장
      isLoggedIn: false,

      // 로그인 시 회원 정보 저장
      login: (userData) =>
        set({
          user: userData,
          isLoggedIn: true,
        }),

      // 로그아웃 시 초기화
      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),

      // 회원 정보 업데이트
      updateUser: (newData) =>
        set((state) => ({
          user: { ...state.user, ...newData },
        })),
    }),
    {
      name: 'user-storage', // localStorage key
    }
  )
);

export default useUserStore;
