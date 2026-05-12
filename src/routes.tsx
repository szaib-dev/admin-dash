import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/login/login";
import RegisterPage from "./pages/auth/register/register";
import AuthLayout from "./pages/auth/layout";
import Homepage from "./pages/home/home";
import HomeLayout from "./pages/home/layout";
import RootLayout from "./pages/layout";
import UsersPage from "./pages/users/UsersPage";
import TenantsPage from "./pages/tenants/TenantPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            path: "/",
            element: <Homepage />,
          },
          {
            path: '/users',
            element: <UsersPage />
          },
          {
            path: '/resturants',
            element: <TenantsPage />
          }
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
    ],
  },
]);

export default router;
