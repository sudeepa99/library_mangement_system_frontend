import logo from "../assets/logo Readify.png";
import searchIcon from "../assets/icons/search.png";
import notificationIcon from "../assets/icons/bell.png";
import { useAuth } from "../contexts/authContext";
import { useEffect, useState } from "react";
import ProfileDrawer from "./ProfileDrawer";
const Header = () => {
  const { user, refreshUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="grid grid-cols-3 items-center px-6 py-4 shadow-md">
      {" "}
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
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">
              {currentDate.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-500 font-semibold">
              {currentDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
            </p>
          </div>

          <button
            className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold"
            onClick={() => setIsProfileOpen(true)}
          >
            {user?.name?.charAt(0) || "U"}
          </button>
        </div>
      </div>
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        refreshUser={refreshUser}
      />
    </div>
  );
};

export default Header;
