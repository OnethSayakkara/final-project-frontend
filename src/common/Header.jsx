const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center font-family-inter justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200 z-10">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-semibold text-orange-600">United Charity</span>
      </div>
      <nav className="flex items-center space-x-6">
        <a href="/" className="text-purple-800 hover:text-purple-600">Home</a>
        <a href="/allevents" className="text-purple-800 hover:text-purple-600">Charity Programmes</a>
        <div className="relative group">
          <a href="#" className="text-purple-800 hover:text-purple-600">More</a>
          <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 py-2 px-4 w-32">
            <a href="#" className="block text-purple-800 hover:text-purple-600">About Us</a>
            <a href="#" className="block text-purple-800 hover:text-purple-600">Contact Us</a>
          </div>
        </div>
        <div className="relative group">
          <a href="#" className="text-purple-800 hover:text-purple-600">English</a>
          <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 py-2 px-4">
            <a href="#" className="block text-purple-800 hover:text-purple-600">Sinhala</a>
            <a href="#" className="block text-purple-600 hover:text-purple-800">Tamil</a>
          </div>
        </div>
      </nav>
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-950">Donate</button>
        <button className="px-4 py-2 text-purple-900 border-2 border-purple-900 rounded">Fundraise</button>
      </div>
    </header>
  );
};

export default Header;