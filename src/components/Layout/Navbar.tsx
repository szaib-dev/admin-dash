import useMainStore from "@/store/MainStore";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";

function Navbar() {
  const { user } = useMainStore();
  return (
    <div className="flex justify-between items-center px-8">
      <div className="py-4">
        <Badge className="h-6 bg-amber-500/50 text-black/50 px-5">
          {user.tenant && user.tenant.name ? user.tenant.name : "ADMIN"}
        </Badge>
      </div>

      
      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
        <Avatar>
        <AvatarFallback className="bg-orange-500/30 text-gray-500 flex justify-center items-center">
          {user.fullname.charAt(0)}
        </AvatarFallback>
      </Avatar>
        <p>{user.fullname.slice(-4)}..</p>

      </div>
    </div>
  );
}

export default Navbar;
