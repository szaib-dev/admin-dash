import { z } from "zod";

export const createUserSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters long."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long."),
  role: z.enum(["USER", "MANAGER"], {
    error: () => "Please select a role.",
  }),
  tenantId: z.string().min(1, "Please select a restaurant."),
});

export const createTenantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Restaurant name must be at least 2 characters long."),
  address: z
    .string()
    .trim()
    .min(8, "Address must be at least 8 characters long."),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type CreateTenantValues = z.infer<typeof createTenantSchema>;
