import logo from "../assets/logo Readify.png";
import searchIcon from "../assets/icons/search.png";
import notificationIcon from "../assets/icons/bell.png";
import { useAuth } from "../contexts/authContext";
const Header = () => {
  const { user } = useAuth();
  return (
    <div className="flex flex-row gap-[10%] p-[4%]">
      <div>
        <img
          src={logo}
          className="h-20 w-auto rotate-y-hover"
          alt="Readify Logo"
        />
      </div>
      <div>Welcome Back, {user.name}</div>
      <div>
        <img src={searchIcon} alt="Search Icon" className="h-10 w-auto" />
        <input type="text" placeholder="Search" />
      </div>
      <div>
        <img
          src={notificationIcon}
          alt="Notifications"
          className="h-10 w-auto"
        />
      </div>
    </div>
  );
};

export default Header;
