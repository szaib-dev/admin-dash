import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useMainStore from "../../store/MainStore";

function HomeLayout() {
  const {user} = useMainStore()

  if(user === null){
    return <Navigate to={'/auth/login'} />
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default HomeLayout;
