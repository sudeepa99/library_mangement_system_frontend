import NavBar from "../components/NavBar";
import backgroundImage from "../assets/47892948_logo_make_11_06_2023_141.jpg";
import tipsIcon from "../assets/Gemini_Generated_Image_5gn81a5gn81a5gn8_upscayl_4x_high-fidelity-4x.jpg";
import About from "../components/About";
import DidYouKnow from "../components/DidYouKnow";
import Contact from "../components/Contact";
import { useEffect } from "react";
import { useAuth } from "../contexts/authContext";

const Homepage = () => {
  const { user, loading } = useAuth();

  useEffect(() => {}, [user, loading]);
  return (
    <>
      <div
        id="homepage"
        className="bg-cover bg-center h-screen font-robotoSlab relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <NavBar />

        <div className="flex flex-col items-start pt-[12%] pl-[4%] h-full gap-4">
          <h1 className="text-5xl text-[#FFCC00] font-bold">Unlock Worlds</h1>
          <h2 className="text-3xl text-white">Find Your Story</h2>
        </div>

        <div className="absolute bottom-8 right-8">
          <div className="group relative">
            <img
              src={tipsIcon}
              className="h-14 w-14 rounded-full cursor-pointer shadow-lg"
              alt="Tips"
            />
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <div className="bg-green-600 text-white text-sm px-4 py-2 w-48 rounded-md shadow-lg">
                Open a book, open your mind.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="about">
        <About />
      </div>
      <div id="didYouKnow">
        <DidYouKnow />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </>
  );
};

export default Homepage;
