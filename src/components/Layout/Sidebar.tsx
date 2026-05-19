import { cn } from "@/lib/utils";
import useMainStore from "@/store/MainStore";
import { FiHome, FiLogOut, FiSettings, FiUsers } from "react-icons/fi";
import { PiStorefront } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { AiOutlineProduct } from "react-icons/ai";

function Sidebar() {
  const { user, logoutUserItself } = useMainStore();

  const items = [
    {
      title: "Home",
      url: "/",
      icon: FiHome,
    },
    {
      title: "Users",
      url: "/users",
      icon: FiUsers,
    },
    {
      title: "Restaurants",
      url: "/resturants",
      icon: PiStorefront,
    },
    {
      title: "Products",
      url: "/products",
      icon: AiOutlineProduct ,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: FiSettings,
    },
  ];

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="border-b border-slate-200 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500">
            <img src="/logo.png" alt="Logo" className="size-6 object-contain" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">Admin Dashboard</p>
            <p className="text-sm text-slate-500">Management panel</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <nav className="space-y-1.5">
          {items.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      isActive
                        ? "bg-orange-100 text-orange-600"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <item.icon className="size-4" />
                  </span>
                  <span>{item.title}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="mb-3 rounded-xl bg-slate-50 px-4 py-3">
          <p className="truncate text-sm font-semibold text-slate-900">
            {user?.fullname ?? "Admin user"}
          </p>
          <p className="truncate text-xs uppercase tracking-wide text-slate-500">
            {user?.role ?? "Manager"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void logoutUserItself();
          }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100">
            <FiLogOut className="size-4" />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
