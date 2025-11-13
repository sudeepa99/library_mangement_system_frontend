import logo from "../assets/Logo Readify.png";

const NavBar = () => {
  return (
    <div className=" backdrop-blur-sm bg-black/30 fixed w-full flex flex-row items-center justify-between px-[8%] py-[0.3%] text-textColour">
      <div className="navbar-logo-container">
        <img src={logo} className="h-20  w-auto rotate-y-hover" />
      </div>
      <div className="flex flex-row gap-[1.8%] justify-center flex-1 ">
        <button>Home</button>
        <button>About</button>
        <button>Did You Know?</button>
        <button>Contact</button>
      </div>
      <div>
        <button>Login</button>
      </div>
    </div>
  );
};

export default NavBar;
