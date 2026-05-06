import type { CredentialType } from "../types";
import { AxiosAuth } from "./setup";

// Auth
const AuthLogin = async(data: CredentialType) => await AxiosAuth.post('/api/user/login', data)
const AuthRegister = async(data: CredentialType) => await AxiosAuth.post('/api/user/register', data)


export {
    AuthLogin,
    AuthRegister
}