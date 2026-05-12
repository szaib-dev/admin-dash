import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { FiSearch } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import DialogComponent from "./DialogComponent";
import DeleteAlertDialog from "./DeleteAlertDialog";

interface Tenant {
  id: string;
  name: string;
  address: string;
}

function TenantsPage() {
  const [searchParam, setSearchParam] = useSearchParams();
  const searchName = searchParam.get("searchName") || "";

  const callTenants = async () => {
    const response = await GetAllTenants(searchName);
    return response.data.list as Tenant[];
  };
  const {
    data = [],
    error,
  } = useQuery({
    queryKey: ["tenants", searchName],
    queryFn: callTenants,
  });


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
                value={searchName}
                placeholder="Search restaurants..."
                onChange={(e) => {
                  const value = e.target.value;

                  if (value.trim()) {
                    setSearchParam({ searchName: value });
                  } else {
                    setSearchParam({});
                  }
                }}
                className="size-full border border-gray-300 outline-none px-3 pl-10 rounded-lg bg-white py-2"
              />
            </div>
          </div>
          <DialogComponent isCreating={true} />
        </div>

        <Card className="h-[calc(100vh-260px)] overflow-y-scroll ">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ResturantId</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((tenant) => {
                  return (
                    <TableRow key={tenant.id}>
                      <TableCell>{tenant.id}</TableCell>
                      <TableCell>{tenant.name}</TableCell>
                      <TableCell>{tenant.address}</TableCell>
                      <TableCell>
                        <DialogComponent
                          isCreating={false}
                          UpdateTenantData={tenant}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteAlertDialog tenantId={tenant.id} />
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

export default TenantsPage;
