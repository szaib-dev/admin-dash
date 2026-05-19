import { create } from "axios";

const AUTH_SERVICE = '/api/auth'
const AUTH_URL = '/api/user'
const MEMBER_URL= '/api/member'
const TENANT_URL = '/api/tenant'


function ApiAxious (SERVICE_NAME, SERVICE_URL){
    return create({
    baseURL: `${import.meta.env.VITE_AUTH_SERVICE_URL}${SERVICE_NAME}${SERVICE_URL}`,
    withCredentials: true
})
}


export const AxiosAuth = ApiAxious(AUTH_SERVICE,AUTH_URL)
export const AxiosMember = ApiAxious(AUTH_SERVICE,MEMBER_URL)
export const AxiosTenant = ApiAxious(AUTH_SERVICE,TENANT_URL)



// const CATALOG_SERVICE='/api/catalog'

const CATALOG_SERVICE="/api/catalog"
const PRODUCT_URL="/api/product"
const CATEGORY_URL="/api/category"

export const AxiosProduct = ApiAxious(CATALOG_SERVICE, PRODUCT_URL)

// PRODUCTS
export const AxiosCategory = ApiAxious(CATALOG_SERVICE, CATEGORY_URL)
