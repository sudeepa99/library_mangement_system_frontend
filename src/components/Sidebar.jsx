import { useState } from "react";

import dashboardIcon from "../assets/icons/house.png";
import booksIcon from "../assets/icons/book-open-check.png";
import borrowingIcon from "../assets/icons/circle-dot.png";
import categoriesIcon from "../assets/icons/tag.png";
import userMngIcon from "../assets/icons/users.png";
import reportsIcon from "../assets/icons/chart-no-axes-column.png";
import { useLocation, useNavigate } from "react-router-dom";
const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTabFromRoute = () => {
    const path = location.pathname;
    if (path === "/admin/dashboard") return "Dashboard";
    if (path === "/admin/books") return "Books Management";
    if (path === "/admin/borrowings") return "Borrowings & Returns";
    if (path === "/admin/categories") return "Categories";
    if (path === "/admin/users") return "Users Management";
    if (path === "/admin/reports") return "Reports & Analytics";
    return "Dashboard";
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromRoute());

  const menuItems = [
    {
      name: "Dashboard",
      icon: dashboardIcon,
      path: "/admin/dashboard",
    },
    {
      name: "Books Management",
      icon: booksIcon,
      path: "/admin/books",
    },
    {
      name: "Borrowings & Returns",
      icon: borrowingIcon,
      path: "/admin/borrowings",
    },
    {
      name: "Categories",
      icon: categoriesIcon,
      path: "/admin/categories",
    },
    {
      name: "Users Management",
      icon: userMngIcon,
      path: "/admin/users",
    },
    {
      name: "Reports & Analytics",
      icon: reportsIcon,
      path: "/admin/reports",
    },
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.name);
    navigate(item.path);
  };

  return (
    <div className="w-64">
      <div className="flex flex-col space-y-2 px-4 py-4">
        {menuItems.map((item, index) => {
          const isActive = activeTab === item.name;
          return (
            <button
              key={index}
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
              />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
