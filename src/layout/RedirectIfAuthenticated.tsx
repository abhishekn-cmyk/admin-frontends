import useAuthStore from "@/store/authStore";
import { Navigate, Outlet } from "react-router";

const RedirectIfAuthenticated = () => {
  const { token } = useAuthStore();

  if (token) return <Navigate to="/dashboard" />;

  return <Outlet />;
};

export default RedirectIfAuthenticated;
