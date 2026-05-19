export type CredentialType = {
  fullname?: string;
  email: string;
  password: string;
};

export const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  USER: "USER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface TenantData {
  id?: string,
  name: string,
  address: string
}
export interface  UserData {
  id?: string
  fullname: string
  email: string,
  role: "MANAGER" | "USER"
  tenant?: TenantData }


  export interface ProductData {
  _id: string
  name: string
  description: string
  isPublished: boolean
  imageUrl: string
  tenantId: string
  categoryId: string
  __v: number
}

export interface CategoryData {
  _id: string;
  name: string;
}