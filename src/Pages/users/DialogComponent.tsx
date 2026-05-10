import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateNewMember, GetAllTenants } from "@/http/api";
import { getRequestErrorMessage } from "@/validation/auth";
import {
  createUserSchema,
  type CreateUserValues,
} from "@/validation/dashboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiLock,
  FiMail,
  FiPlus,
  FiUser,
} from "react-icons/fi";
import { PiStorefront } from "react-icons/pi";

type UserFormErrors = Partial<Record<keyof CreateUserValues, string>>;

const initialFormData: CreateUserValues = {
  fullname: "",
  email: "",
  password: "",
  role: "USER",
  tenantId: "",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-slate-700">{children}</label>;
}

function DialogComponent() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateUserValues>(initialFormData);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const queryClient = useQueryClient();
  const closeTimeoutRef = useRef<number | null>(null);

  const getTenants = async () => {
    const response = await GetAllTenants();
    return response.data.list;
  };

  interface Tenant {
    id: string;
    name: string;
    address: string;
  }

  const { data = [] } = useQuery<Tenant[]>({
    queryKey: ["tenants"],
    queryFn: getTenants,
  });

  const createUser = useMutation({
    mutationFn: CreateNewMember,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["members"] });
      closeTimeoutRef.current = window.setTimeout(() => {
        setOpen(false);
        setFormData(initialFormData);
        setErrors({});
        createUser.reset();
      }, 900);
    },
  });

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  useEffect(() => () => clearCloseTimeout(), []);

  const setFieldValue = <K extends keyof CreateUserValues>(
    field: K,
    value: CreateUserValues[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    if (createUser.isError || createUser.isSuccess) {
      createUser.reset();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldValue(name as keyof CreateUserValues, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = createUserSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        fullname: fieldErrors.fullname?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        role: fieldErrors.role?.[0],
        tenantId: fieldErrors.tenantId?.[0],
      });
      return;
    }

    setErrors({});
    await createUser.mutateAsync(parsed.data);
  };

  const statusMessage = createUser.isSuccess
    ? "User created successfully. Closing form..."
    : createUser.isError
      ? getRequestErrorMessage(createUser.error)
      : null;

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          clearCloseTimeout();
          setOpen(nextOpen);

          if (!nextOpen) {
            setFormData(initialFormData);
            setErrors({});
            createUser.reset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <FiPlus className="mt-0.5" /> Create user
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl border border-slate-200 bg-white p-0 shadow-2xl sm:max-w-2xl">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <DialogHeader className="gap-1">
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Create New User
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Add the basic details, choose a role, and assign the user to a restaurant.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel>Full name</FieldLabel>
                <div className="relative">
                  <FiUser className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    aria-invalid={Boolean(errors.fullname)}
                    className="h-11 rounded-xl border-slate-200 bg-white pl-11"
                  />
                </div>
                {errors.fullname ? (
                  <p className="text-sm text-red-600">{errors.fullname}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <FieldLabel>Email address</FieldLabel>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    aria-invalid={Boolean(errors.email)}
                    className="h-11 rounded-xl border-slate-200 bg-white pl-11"
                  />
                </div>
                {errors.email ? (
                  <p className="text-sm text-red-600">{errors.email}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <FieldLabel>Password</FieldLabel>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    aria-invalid={Boolean(errors.password)}
                    className="h-11 rounded-xl border-slate-200 bg-white pl-11"
                  />
                </div>
                {errors.password ? (
                  <p className="text-sm text-red-600">{errors.password}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <FieldLabel>Role</FieldLabel>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFieldValue("role", value as "USER" | "MANAGER")
                  }
                >
                  <SelectTrigger
                    className="h-11 rounded-xl border-slate-200 bg-white"
                    aria-invalid={Boolean(errors.role)}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="USER">USER</SelectItem>
                      <SelectItem value="MANAGER">MANAGER</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.role ? (
                  <p className="text-sm text-red-600">{errors.role}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel>Restaurant</FieldLabel>
              <div className="relative">
                <PiStorefront className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                <Select
                  value={formData.tenantId}
                  onValueChange={(value) => setFieldValue("tenantId", value)}
                >
                  <SelectTrigger
                    className="h-11 rounded-xl border-slate-200 bg-white pl-11"
                    aria-invalid={Boolean(errors.tenantId)}
                  >
                    <SelectValue placeholder="Select restaurant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {data.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {errors.tenantId ? (
                <p className="text-sm text-red-600">{errors.tenantId}</p>
              ) : null}
            </div>

            {statusMessage ? (
              <div
                className={
                  createUser.isSuccess
                    ? "flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                    : "flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                }
              >
                {createUser.isSuccess ? (
                  <FiCheckCircle className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <FiAlertCircle className="mt-0.5 size-4 shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  clearCloseTimeout();
                  setOpen(false);
                }}
                disabled={createUser.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createUser.isPending || createUser.isSuccess}
                className={
                  createUser.isSuccess
                    ? "rounded-xl bg-green-600 hover:bg-green-600"
                    : "rounded-xl bg-slate-900 hover:bg-slate-800"
                }
              >
                {createUser.isPending ? (
                  <FiLoader className="animate-spin" />
                ) : createUser.isSuccess ? (
                  <FiCheckCircle />
                ) : null}
                <span>
                  {createUser.isPending
                    ? "Creating user..."
                    : createUser.isSuccess
                      ? "Created"
                      : "Create user"}
                </span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DialogComponent;
