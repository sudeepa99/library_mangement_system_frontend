import { useEffect, useState } from "react";

import dashboardIcon from "../assets/icons/house.png";
import booksIcon from "../assets/icons/book-open-check.png";
import borrowingIcon from "../assets/icons/circle-dot.png";
import categoriesIcon from "../assets/icons/tag.png";
import userMngIcon from "../assets/icons/users.png";
import reportsIcon from "../assets/icons/chart-no-axes-column.png";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { authApi } from "../api/auth";
import { toast } from "react-toastify";
const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [userRole, setUserRole] = useState("");

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await authApi.getMe();
  //       const role = res.data.role;
  //       setUserRole(role);
  //       setActiveTab(getActiveTabFromRoute(location.pathname, role));
  //     } catch {
  //       setUserRole(null);
  //     }
  //   };

  //   fetchUser();
  // }, [location.pathname]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role);
      setActiveTab(getActiveTabFromRoute(location.pathname, user.role));
    }
  }, [location.pathname]);

  const getActiveTabFromRoute = (path, role) => {
    if (role === "member") {
      if (path === "/member/dashboard") return "Catalogue";
      if (path === "/member/myBorrowing") return "My Borrowings";
      if (path === "/member/history") return "History";
    } else {
      if (path === "/admin/dashboard") return "Dashboard";
      if (path === "/admin/books") return "Books Management";
      if (path === "/admin/borrowings") return "Borrowings & Returns";
      if (path === "/admin/categories") return "Categories";
      if (path === "/admin/users") return "Users Management";
      if (path === "/admin/reports") return "Reports & Analytics";
    }
    return "";
  };

  const menuItems =
    userRole === "member"
      ? [
          { name: "Catalogue", path: "/member/dashboard", icon: dashboardIcon },
          {
            name: "My Borrowings",
            path: "/member/myBorrowing",
            icon: borrowingIcon,
          },
          { name: "History", path: "/member/history", icon: reportsIcon },
        ]
      : [
          { name: "Dashboard", path: "/admin/dashboard", icon: dashboardIcon },
          { name: "Books Management", path: "/admin/books", icon: booksIcon },
          {
            name: "Borrowings & Returns",
            path: "/admin/borrowings",
            icon: borrowingIcon,
          },
          {
            name: "Categories",
            path: "/admin/categories",
            icon: categoriesIcon,
          },
          { name: "Users Management", path: "/admin/users", icon: userMngIcon },
          {
            name: "Reports & Analytics",
            path: "/admin/reports",
            icon: reportsIcon,
          },
        ];

  const handleNavigation = (item) => {
    setActiveTab(item.name);
    navigate(item.path);
  };

  const handleLogout = async () => {
    try {
      const response = await authApi.logout();
      toast.success(response.message || "Logged out successfully");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="w-64">
      <div className="flex flex-col space-y-2 px-4 py-4">
        {menuItems.map((item, index) => {
          const isActive = activeTab === item.name;
          if (!userRole) return null;
          return (
            <button
              key={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
              onClick={() => handleNavigation(item)}
            >
              <img
                src={item.icon}
                className={`h-5 w-5 
                ${activeTab === item.name ? "filter invert" : ""}`}
                alt="sidebar_icon"
              />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
      <div className="px-4 py-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
