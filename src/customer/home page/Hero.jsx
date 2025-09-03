import { Link } from "react-router-dom";


const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center h-[85vh] mt-14"
      style={{
        backgroundImage: "url('/hero.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-black/55  flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-semibold font-family-inter mb-4">Make a Difference in Sri Lanka</h1>
          <p className="text-xl font-family-inter mb-6">Join our community of volunteers helping those in need through meaningful charity events across the country.</p>
         <div className="space-x-4 mb-8 mt-9">
  <Link to="/register">
    <button className="px-6 py-3 border-white text-white font-family-inter rounded border-2 backdrop-blur-md bg-white/10">
      Support a Donation Campaign
    </button>
  </Link>

  <Link to="/organizerSelecter">
    <button className="px-6 py-3 border-2 border-white text-white rounded font-family-inter backdrop-blur-md bg-white/10">
      Start a Donation Campaign
    </button>
  </Link>
</div>

          
        </div>
      </div>
    </section>
  );
};

export default Hero;