import { create } from "zustand";
import { AxiosAuth } from "../http/setup";
import { devtools } from "zustand/middleware";
import { UserRole } from "../types";

interface MainInterface {
  user: {
    fullname: string;
    email: string;
    id: string;
    role: "ADMIN" | "MANAGER" | "USER";
  } | null;

  fetchUserItself: () => Promise<void>;
  logoutUserItself: () => Promise<void>;
  isAuthenticating: boolean;
}

const useMainStore = create<MainInterface>()(
  devtools((set) => ({
    user: null,
    isAuthenticating: true,

    async fetchUserItself() {
      set({ isAuthenticating: true });

      try {
        const response = await AxiosAuth.get("/self");
        if (
          [UserRole.ADMIN, UserRole.MANAGER].includes(response.data.user.role)
        ) {
          set({ user: response.data.user, isAuthenticating: false });
          return;
        }

        await AxiosAuth.post("/logout");
        set({ user: null, isAuthenticating: false });
      } catch {
        set({ user: null, isAuthenticating: false });
      }
    },
    async logoutUserItself() {
      await AxiosAuth.post("/logout");
      set({
        user: null,
        isAuthenticating: false,
      });
    },
  })),
);

export default useMainStore;
