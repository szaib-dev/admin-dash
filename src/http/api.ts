import type { CredentialType } from "../types";
import { AxiosAuth } from "./setup";

// Auth
const AuthLogin = async(data: CredentialType) => await AxiosAuth.post('/login', data)
const AuthRegister = async(data: CredentialType) => await AxiosAuth.post('/register', data)


export {
    AuthLogin,
    AuthRegister
}