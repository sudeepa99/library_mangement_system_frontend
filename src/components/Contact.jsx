import { Link } from "react-scroll";

import librarySupportIcon from "../assets/Library Support.png";
import membershipInquiriesIcon from "../assets/Membership Inquiries.png";
import technicalSupportIcon from "../assets/Technical Support.png";
import bookDonationsIcon from "../assets/Book Donations.png";

const Contact = () => {
  const contactCards = [
    {
      id: 1,
      title: "Library Support",
      description:
        "Our dedicated librarians are here to help with all your reading needs.",
      contact: "support@readifylibrary.com",
      icon: librarySupportIcon,
    },
    {
      id: 2,
      title: "Membership Inquiries",
      description: "Get information about library membership and benefits.",
      contact: "membership@readifylibrary.com",
      icon: membershipInquiriesIcon,
    },
    {
      id: 3,
      title: "Technical Support",
      description: "Need help with our digital platform or online resources?",
      contact: "tech@readifylibrary.com",
      icon: technicalSupportIcon,
    },
    {
      id: 4,
      title: "Book Donations",
      description: "Interested in donating books to our collection?",
      contact: "donations@readifylibrary.com",
      icon: bookDonationsIcon,
    },
  ];
  return (
    <div className="flex flex-col justify-center font-robotoSlab pt-[5%]   ">
      <div>
        <h1 className="font-bold text-5xl text-center">
          <span className="text-black">Get In </span>
          <span className="text-tangerineYellow">Touch</span>
        </h1>
        <p className="text-xl text-center mt-[1%] ">
          Have questions about our library services?
          <br /> We're here to help you discover the perfect books and make the
          most of your reading journey.
        </p>
      </div>
      <div className="pt-[5%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-[5%] px-[5%] ">
        {contactCards.map((card) => (
          <div
            key={card.id}
            className="bg-yellow-50 p-[6%] rounded-lg shadow-lg transition-all duration-400 ease-in-out border border-gray-200 flex flex-col items-center text-center gap-3 hover:scale-105 hover:shadow-xl hover:bg-yellow-100 transform-gpu"
          >
            <img
              src={card.icon}
              alt={card.title}
              className="w-[35%] h-[35%] object-contain"
            />
            <h1 className="text-2xl font-semibold">{card.title}</h1>
            <p className="text-lg">{card.description}</p>
            <button className="text-sm mt-[2%] text-greenColour font-light">
              {card.contact}
            </button>
          </div>
        ))}
      </div>
      <div className="p-[4%] text-center bg-yellow-100 grid lg:grid-cols-4 xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 ">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl">Readify</h1>
          <p className="text-gray-400 hover:text-gray-900 transition-colors">
            Your Next Adventure Awaits
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl">Quick Links</h1>
          <div className="flex flex-col gap-2 text-gray-400  ">
            <Link
              to="homepage"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="hover:text-gray-600 transition-colors cursor-pointer"
            >
              Home
            </Link>
            <Link
              to="about"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="hover:text-gray-600 transition-colors cursor-pointer"
            >
              About
            </Link>
            <Link
              to="didYouKnow"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="hover:text-gray-600 transition-colors cursor-pointer"
            >
              Did You Know?
            </Link>
            <Link
              to="contact"
              spy={true}
              smooth={true}
              duration={500}
              offset={-70}
              className="hover:text-gray-600 transition-colors cursor-pointer"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl ">Legal</h1>
          <div className="flex flex-col gap-2 text-gray-400 ">
            <button className="hover:text-gray-600 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button className="hover:text-gray-600 transition-colors cursor-pointer">
              Terms of Service
            </button>
            <button className="hover:text-gray-600 transition-colors cursor-pointer">
              Cookie Policy
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl">Support</h1>
          <div className="flex flex-col  gap-2 text-gray-400">
            <button className="hover:text-gray-600 transition-colors cursor-pointer">
              Help Centre/ FAQ
            </button>
            <button className="hover:text-gray-600 transition-colors cursor-pointer">
              Report a bug
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
