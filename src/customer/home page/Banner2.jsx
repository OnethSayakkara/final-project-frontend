import React from 'react';
import banner2 from '../../../public/banner2.png'
import { Link } from 'react-router-dom';

const Banner2 = () => {
  return (
    <div className='w-full flex flex-row font-family-inter'>
    <div className="relative w-3/4 bg-purple-900 text-white py-12 px-12">
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row  items-start">
        {/* Left Section: Text and Call-to-Action */}
        <div className="mb-6 md:mb-0">
          <h1 className="text-5xl font-medium mb-8">Helping You Help Others</h1>
          <p className="text-2xl mb-8">
            United Charity is a trusted, secure and completely free-to-use online charity platform by Dialog Foundation
            that connects like-minded people who want to be part of taking action to support and enrich Sri Lankan lives
            and communities.
          </p>
          <Link to='/allevents'><button className="border-2 cursor-pointer text-white font-semibold py-2 px-6 rounded  transition">
            Discover
          </button>
          </Link>
        </div>
      </div>
    </div>
    <div className='w-1/4'>
      <img
      src={banner2}
      />

    </div>
    </div>
  );
};

export default Banner2;