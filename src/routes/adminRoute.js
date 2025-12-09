import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const AdminRoute = () => {
  const { user, isAdmin } = useAuth();

  return isAdmin() ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
