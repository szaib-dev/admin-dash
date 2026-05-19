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
import { GetAllMembers } from "@/http/api";

import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { UserData } from "@/types";
import DialogComponent from "./DialogComponent";
import DeleteAlertDialog from "./DeleteAlertDialog";

interface Members {
  fullname: string;
  email: string;
  id: string;
  role: string;
}

function ProductsPage() {
  const [searchParam, setSearchParam] = useSearchParams();

  const productName = searchParam.get("productName") || "";
  const tenantId = searchParam.get("tenantId") || "";
  const categoryId = searchParam.get("categoryId") || "";

  const updateFilters = (next: {productName?: string, categoryId?: string; tenantId?: string }) => {
    const params = new URLSearchParams();

    if (next.categoryId?.trim()) {
      params.set("categoryId", next.categoryId.trim());
    }
    if (next.productName?.trim()) {
      params.set("productName", next.productName.trim());
    }

    if (next.tenantId?.trim()) {
      params.set("tenantId", next.tenantId.trim());
    }

    setSearchParam(params);
  };

  const callMembers = async () => {
    const response = await GetAllMembers(productName, role);
    return response.data.list as Members[];
  };
  const { data = [], error } = useQuery<Members[], Error>({
    queryKey: ["members", productName, role],
    queryFn: callMembers,
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
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="w-full py-3 flex justify-between items-center bg-white px-4 rounded-sm ">
          <div className="flex gap-12">
            <div className="relative w-xs">
              <FiSearch className="absolute size-5 text-gray-400 top-1/2 z-10 left-3 transform -translate-y-1/2 " />
              <input
                type="text"
                value={productName}
                placeholder="Search products..."
                onChange={(e) => {
                  const value = e.target.value;
                  updateFilters({ productName: value});
                }}
                className="size-full border border-gray-300 outline-none px-3 pl-10 rounded-lg bg-white py-2"
              />
            </div>

            <Select
              value={categoryId || "ALL"}
              onValueChange={(value) =>
                updateFilters({
                  categoryId: value === "ALL" ? "" : value,
                })
              }
            >
              <SelectTrigger className="cursor-pointer ">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem className="cursor-pointer" value="ALL">
                    ALL
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="MANAGER">
                    GUN ZOOR
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="USER">
                    RESTAR
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={tenantId || "ALL"}
              onValueChange={(value) =>
                updateFilters({
                  tenantId: value === "ALL" ? "" : value,
                })
              }
            >
              <SelectTrigger className="cursor-pointer ">
                <SelectValue placeholder="Resturants" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem className="cursor-pointer" value="ALL">
                    ALL
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="MANAGER">
                    Resturant 1
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="USER">
                    Resturant 2
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogComponent isCreating={true} />
        </div>

        <Card className="h-[calc(100vh-260px)] overflow-y-scroll ">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>UserId</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Edit</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((product: UserData) => {
                  return (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.fullname}</TableCell>
                      <TableCell>{product.email}</TableCell>
                      <TableCell>{product.role}</TableCell>
                      <TableCell>
                        <DialogComponent
                          isCreating={false}
                          UpdateMemberData={product}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteAlertDialog userId={product.id} />
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

export default ProductsPage;
