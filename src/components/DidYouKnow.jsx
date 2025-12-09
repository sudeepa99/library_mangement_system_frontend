import knowledgeFactOne from "../assets/First Book.png";
import knowledgeFactTwo from "../assets/First Known Author.png";
import knowledgeFactThree from "../assets/Most Famous Book.png";
import knowledgeFactFour from "../assets/Most Famous Writer.png";
import knowledgeFactFive from "../assets/Oldest Library.png";
import knowledgeFactSix from "../assets/Largest Library.png";
import knowledgeFactSeven from "../assets/Most Translated Book.png";
import knowledgeFactEight from "../assets/Most Expensive Book.png";

const DidYouKnow = () => {
  const knowledgeCards = [
    {
      id: 1,
      image: knowledgeFactOne,
      title: "First Book Ever Printed",
    },
    { id: 2, image: knowledgeFactTwo, title: "First Known Author in History" },
    {
      id: 3,
      image: knowledgeFactThree,
      title: "Most Famous Book Ever Written",
    },
    {
      id: 4,
      image: knowledgeFactFour,
      title: "Most Famous Writer in the World",
    },
    { id: 5, image: knowledgeFactFive, title: "Oldest Library in the World" },
    { id: 6, image: knowledgeFactSix, title: "Largest Library in the World" },
    {
      id: 7,
      image: knowledgeFactSeven,
      title: "Most Translated Book in the World",
    },
    {
      id: 8,
      image: knowledgeFactEight,
      title: "Most Expensive Book Ever Sold",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 mx-[4%] pt-[5%]">
      {knowledgeCards.map((card) => (
        <div
          key={card.id}
          className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-250 overflow-hidden hover:translate-y-[-2%] "
        >
          <img
            src={card.image}
            alt={card.title}
            className="object-cover h-auto w-full rounded-xl  "
          />
        </div>
      ))}
    </div>
  );
};
export default DidYouKnow;
