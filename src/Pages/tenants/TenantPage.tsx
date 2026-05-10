import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { GetAllTenants } from "@/http/api";

import { useQuery } from "@tanstack/react-query";
import {  FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import DialogComponent from "./DialogComponent";

interface Tenant {
  id: string;
  name: string;
  address: string;
}

function TenantsPage() {
  const callTenants = async () => {
    const response = await GetAllTenants();
    return response.data.list as Tenant[];
  }; 
  const {
    data = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: callTenants,
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
    <div className=" bg-gray-100  ">
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
              <BreadcrumbPage>Resturants</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="w-full py-3 flex justify-between items-center bg-white px-4 rounded-sm ">
          <div className="flex gap-12">
            <div className="relative w-xs">
              <FiSearch className="absolute size-5 text-gray-400 top-1/2 z-10 left-3 transform -translate-y-1/2 " />
              <input
                type="text"
                onChange={(e)=> console.log(e.target.value)}
                className="size-full border border-gray-300 outline-none px-3 pl-10 rounded-lg bg-white py-2"
              />
            </div>

            <Select onValueChange={(value) => console.log(value)}>
              <SelectTrigger className="cursor-pointer ">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem className="cursor-pointer" value="ACTIVE">
                    ACTIVE
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="BAN">
                    BAN
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="USER">
                    PENDING
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        <DialogComponent />
        </div>

        <Card className="h-[calc(100vh-260px)] overflow-y-scroll ">
            <CardContent>
                <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ResturantId</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.address}</TableCell>
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

export default TenantsPage;
