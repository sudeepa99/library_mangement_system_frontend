import { useState } from "react";

import dashboardIcon from "../assets/icons/house.png";
import booksIcon from "../assets/icons/book-open-check.png";
import borrowingIcon from "../assets/icons/circle-dot.png";
import categoriesIcon from "../assets/icons/tag.png";
import userMngIcon from "../assets/icons/users.png";
import reportsIcon from "../assets/icons/chart-no-axes-column.png";
const SideBar = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const menuItems = [
    { name: "Dashboard", icon: dashboardIcon },
    { name: "Books Managemnet", icon: booksIcon },
    { name: "Borrowings & Returns", icon: borrowingIcon },
    { name: "Categories", icon: categoriesIcon },
    { name: "Users Mangement", icon: userMngIcon },
    { name: "Reports & Analytics", icon: reportsIcon },
  ];
  return (
    <div className="bg-yellow-100 shadow-md h-screen w-64  left-0 top-0 pt-8">
      <div className="px-8 py-2">
        <p className="text-lg font-bold text-gray-800 mb-6">Sidebar</p>
      </div>
      <div className="flex flex-col space-y-2 px-4">
        {menuItems.map((item, index) => {
          return (
            <button
              key={index}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.name
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
              onClick={() => setActiveTab(item.name)}
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
