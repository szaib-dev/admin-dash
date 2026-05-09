import type { CredentialType } from "../types";
import { AxiosAuth, AxiosMembers } from "./setup";

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

export {
  AuthLogin,
  AuthRegister,

  GetAllMembers,
  GetMemberById,

  UpdateMemberById,
  DeleteMemberById,
};
