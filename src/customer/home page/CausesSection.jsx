import { useState } from "react";
import { RiHealthBookFill, RiTeamFill } from "react-icons/ri"; // Import RiHealthBookFill and RiTeamFill
import { IoPaw } from "react-icons/io5"; // Import IoPaw
import { LuSiren } from "react-icons/lu"; // Import LuSiren
import { GraduationCap } from "lucide-react"; // Import GraduationCap from lucide-react
import { Link } from "react-router-dom";

const causes = [
  {
    name: "Healthcare",
    icon: <RiHealthBookFill className="text-xl" />, // Use the component directly
    description:
      "Support initiatives relating to hospital infrastructure development, procuring medical supplies and providing care for someone in need of medical treatment/ assistance.",
    image: "/cases1.webp", // Replace with your local or CDN image
  },
  {
    name: "Community",
    icon: <RiTeamFill className="text-xl" />, // Use the component directly
    description: "Support initiatives relating to children, elderly, families and communities in-need.",
    image: "/cases2.jpg",
  },
  {
    name: "Animal Welfare",
    icon: <IoPaw className="text-xl" />, // Use the component directly
    description: "Support initiatives relating to animal rescue and furthering the welfare of animals.",
    image: "/cases3.webp",
  },
  {
    name: "Education",
    icon: <GraduationCap className="text-xl" />, // Use the component directly
    description: "Support initiatives relating to the provision of education, scholarships, procuring school supplies, and development of schools.",
    image: "/cases4.jpg",
  },
  {
    name: "Emergency",
    icon: <LuSiren className="text-xl" />, // Use the component directly
    description: "Support initiatives relating to natural disasters and emergency situations.",
    image: "/cases5.jpeg",
  },
];

const CausesSection = () => {
  const [selected, setSelected] = useState(0);

  return (
    
    <div className="max-w-[90rem] px-28 font-family-inter">
      <div>
        <h2 className="text-4xl font-semibold mb-7">Find Causes You Care About</h2>
        <p className="text-gray-600 text-xl mb-10">
          Everything we do is grassroots: built from the community in order to serve our<br /> community. Explore these opportunities to bring hope to families and<br /> communities in-need.
        </p>

        <div className="flex flex-row gap-9">
          <div className="flex flex-col gap-5 w-1/3">
            {causes.map((cause, index) => (
              <button
                key={index}
                onClick={() => setSelected(index)}
                className={`w-full text-left px-6 py-4 rounded border transition-all duration-200 shadow-sm ${
                  selected === index
                    ? "bg-purple-100 border-purple-400 text-purple-700 shadow-md"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-7 text-lg font-semibold">
                  {cause.icon} {cause.name} {/* Render the icon component */}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-start gap-10">
            {causes[selected].image && (
              <img
                src={causes[selected].image}
                alt={causes[selected].name}
                className="w-96 h-96 rounded object-cover"
              />
            )}
            <p className="text-gray-700 text-xl font-medium leading-relaxed w-[25rem]">
              {causes[selected].description}
            </p>
          </div>
        </div>
      </div>
      {/* Center the "See More" button */}
      <div className="flex justify-center mt-14">
        <Link to="/categories">
        <button className="px-7 py-2 bg-purple-800 text-white rounded mb-10">See More</button>
        </Link>
      </div>
    </div>
  );
};

export default CausesSection;