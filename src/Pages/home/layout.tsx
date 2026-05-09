import { Navigate, Outlet } from "react-router-dom";
import useMainStore from "../../store/MainStore";
import Navbar from "../../components/Layout/Navbar";
import Sidebar from "../../components/Layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

function HomeLayout() {
  const { user } = useMainStore();
  const isAuthenticating = useMainStore((state) => state.isAuthenticating);

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  if (user === null && !isAuthenticating) {
    return <Navigate to={"/auth/login"} />;
  }



  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
         <Sidebar />
        <div className="flex flex-col size-full">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default HomeLayout;
