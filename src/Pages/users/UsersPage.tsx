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
import type { UserData } from "@/types";
import DialogComponent from "./DialogComponent";
import DeleteAlertDialog from "./DeleteAlertDialog";
import api from "@/http/api";

function UsersPage() {
  const [searchParam, setSearchParam] = useSearchParams();

  const searchName = searchParam.get("searchName") || "";
  const role = searchParam.get("role") || "";

  const updateFilters = (next: { searchName?: string; role?: string }) => {
    const params = new URLSearchParams();

    if (next.searchName?.trim()) {
      params.set("searchName", next.searchName.trim());
    }

    if (next.role?.trim()) {
      params.set("role", next.role.trim());
    }

    setSearchParam(params);
  };

  const callMembers = async () => {
    const response = await api.user.GetAllMembers(searchName, role);
    return response.data.list as UserData[];
  };
  const { data = [], error } = useQuery<UserData[], Error>({
    queryKey: ["members", searchName, role],
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
                value={searchName}
                placeholder="Search members..."
                onChange={(e) => {
                  const value = e.target.value;
                  updateFilters({ searchName: value, role });
                }}
                className="size-full border border-gray-300 outline-none px-3 pl-10 rounded-lg bg-white py-2"
              />
            </div>

            <Select
              value={role || "ALL"}
              onValueChange={(value) =>
                updateFilters({
                  searchName,
                  role: value === "ALL" ? "" : value,
                })
              }
            >
              <SelectTrigger className="cursor-pointer ">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem className="cursor-pointer" value="ALL">
                    ALL
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="MANAGER">
                    MANAGER
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="USER">
                    USER
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
                {data.map((member: UserData) => {
                  return (
                    <TableRow key={member.id}>
                      <TableCell>{member.id}</TableCell>
                      <TableCell>{member.fullname}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <DialogComponent
                          isCreating={false}
                          UpdateMemberData={member}
                        />
                      </TableCell>
                      <TableCell>
                        <DeleteAlertDialog userId={member.id} />
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
