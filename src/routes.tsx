import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./Pages/auth/login/login";
import RegisterPage from "./Pages/auth/register/register";
import AuthLayout from "./Pages/auth/layout";
import Homepage from "./Pages/home/home";
import HomeLayout from "./Pages/home/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
