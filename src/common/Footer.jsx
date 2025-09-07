import {  ArrowUp } from 'lucide-react';
import logo from '../../public/logo.png'
import { FaFacebookSquare, FaTwitter, FaYoutube, FaLinkedin, FaInstagramSquare  } from "react-icons/fa";


const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white font-family-inter">
      {/* Main Footer Content */}
      <div className="border-y border-gray-300 py-3">
        <div className="max-w-[85rem] mx-auto px-8">
          <div className="flex items-center justify-between">
            {/* Logo and Tagline */}
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Karuna.lk" 
                className="h-24 w-auto mr-3"
              />
              <div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-12 text-sm">
              <a 
                href="/privacy-policy" 
                className="text-gray-500 hover:text-gray-900 transition-colors font-light"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms-conditions" 
                className="text-gray-500 hover:text-gray-900 transition-colors font-light"
              >
                Terms & Conditions
              </a>
              <a 
                href="/contact-us" 
                className="text-gray-500 hover:text-gray-900 transition-colors font-light"
              >
                Contact Us
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3">
              <a 
                href="#" 
                aria-label="Facebook"
              >
                <FaFacebookSquare className=" text-blue-600 text-4xl" />
              </a>
              <a 
                href="#" 
                aria-label="Instagram"
              >
                <FaInstagramSquare  className="text-pink-600 text-4xl" />
              </a>
              <a 
                href="#" 
              
                aria-label="Twitter"
              >
                <FaTwitter className="text-blue-600 text-4xl" />
              </a>
              <a 
                href="#" 
                aria-label="YouTube"
              >
                <FaYoutube className="text-red-500 text-4xl" />
              </a>
              <a 
                href="#" 
                aria-label="LinkedIn"
              >
                <FaLinkedin  className="text-blue-600 text-4xl" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-[85rem] mx-auto px-8">
          <div className="flex items-center justify-between">
            {/* Copyright */}
            <div className="text-gray-600 text-sm ml-[32rem]">
              © Copyright 2022, <span className="font-semibold text-gray-800">United Charity</span>.
            </div>

            {/* Developer Credit and Scroll to Top */}
            <div className="flex items-center space-x-6">
              <div className="text-gray-600 text-sm">
                Developed by <span className="font-semibold text-gray-800">Oneth Sayakkara</span>
              </div>
              
              {/* Scroll to Top Button */}
              <button
                onClick={scrollToTop}
                className="w-9 h-9 bg-purple-800 rounded flex items-center justify-center hover:bg-purple-900 transition-colors shadow-sm"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;