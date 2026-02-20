import logo from "../assets/logo Readify.png";
import searchIcon from "../assets/icons/search.png";
import notificationIcon from "../assets/icons/bell.png";
import { useAuth } from "../contexts/authContext";
import { useState } from "react";
const Header = () => {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <div className="grid grid-cols-3 items-start px-6 py-4  shadow-md min-w-fit">
      <div className="flex items-center">
        <img
          src={logo}
          className="h-12 w-auto rotate-y-hover"
          alt="Readify Logo"
        />
      </div>

      <div className="text-center">
        <div className="text-xl font-semibold text-gray-800">
          Welcome Back, {user?.name || "User"}!
        </div>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-sm text-gray-500">Role:</span>
          <span className="px-3 py-1 text-xs font-medium bg-green-100 hover:bg-green-300 text-green-800 rounded-full">
            {user?.role}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-48">
          <img
            src={searchIcon}
            className="h-4 w-4 mr-2 text-gray-400"
            alt="Search"
          />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-sm text-gray-700"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <img
              src={notificationIcon}
              className="h-5 w-5 text-gray-600"
              alt="Notifications"
            />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold"
            onClick={() => setIsProfileOpen(true)}
          >
            {user?.name?.charAt(0) || "U"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
