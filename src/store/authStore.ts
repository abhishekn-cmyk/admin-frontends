import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token?: string | null;
  name: string | null;
  email: string | null;
  login: (payload: Partial<AuthState>) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      name: null,
      email: null,
      login: (payload) =>
        set((state) => ({
          token: payload.token ?? state.token,
          name: payload.name ?? state.name,
          email: payload.email ?? state.email,
        })),
      logout: () =>
        set({
          token: null,
          name: null,
          email: null,
        }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        token: state.token,
        name: state.name,
        email: state.email,
      }),
    },
  ),
);

export default useAuthStore;
