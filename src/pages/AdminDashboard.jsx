import { useState } from "react";
import Header from "../components/Header";
import SideBar from "../components/Sidebar";
import AdminDashboardContent from "../components/AdminDashboardContent";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="bg-[#FFFFFF] min-h-screen flex flex-col ">
      <div className="px-[5%] py-[2%] ">
        <Header />
      </div>
      <div className=" flex flex-1 px-[5%] gap-4">
        <div>
          <SideBar />
        </div>
        <div>
          <AdminDashboardContent />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
