import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice } from "./slices/authSlice";
import { createChatSlice } from "./slices/chatSlice";

export const useAppStore = create(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createChatSlice(...a),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ userInfo: state.userInfo }),
    },
  ),
);
