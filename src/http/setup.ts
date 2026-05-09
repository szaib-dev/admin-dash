import { create } from "axios";

export const AxiosAuth = create({
  baseURL: `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/user`,
  withCredentials: true,
});

export const AxiosMembers = create({
    baseURL: `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/member`,
    withCredentials: true
})

export const AxiosTenants = create({
    baseURL: `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/tenant`,
    withCredentials: true
})

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
        return Promise.reject(refreshError)
     }

    }

     return Promise.reject(err);
  },
);
