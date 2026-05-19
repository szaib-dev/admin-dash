import type { CredentialType, TenantData, UserData } from "../types";
import type {
  CreateTenantValues,
  CreateUserValues,
} from "../validation/dashboard";
import { AxiosAuth, AxiosCategory, AxiosMember, AxiosProduct, AxiosTenant } from "./setup";

export default {
  // Auth
  auth: {
    AuthLogin: async (data: CredentialType) => AxiosAuth.post("/login", data),

    AuthRegister: async (data: CredentialType) =>
      AxiosAuth.post("/register", data),
  },

  // Members
  user: {
GetMemberById: async (memberId: string) =>
    AxiosMember.get(`/list/${memberId}`),

  UpdateMemberById: async (memberId: string, data: UserData) =>
    AxiosMember.patch(`/update/${memberId}`, data),

  DeleteMemberById: async (memberId: string) =>
    AxiosMember.delete(`/delete/${memberId}`),

  CreateNewMember: (data: CreateUserValues) =>
    AxiosMember.post("/create", data),

   GetAllMembers: async (searchName?: string, role?: string) => {
    const params: Record<string, string> = {};

    if (searchName?.trim()) {
      params.searchName = searchName.trim();
    }

    if (role?.trim()) {
      params.role = role.trim();
    }

    return AxiosMember.get(`/list`, { params });
  },
  },
  // Tenants
  tenant: {
     GetAllTenants: async (searchName?: string) =>
    AxiosTenant.get("/list", {
      params: searchName?.trim() ? { searchName: searchName.trim() } : {},
    }),

  GetTenantById: async () => AxiosTenant.get("/list"),
  UpdateTenantById: async (tenantId: string, data: TenantData) =>
    AxiosTenant.patch(`/update/${tenantId}`, data),
  DeleteTenantById: async (tenantId: string) =>
    AxiosTenant.delete(`/delete/${tenantId}`),
  CreateTenant: async (data: CreateTenantValues) =>
    AxiosTenant.post("/create", data),
  },

  // Products 
  product: {
    list: async(params) => await AxiosProduct.get(`/list`,{
      params
    }),
    delete: async(id: string)=> await AxiosProduct.delete(`/delete/${id}`)
  },

  category: {
    list: async()=> await AxiosCategory.get(`/list`)
  }
  }

