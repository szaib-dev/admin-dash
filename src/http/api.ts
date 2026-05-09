import type { CredentialType } from "../types";
import { AxiosAuth, AxiosMembers, AxiosTenants } from "./setup";

// Auth
const AuthLogin = async (data: CredentialType) =>
  AxiosAuth.post("/login", data);
const AuthRegister = async (data: CredentialType) =>
  AxiosAuth.post("/register", data);

// Members

const GetAllMembers = async () => AxiosMembers.get("/list");
const GetMemberById = async (memberId: string) =>
  AxiosMembers.get(`/list/${memberId}`);

const UpdateMemberById = async (memberId: string) =>
  AxiosMembers.patch(`/update/${memberId}`);
const DeleteMemberById = async (memberId: string) =>
  AxiosMembers.delete(`/delete/${memberId}`);

// Tenants 
const GetAllTenants = async () => AxiosTenants.get("/list");
const GetTenantById = async () => AxiosTenants.get("/list");
const UpdateTenantById = async () => AxiosTenants.get("/list");
const DeleteTenantById = async () => AxiosTenants.get("/list");

export {
  AuthLogin,
  AuthRegister,

  GetAllMembers,
  GetMemberById,
  UpdateMemberById,
  DeleteMemberById,

  GetAllTenants,
  GetTenantById,
  UpdateTenantById,
  DeleteTenantById,


  
};
