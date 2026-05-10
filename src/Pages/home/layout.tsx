import { Navigate, Outlet } from "react-router-dom";
import useMainStore from "../../store/MainStore";
import Navbar from "../../components/Layout/Navbar";
import Sidebar from "../../components/Layout/Sidebar";

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
    <div className="flex h-screen overflow-hidden w-full bg-slate-50">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default HomeLayout;
