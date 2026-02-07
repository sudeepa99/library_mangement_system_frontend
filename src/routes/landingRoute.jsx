import { Navigate } from "react-router-dom";

import Homepage from "../pages/Homepage";
import { useAuth } from "../contexts/authContext";

const LandingRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Homepage />;
  }

  if (user.role === "librarian") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/member/dashboard" replace />;
};

export default LandingRoute;
