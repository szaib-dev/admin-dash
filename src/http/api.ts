import type { CredentialType } from "../types";
import type { CreateTenantValues, CreateUserValues } from "../validation/dashboard";
import { AxiosAuth, AxiosMembers, AxiosTenants } from "./setup";

// Auth
const AuthLogin = async (data: CredentialType) =>
  AxiosAuth.post("/login", data);
const AuthRegister = async (data: CredentialType) =>
  AxiosAuth.post("/register", data);

// Members

const GetAllMembers = async (searchName?: string, role?: string) => {
  const params: Record<string, string> = {};

  if (searchName?.trim()) {
    params.searchName = searchName.trim();
  }

  if (role?.trim()) {
    params.role = role.trim();
  }

  return AxiosMembers.get(`/list`, { params });
};
const GetMemberById = async (memberId: string) =>
  AxiosMembers.get(`/list/${memberId}`);

const UpdateMemberById = async (memberId: string, data) =>
  AxiosMembers.patch(`/update/${memberId}`,data );
const DeleteMemberById = async (memberId: string) =>
  AxiosMembers.delete(`/delete/${memberId}`);
const CreateNewMember = (data: CreateUserValues) => AxiosMembers.post('/create', data)

// Tenants 
const GetAllTenants = async (searchName?: string) =>
  AxiosTenants.get("/list", {
    params: searchName?.trim() ? { searchName: searchName.trim() } : {},
  });
const GetTenantById = async () => AxiosTenants.get("/list");
const UpdateTenantById = async (tenantId: string, data) => AxiosTenants.patch(`/update/${tenantId}`, data);
const DeleteTenantById = async (tenantId: string) => AxiosTenants.delete(`/delete/${tenantId}`);
const CreateTenant = async(data: CreateTenantValues) => AxiosTenants.post('/create', data)

export {
  AuthLogin,
  AuthRegister,

  GetAllMembers,
  GetMemberById,
  UpdateMemberById,
  DeleteMemberById,
  CreateNewMember,

  GetAllTenants,
  GetTenantById,
  UpdateTenantById,
  DeleteTenantById,
  CreateTenant


  
};
