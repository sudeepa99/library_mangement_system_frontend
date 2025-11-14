import { Link } from "react-scroll";
import logo from "../assets/logo Readify.png";

const NavBar = () => {
  return (
    <div className="backdrop-blur-sm bg-black/30 fixed w-full flex flex-row items-center justify-between px-[4%] py-[0.3%] text-textColour font-robotoSlab">
      <div className="navbar-logo-container">
        <img
          src={logo}
          className="h-20 w-auto rotate-y-hover"
          alt="Readify Logo"
        />
      </div>

      <div className="flex flex-row gap-8 justify-center absolute left-1/2 transform -translate-x-1/2">
        <Link
          to="dashboard"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
          className="hover:text-[#FFCC00] transition-colors cursor-pointer"
        >
          Home
        </Link>
        <Link
          to="about"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
          className="hover:text-[#FFCC00] transition-colors cursor-pointer"
        >
          About
        </Link>
        <Link
          to="didYouKnow"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
          className="hover:text-[#FFCC00] transition-colors cursor-pointer"
        >
          Did You Know?
        </Link>
        <button className="hover:text-[#FFCC00] transition-colors cursor-pointer">
          Contact
        </button>
      </div>

      <div className="ml-auto">
        <button className="bg-[#FFCC00] text-black px-6 py-2 rounded-md hover:bg-yellow-500 transition-colors font-semibold">
          Login
        </button>
      </div>
    </div>
  );
};

export default NavBar;
