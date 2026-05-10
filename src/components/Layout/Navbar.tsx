import useMainStore from "@/store/MainStore";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

function Navbar() {
  const { user } = useMainStore();
  const tenantName = user?.tenant?.name ?? "Dashboard";
  const userInitial = user?.fullname?.charAt(0).toUpperCase() ?? "A";
  const userLabel = user?.fullname ?? "Team member";
  const userRole = user?.role ?? "USER";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4 md:px-8">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Overview
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="truncate text-xl font-semibold text-slate-900">
              {tenantName}
            </h1>
            <Badge className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 shadow-none">
              {userRole}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <Avatar className="size-10">
            <AvatarFallback className="bg-orange-100 text-sm font-semibold text-orange-700">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-right sm:block">
            <p className="max-w-44 truncate text-sm font-semibold text-slate-900">
              {userLabel}
            </p>
            <p className="text-xs text-slate-500">
              Signed in access
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
