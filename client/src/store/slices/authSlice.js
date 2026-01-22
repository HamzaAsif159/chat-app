import { api } from "@/lib/api";
import { GET_USER_INFO } from "@/utils.js/constant";

export const createAuthSlice = (set, get) => ({
  userInfo: null,
  loading: false,
  initializeAuth: async () => {
    const { userInfo } = get();
    if (userInfo?._id) return;

    try {
      set({ loading: true });
      const response = await api.get(GET_USER_INFO, { withCredentials: true });

      if (response.data?.user?._id) {
        set({ userInfo: response.data.user });
      } else {
        set({ userInfo: null });
      }
    } catch (error) {
      console.log(error)
      set({ userInfo: null });
    } finally {
      set({ loading: false });
    }
  },
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUser: () => set({ userInfo: null }),
});
