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

import { useQuery } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoryData, ProductData, TenantData } from "@/types";
import DialogComponent from "./DialogComponent";
import DeleteAlertDialog from "./DeleteAlertDialog";
import api from "@/http/api";
import { Switch } from "@/components/ui/switch";

function ProductsPage() {
  const [searchParam, setSearchParam] = useSearchParams();

  const productName = searchParam.get("productName") || "";
  const tenantId = searchParam.get("tenantId") || "";
  const categoryId = searchParam.get("categoryId") || "";
  const isPublished = searchParam.get("isPublished") === "true";

const updateFilters = (next: {
  productName?: string;
  categoryId?: string;
  tenantId?: string;
  isPublished?: boolean;
}) => {
  const nextProductName = next.productName ?? productName;
  const nextCategoryId = next.categoryId ?? categoryId;
  const nextTenantId = next.tenantId ?? tenantId;
  const nextIsPublished = next.isPublished ?? isPublished;

  const params = new URLSearchParams();

  if (nextProductName.trim()) {
    params.set("productName", nextProductName.trim());
  }

  if (nextCategoryId.trim()) {
    params.set("categoryId", nextCategoryId.trim());
  }

  if (nextTenantId.trim()) {
    params.set("tenantId", nextTenantId.trim());
  }

  if (nextIsPublished) {
    params.set("isPublished", "true");
  }

  setSearchParam(params);
};

  const getProducts = async () => {
    const response = await api.product.list(searchParam);
    return response.data.list as ProductData[];
  };

  const getCategories = async()=>{
    const response = await api.category.list();
    return response.data.list as CategoryData[]
  }

  const getTenants = async()=>{
    const response = await api.tenant.GetAllTenants();
    return response.data.list as TenantData[]
  }

  const { data = [], error } = useQuery<ProductData[], Error>({
    queryKey: ["products", productName, categoryId, tenantId, isPublished],
    queryFn: getProducts,
  });
  const {data: tenants} = useQuery<TenantData[]>({
    queryKey: ['tenants'],
    queryFn: getTenants
  })

  const {data: categories} = useQuery<CategoryData[]>({
    queryKey: ['categories'],
    queryFn: getCategories
  })

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
        
        {/* Category Filter */}
            <Select
              value={categoryId || "ALL"}
              onValueChange={(value) =>
                updateFilters({
                  categoryId: value === "ALL" ? "" : value ,
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
                     {categories && categories.length > 0 && categories.map(category => {
                      return (
                    
                  <SelectItem key={category._id} className="cursor-pointer" value={category._id}>
                    {category.name}
                  </SelectItem>
                 )
                     })}
                </SelectGroup>
              </SelectContent>
            </Select>

        {/* Tenant Filter */}
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
                 {tenants && tenants.length > 0 && tenants.map(tenant => (
                  <SelectItem key={tenant.id} className="cursor-pointer" value={tenant.id}>
                    {tenant.name}
                  </SelectItem>
                 ))}
                </SelectGroup>
              </SelectContent>
            </Select>
        {/* Switch Button */}
         <div className="flex items-center  gap-2 border px-3 rounded-sm">
             <Switch
               checked={isPublished}
               onCheckedChange={(checked) => updateFilters({ isPublished: checked })}
               className="data-[state=checked]:bg-orange-500"
             />
              <label className="text-sm">isPublished</label>
         </div>
          </div>
          <DialogComponent isCreating={true} />
        </div>

        <Card className="h-[calc(100vh-260px)] overflow-y-scroll ">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((product: ProductData) => {
                  return (
                    <TableRow key={product._id}>
                      <TableCell><img src={product.imageUrl} className="size-12 object-cover" /></TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.isPublished ? <span className="py-1 px-1 text-gray-600 bg-green-600/40 text-center uppercase  rounded-sm">Published</span> : <span className="py-1 px-1 text-gray-600 bg-red-600/40  rounded-sm text-center uppercase">UnPublished</span>}</TableCell>
                      {/* <TableCell>
                        <DialogComponent
                          isCreating={false}
                          UpdateMemberData={product}
                        />
                      </TableCell> */}
                      <TableCell>
                        <DeleteAlertDialog productId={product._id} />
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
