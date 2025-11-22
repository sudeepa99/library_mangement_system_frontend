import { useState } from "react";
import Header from "../components/Header";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      <Header />
    </div>
  );
};

export default AdminDashboard;
