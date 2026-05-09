import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useMainStore from "../store/MainStore";

function RootLayout() {
  const { fetchUserItself } = useMainStore();

  useEffect(() => {
    void fetchUserItself();
  }, [fetchUserItself]);

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default RootLayout;
