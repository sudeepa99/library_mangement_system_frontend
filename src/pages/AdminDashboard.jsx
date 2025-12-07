import { useState } from "react";
import Header from "../components/Header";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="bg-[#FFFFFF] min-h-screen ">
      <div className="px-[5%] py-[2%]">
        <Header />
      </div>
    </div>
  );
};

export default AdminDashboard;
