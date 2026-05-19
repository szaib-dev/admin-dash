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
import api from "@/http/api";
import type { TenantData } from "@/types";
import { getRequestErrorMessage } from "@/validation/auth";
import {
  createTenantSchema,
  type CreateTenantValues,
} from "@/validation/dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiMapPin,
  FiPlus,
} from "react-icons/fi";
import { PiStorefront } from "react-icons/pi";

type TenantFormErrors = Partial<Record<keyof CreateTenantValues, string>>;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium text-slate-700">{children}</label>
  );
}

function TenantDialog({
  isCreating,
  UpdateTenantData,
}: {
  isCreating: boolean;
  UpdateTenantData?: TenantData;
}) {
  const queryClient = useQueryClient();
  const closeTimeoutRef = useRef<number | null>(null);

  const initialFormData = useMemo<CreateTenantValues>(() => {
    return {
      name: isCreating ? "" : UpdateTenantData?.name ?? "",
      address: isCreating ? "" : UpdateTenantData?.address ?? "",
    };
  }, [isCreating, UpdateTenantData]);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTenantValues>(initialFormData);
  const [errors, setErrors] = useState<TenantFormErrors>({});

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const createTenant = useMutation({
    mutationFn: api.CreateTenant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tenants"] });

      closeTimeoutRef.current = window.setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 900);
    },
  });

  const updateTenant = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: TenantData;
    }) => {
      return api.UpdateTenantById(id, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tenants"] });

      closeTimeoutRef.current = window.setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 900);
    },
  });

  const activeMutation = isCreating ? createTenant : updateTenant;

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    createTenant.reset();
    updateTenant.reset();
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, initialFormData]);

  useEffect(() => {
    return () => clearCloseTimeout();
  }, []);

  const setFieldValue = <K extends keyof CreateTenantValues>(
    field: K,
    value: CreateTenantValues[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    if (createTenant.isError || createTenant.isSuccess) {
      createTenant.reset();
    }

    if (updateTenant.isError || updateTenant.isSuccess) {
      updateTenant.reset();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFieldValue(name as keyof CreateTenantValues, value);
  };

  const handleCreate = async () => {
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

  const handleUpdate = async () => {
    if (!UpdateTenantData?.id) {
      return;
    }

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

    await updateTenant.mutateAsync({
      id: UpdateTenantData.id,
      data: parsed.data,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isCreating) {
      await handleCreate();
    } else {
      await handleUpdate();
    }
  };

  const statusMessage = activeMutation.isSuccess
    ? isCreating
      ? "Restaurant created successfully. Closing form..."
      : "Restaurant updated successfully. Closing form..."
    : activeMutation.isError
      ? getRequestErrorMessage(activeMutation.error)
      : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        clearCloseTimeout();
        setOpen(nextOpen);

        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={isCreating ? "ghost" : "secondary"}
          className="flex cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        >
          {isCreating ? (
            <>
              <FiPlus className="mt-0.5" /> Create restaurant
            </>
          ) : (
            "Edit"
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl border border-slate-200 bg-white p-0 shadow-2xl sm:max-w-2xl">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-xl font-semibold text-slate-900">
              {isCreating ? "Create New Restaurant" : "Update Restaurant"}
            </DialogTitle>

            <DialogDescription className="text-sm text-slate-500">
              {isCreating ? "Add" : "Edit"} the core restaurant details before
              saving it to the dashboard.
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
                activeMutation.isSuccess
                  ? "flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                  : "flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              }
            >
              {activeMutation.isSuccess ? (
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
              disabled={activeMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={activeMutation.isPending || activeMutation.isSuccess}
              className={
                activeMutation.isSuccess
                  ? "rounded-xl bg-green-600 hover:bg-green-600"
                  : "rounded-xl bg-slate-900 hover:bg-slate-800"
              }
            >
              {activeMutation.isPending ? (
                <FiLoader className="animate-spin" />
              ) : activeMutation.isSuccess ? (
                <FiCheckCircle />
              ) : null}

              <span>
                {activeMutation.isPending
                  ? isCreating
                    ? "Creating restaurant..."
                    : "Updating restaurant..."
                  : activeMutation.isSuccess
                    ? isCreating
                      ? "Created"
                      : "Updated"
                    : isCreating
                      ? "Create restaurant"
                      : "Update restaurant"}
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TenantDialog;