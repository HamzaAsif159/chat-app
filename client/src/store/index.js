import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./slices/authSlice";

export const useAppStore = create(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    {
      name: "auth-storage", // key for localStorage
      partialize: (state) => ({ userInfo: state.userInfo }), // only persist userInfo
    },
  ),
);
