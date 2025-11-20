import { logo } from "../assets/47892948_logo_make_11_06_2023_141.jpg";
const Header = () => {
  return (
    <div>
      <div>
        <img
          src={logo}
          className="h-20 w-auto rotate-y-hover"
          alt="Readify Logo"
        />
      </div>
    </div>
  );
};

export default Header;
