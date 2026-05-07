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
}

const useMainStore = create<MainInterface>()(
  devtools((set) => ({
    user: null,
    async fetchUserItself() {
      const response = await AxiosAuth.get("/self");
      if (
        [UserRole.ADMIN, UserRole.MANAGER].includes(response.data.user.role)
      ) {
        set({ user: response.data.user });
      } else {
        await AxiosAuth.post("/logout");
        set({ user: null });
      }
    },
    async logoutUserItself() {
      await AxiosAuth.post("/logout");
      set({
        user: null,
      });
    },
  })),
);

export default useMainStore;
