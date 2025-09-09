import { Heart, Users, Dog, BookOpen, AlertTriangle, Leaf, Hand, Trophy, Target } from "lucide-react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";

 function Categories() {
  const categories = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Healthcare",
      color: "text-purple-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      color: "text-purple-600"
    },
    {
      icon: <Dog className="w-6 h-6" />,
      title: "Animal Welfare",
      color: "text-purple-600"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Education",
      color: "text-purple-600"
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Emergency",
      color: "text-purple-600"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Environment",
      color: "text-purple-600"
    },
    {
      icon: <Hand className="w-6 h-6" />,
      title: "Volunteer",
      color: "text-purple-600"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Sports",
      color: "text-purple-600"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Cancer",
      color: "text-purple-600"
    }
  ];

  return (
    <div>
    <Header/>
    <div className="max-w-7xl mx-auto p-8 bg-white mt-20 mb-10 font-family-inter">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Categories</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Explore these opportunities to bring hope to families and<br />
          communities in-need.
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
          >
            <div className="flex items-center space-x-5">
              <div className={`${category.color} group-hover:scale-110 transition-transform duration-200`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {category.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default Categories;