import { create } from "axios";
import useMainStore from "../store/MainStore";

export const AxiosAuth = create({
  baseURL: `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/user`,
  withCredentials: true,
});

AxiosAuth.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;
    if (
      err.response?.status === 401 &&
      originalRequest.url !== "/refresh-tokens" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
     try {
         await AxiosAuth.get("/refresh-tokens");
      return AxiosAuth(originalRequest);
     } catch (refreshError) {
        useMainStore.getState().logoutUserItself();
        return Promise.reject(refreshError)
     }

    }

     return Promise.reject(err);
  },
);
