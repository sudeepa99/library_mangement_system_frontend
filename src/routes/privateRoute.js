import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/authContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  console.log("PrivateRoute - user:", user, "loading:", loading);

  if (loading) {
    console.log("PrivateRoute - showing loading");
    return <div>Loading...</div>;
  }

  console.log("PrivateRoute - redirecting to:", user ? "Outlet" : "/login");
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
