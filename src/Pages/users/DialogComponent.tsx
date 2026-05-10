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
import { GetAllTenants } from "@/http/api";
import {
  createUserSchema,
  type CreateUserValues,
} from "@/validation/dashboard";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

type UserFormErrors = Partial<Record<keyof CreateUserValues, string>>;

const initialFormData: CreateUserValues = {
  fullname: "",
  email: "",
  password: "",
  role: "USER",
  tenantId: "",
};

function DialogComponent() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateUserValues>(initialFormData);
  const [errors, setErrors] = useState<UserFormErrors>({});

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

  const setFieldValue = <K extends keyof CreateUserValues>(
    field: K,
    value: CreateUserValues[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldValue(name as keyof CreateUserValues, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    console.log(parsed.data);
    setOpen(false);
    setFormData(initialFormData);
  };

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);

          if (!nextOpen) {
            setFormData(initialFormData);
            setErrors({});
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex cursor-pointer items-center rounded-2xl border border-orange-200 bg-orange-50 px-4 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
          >
            <FiPlus className="mt-0.5" /> Create users
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a new user</DialogTitle>
            <DialogDescription>
              Add a user, choose their role, and connect them to a restaurant.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
            <div className="space-y-2">
              <Input
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full name"
                aria-invalid={Boolean(errors.fullname)}
              />
              {errors.fullname ? (
                <p className="text-sm text-red-600">{errors.fullname}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? (
                <p className="text-sm text-red-600">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password ? (
                <p className="text-sm text-red-600">{errors.password}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Select
                value={formData.role}
                onValueChange={(value) => setFieldValue("role", value as "USER" | "MANAGER")}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={Boolean(errors.role)}
                >
                  <SelectValue placeholder="Role" />
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

            <div className="space-y-2">
              <Select
                value={formData.tenantId}
                onValueChange={(value) => setFieldValue("tenantId", value)}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={Boolean(errors.tenantId)}
                >
                  <SelectValue placeholder="Restaurant" />
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
              {errors.tenantId ? (
                <p className="text-sm text-red-600">{errors.tenantId}</p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="cursor-pointer rounded-2xl bg-orange-600 hover:bg-orange-700"
            >
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DialogComponent;
