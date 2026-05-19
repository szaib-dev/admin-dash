import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import api from "@/http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function DeleteAlertDialog(props: { tenantId: string }) {
  const tenantId = props.tenantId;

  const deleteUser = async () => {
    return await api.tenant.DeleteTenantById(tenantId);
  };
   const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, error, isSuccess, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });
       setOpen(false);
    },
  });

  return (
    <div>
      <AlertDialog open={open} onOpenChange={(open) => isSuccess && !open}>
        <AlertDialogTrigger className="flex justify-center items-cener mt-1" asChild>
          <Button onClick={ ()=> setOpen(true) } variant="destructive" className="cursor-pointer">
            Delete
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=> setOpen(false)} disabled={isPending} > Cancel </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                mutate();
              }}
            >
              {isPending ? "Deleting..." : error ? "Retry" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DeleteAlertDialog;
