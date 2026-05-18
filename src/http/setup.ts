import { create } from "axios";

const AUTH_SERVICE = '/api/auth'

export const AxiosAuth = create({
  baseURL: `${import.meta.env.VITE_AUTH_SERVICE_URL}${AUTH_SERVICE}/api/user`,
  withCredentials: true,
});

export const AxiosMembers = create({
    baseURL: `${import.meta.env.VITE_AUTH_SERVICE_URL}${AUTH_SERVICE}/api/member`,
    withCredentials: true
})

export const AxiosTenants = create({
    baseURL: `${import.meta.env.VITE_AUTH_SERVICE_URL}${AUTH_SERVICE}/api/tenant`,
    withCredentials: true
})


// const CATALOG_SERVICE='/api/catalog'


