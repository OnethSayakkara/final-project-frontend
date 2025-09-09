import { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import { LuLogOut } from "react-icons/lu";
import logo from '../../public/logo.png'

const Header = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken'); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    navigate('/'); // Redirect to home page after logout
    setIsPopupOpen(false); // Close popup
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-center font-family-inter justify-between px-6 bg-white shadow-md border-b border-gray-200 z-10">
      <div className="flex items-center space-x-2">
       <img src={logo} className='w-24 h-[4rem] p-1'/>
      </div>
      <nav className="flex items-center space-x-6">
        <a href="/" className="text-purple-900 hover:text-purple-600">Home</a>
        <a href="/allevents" className="text-purple-900 hover:text-purple-600">Charity Programmes</a>
        <div className="relative group">
          <a href="#" className="text-purple-900 hover:text-purple-600">More</a>
          <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 py-2 px-4 w-32">
            <a href="#" className="block text-purple-900 hover:text-purple-600">About Us</a>
            <a href="#" className="block text-purple-900 hover:text-purple-600">Contact Us</a>
          </div>
        </div>
        <div className="relative group">
          <a href="#" className="text-purple-900 hover:text-purple-600">English</a>
          <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 py-2 px-4">
            <a href="#" className="block text-purple-900 hover:text-purple-600">Sinhala</a>
            <a href="#" className="block text-purple-900 hover:text-purple-800">Tamil</a>
          </div>
        </div>
      </nav>
      <div className="flex space-x-4">
        {!isLoggedIn ? (
          <>
            <button className="px-4 py-2 bg-purple-900 text-white rounded hover:bg-purple-950">Donate</button>
            <button className="px-4 py-2 text-purple-900 border-2 border-purple-900 rounded">Fundraise</button>
          </>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsPopupOpen(!isPopupOpen)}
              className="flex items-center space-x-2 text-purple-800 hover:text-purple-600"
            >
              <CgProfile className="w-10 h-10" />
             
            </button>
            {isPopupOpen && (
              <div className="absolute right-0 mt-7 w-48 bg-white shadow-lg rounded py-2 z-20">
                <a
                  href="/my-profile"
                  onClick={() => setIsPopupOpen(false)}
                  className="flex items-center px-4 py-2 text-black hover:bg-purple-100 rounded"
                >
                  <span className="mr-2"><CgProfile className='text-lg'/></span> My Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-black hover:bg-purple-100 rounded"
                >
                  <span className="mr-2"><LuLogOut/></span> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;