import { Button } from "@/components/ui/button";
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

  const { data = [], isPending, error } = useQuery<Members[], Error>({
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
    <div className="flex size-full bg-white/90">
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
                  <Button variant="secondary">Edit</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default UsersPage;
