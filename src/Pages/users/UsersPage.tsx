import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GetAllMembers } from "@/http/api";

import { useQuery } from "@tanstack/react-query";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Members {
  fullname: string;
  email: string;
  id: string;
  role: string;
}

function UsersPage() {
  const callMembers = async () => {
    const response = await GetAllMembers();
    return response.data.list as Members[];
  };

  const {
    data = [],
    isPending,
    error,
  } = useQuery<Members[], Error>({
    queryKey: ["members"],
    queryFn: callMembers,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center size-full">
        <h1 className=" animate-pulse text-3xl">Loading</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center size-full">
        <h1 className=" text-3xl">
          Something went wrong please contact development team to fix this issue
        </h1>
      </div>
    );
  }

  return (
    <div className=" bg-gray-100">
      <div className=" flex flex-col gap-4 p-4">
        <Breadcrumb className="py-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to={"/"}>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="w-full py-3 flex justify-between items-center bg-white px-4 rounded-sm ">
          <div className="flex gap-12">
            <div className="relative w-xs">
              <FiSearch className="absolute size-5 text-gray-400 top-1/2 z-10 left-3 transform -translate-y-1/2 " />
              <input
                type="text"
                className="size-full border border-gray-300 outline-none px-3 pl-10 rounded-lg bg-white py-2"
              />
            </div>

            <Select>
              <SelectTrigger className="cursor-pointer ">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem className="cursor-pointer" value="MANAGER">
                    MANAGER
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="ADMIN">
                    ADMIN
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="USER">
                    USER
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Dialog>
            <DialogTrigger>
              <Button
                variant="ghost"
                className="flex cursor-pointer items-center"
              >
                <FiPlus className="mt-0.5" /> Create users
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new users and assign roles?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>

              <Input placeholder="Fullname" />
              <Input placeholder="Email" />
              <Input placeholder="Password" />
              <Select>
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
              <Button className="cursor-pointer">Submit</Button>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
            <CardContent>
                <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UserId</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.fullname}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Button variant="secondary" className="cursor-pointer">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UsersPage;
