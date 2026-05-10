import useMainStore from "@/store/MainStore";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";

function Navbar() {
  const { user } = useMainStore();
  const tenantName = user?.tenant?.name ?? "ADMIN";
  const userInitial = user?.fullname?.charAt(0).toUpperCase() ?? "A";
  const userLabel = user?.fullname ? `${user.fullname.slice(0, 4)}...` : "Admin";

  return (
    <div className="flex justify-between items-center px-8 py-6.5 border-b  bg-white" >
      <div >
        <Badge className="h-6 bg-amber-500/50 text-black/50 px-5">
          {tenantName}
        </Badge>
      </div>

      
      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
        <Avatar>
        <AvatarFallback className="bg-orange-500/30 text-gray-500 flex justify-center items-center">
          {userInitial}
        </AvatarFallback>
      </Avatar>
        <p>{userLabel}</p>

      </div>
    </div>
  );
}

export default Navbar;
