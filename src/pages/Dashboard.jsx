import NavBar from "../components/NavBar";
import backgroundImage from "../assets/47892948_logo_make_11_06_2023_141.jpg";
import tipsIcon from "../assets/Gemini_Generated_Image_5gn81a5gn81a5gn8_upscayl_4x_high-fidelity-4x.jpg";

const Dashboard = () => {
  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <NavBar />
      <div className="flex flex-col items-start pt-[8%] pl-[1%] h-full gap-[1.5%]">
        <h1 className="text-5xl text-[#FFCC00] font-bold">Unlock Worlds</h1>
        <h2 className="text-3xl text-textColour pl-[%]">Find Your Story </h2>
        <div className="pt-[30%] pl-[90%] relative">
          {/* Wrap the image in a group */}
          <div className="group relative">
            <img
              src={tipsIcon}
              className="h-14 w-14 rounded-full cursor-pointer"
            />

            {/* Tooltip container */}
            <div className="absolute bottom-full mb-2 left-0 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-greenColour text-white text-sm px-4 py-2 w-42 h-12 flex items-center justify-center  rounded-sm whitespace-nowrap">
                Open a book, open your mind.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
