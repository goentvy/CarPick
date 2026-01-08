import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
    persist(
        (set) => ({
            user: null,              // { id, name, email, membershipGrade } 등
            accessToken: null,       // JWT 토큰
            isLoggedIn: false,

            // 로그인 시 회원 정보 + 토큰 저장
            login: ({ user, accessToken }) =>
                set({
                    user,
                    accessToken,
                    isLoggedIn: true,
                }),

            // 로그아웃 시 초기화
            logout: () =>
                set({
                    user: null,
                    accessToken: null,
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
