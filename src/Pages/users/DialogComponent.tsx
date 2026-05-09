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
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

function DialogComponent() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    tenantId: "",
  });

  const getTenants = async () => {
    const response = await GetAllTenants();
    return response.data.list;
  };
  interface GetTenantsInterface {
    error: boolean;
    data: {
      id: string;
      name: string;
      address: string;
    }[];
  }
  const { data, error }: GetTenantsInterface = useQuery({
    queryKey: ["tenants"],
    queryFn: getTenants,
  });

  console.log(error);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(formData);
  };
  return (
    <div>
      {" "}
      <Dialog>
        <DialogTrigger>
          <Button variant="ghost" className="flex cursor-pointer items-center">
            <FiPlus className="mt-0.5" /> Create users
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new users and assign roles?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <Input
            name="fullname"
            onChange={handleChange}
            placeholder="Fullname"
          />
          <Input name="email" onChange={handleChange} placeholder="Email" />
          <Input
            name="password"
            onChange={handleChange}
            placeholder="Password"
          />
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="MANAGER">MANAGER</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, tenantId: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Resturant" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {data && data.length > 0 && data.map((tenant) => (
                  <SelectItem value={tenant.id}>{tenant.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} className="cursor-pointer">
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DialogComponent;
