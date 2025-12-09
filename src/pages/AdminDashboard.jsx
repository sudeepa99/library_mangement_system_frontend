import Header from "../components/Header";
import SideBar from "../components/Sidebar";
import AdminDashboardContent from "../components/AdminDashboardContent";

const AdminDashboard = () => {
  return (
    <div className="bg-white px-[5%] py-[2%] h-screen overflow-hidden">
      <div className="border-2">
        <Header />
      </div>

      <div className="flex gap-8 w-full mt-[2%] h-[calc(100%-100px)] ">
        <div className="w-64 border-2   shadow-md  rounded-md ">
          <SideBar />
        </div>

        <div className="flex-1 border-2  overflow-y-auto rounded-md shadow-md scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 hover:scrollbar-thumb-blue-600">
          <AdminDashboardContent />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
