import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Admin {
  id: number;
  email: string;
}

interface AuthStore {
  token: string | null;
  admin: Admin | null;
  setAuth: (token: string, admin: Admin) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      admin: null,

      setAuth: (token, admin) => {
        set({ token, admin });
      },

      clearAuth: () => {
        set({ token: null, admin: null });
      },

      isAuthenticated: () => {
        return get().token !== null;
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
