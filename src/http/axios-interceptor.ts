import { AxiosAuth } from "./setup";

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
