import {create} from "axios"

export const AxiosAuth = create({
    baseURL: `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/user`,
    withCredentials: true
})