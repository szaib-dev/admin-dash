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
import {
  createTenantSchema,
  type CreateTenantValues,
} from "@/validation/dashboard";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

type TenantFormErrors = Partial<Record<keyof CreateTenantValues, string>>;

const initialFormData: CreateTenantValues = {
  name: "",
  address: "",
};

function DialogComponent() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateTenantValues>(initialFormData);
  const [errors, setErrors] = useState<TenantFormErrors>({});
  const queryClient = useQueryClient()

  const setFieldValue = <K extends keyof CreateTenantValues>(
    field: K,
    value: CreateTenantValues[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFieldValue(name as keyof CreateTenantValues, value);
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
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
    await CreateTenant(parsed.data)
    queryClient.invalidateQueries({queryKey: ['tenants']})
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
            <FiPlus className="mt-0.5" /> Create Restaurant
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create new restaurant</DialogTitle>
            <DialogDescription>
              Add the restaurant name and address before creating it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
            <div className="space-y-2">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Restaurant name"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? (
                <p className="text-sm text-red-600">{errors.name}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                aria-invalid={Boolean(errors.address)}
                className="min-h-28"
              />
              {errors.address ? (
                <p className="text-sm text-red-600">{errors.address}</p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="cursor-pointer rounded-2xl bg-orange-600 hover:bg-orange-700"
            >
              Create Restaurant
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DialogComponent;
