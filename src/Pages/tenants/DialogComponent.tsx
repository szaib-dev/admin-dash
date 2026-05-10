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
import { Textarea } from "@/components/ui/textarea";
import { CreateTenant } from "@/http/api";
import { getRequestErrorMessage } from "@/validation/auth";
import {
  createTenantSchema,
  type CreateTenantValues,
} from "@/validation/dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiMapPin,
  FiPlus,
} from "react-icons/fi";
import { PiStorefront } from "react-icons/pi";

type TenantFormErrors = Partial<Record<keyof CreateTenantValues, string>>;

const initialFormData: CreateTenantValues = {
  name: "",
  address: "",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-slate-700">{children}</label>;
}

function DialogComponent() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTenantValues>(initialFormData);
  const [errors, setErrors] = useState<TenantFormErrors>({});
  const queryClient = useQueryClient();
  const closeTimeoutRef = useRef<number | null>(null);

  const createTenant = useMutation({
    mutationFn: CreateTenant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tenants"] });
      closeTimeoutRef.current = window.setTimeout(() => {
        setOpen(false);
        setFormData(initialFormData);
        setErrors({});
        createTenant.reset();
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

  const setFieldValue = <K extends keyof CreateTenantValues>(
    field: K,
    value: CreateTenantValues[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    if (createTenant.isError || createTenant.isSuccess) {
      createTenant.reset();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFieldValue(name as keyof CreateTenantValues, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = createTenantSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0],
        address: fieldErrors.address?.[0],
      });
      return;
    }

    setErrors({});
    await createTenant.mutateAsync(parsed.data);
  };

  const statusMessage = createTenant.isSuccess
    ? "Restaurant created successfully. Closing form..."
    : createTenant.isError
      ? getRequestErrorMessage(createTenant.error)
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
            createTenant.reset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <FiPlus className="mt-0.5" /> Create restaurant
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl border border-slate-200 bg-white p-0 shadow-2xl sm:max-w-2xl">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <DialogHeader className="gap-1">
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Create New Restaurant
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Add the core restaurant details before saving it to the dashboard.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
            <div className="space-y-2">
              <FieldLabel>Restaurant name</FieldLabel>
              <div className="relative">
                <PiStorefront className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter restaurant name"
                  aria-invalid={Boolean(errors.name)}
                  className="h-11 rounded-xl border-slate-200 bg-white pl-11"
                />
              </div>
              {errors.name ? (
                <p className="text-sm text-red-600">{errors.name}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <FieldLabel>Address</FieldLabel>
              <div className="relative">
                <FiMapPin className="pointer-events-none absolute top-4 left-4 size-4 text-slate-400" />
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full restaurant address"
                  aria-invalid={Boolean(errors.address)}
                  className="min-h-32 rounded-xl border-slate-200 bg-white pl-11"
                />
              </div>
              {errors.address ? (
                <p className="text-sm text-red-600">{errors.address}</p>
              ) : null}
            </div>

            {statusMessage ? (
              <div
                className={
                  createTenant.isSuccess
                    ? "flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                    : "flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                }
              >
                {createTenant.isSuccess ? (
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
                disabled={createTenant.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTenant.isPending || createTenant.isSuccess}
                className={
                  createTenant.isSuccess
                    ? "rounded-xl bg-green-600 hover:bg-green-600"
                    : "rounded-xl bg-slate-900 hover:bg-slate-800"
                }
              >
                {createTenant.isPending ? (
                  <FiLoader className="animate-spin" />
                ) : createTenant.isSuccess ? (
                  <FiCheckCircle />
                ) : null}
                <span>
                  {createTenant.isPending
                    ? "Creating restaurant..."
                    : createTenant.isSuccess
                      ? "Created"
                      : "Create restaurant"}
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
