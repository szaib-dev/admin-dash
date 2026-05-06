import { createBrowserRouter } from "react-router-dom";
import HomePage from "./Pages/home/home";
import LoginPage from "./Pages/login/login";
import RegisterPage from "./Pages/register/register";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <RegisterPage />,
  }
]);

export default router;