import React, { useState } from 'react';
import individual from '../../public/individudal.png';
import group from '../../public/group.png';
import register from '../../public/hand.webp';
import { Link } from 'react-router-dom';

const OrganizerTypeSelector = () => {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="w-1/2 relative overflow-hidden">
<img
          src={register}
          alt="Hands holding together"
          className="w-full h-[100vh] object-cover"
          onError={(e) => console.error('Image failed to load:', e)}
        />
      </div>

      {/* Right side - Content */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-2xl w-full">
          {/* Title */}
          <h1 className="text-3xl font-bold font-family-inter text-gray-900 mb-5 text-left">
            Are you,
          </h1>

          {/* User Type Options - Side by Side */}
          <div className="flex items-start gap-12 relative">
            {/* Individual Option */}
            <div className="flex-1 text-center">
              <div className="mb-8">
                <div className="w-full h-48 bg-gray-50 rounded-2xl flex text-start items-center justify-center mb-8 p-4">
                  <div className="w-44 h-44 bg-purple-200 rounded-full flex items-center justify-center">
                    <img
                            src={individual}
                            alt="individual"
                            className="w-full h-full object-cover"
                           
                          />
                  </div>
                </div>
              </div>
              <div className='text-start'>
              <h2 className="text-2xl font-bold font-family-inter text-gray-90 mb-1">
                An Individual
              </h2>
              <p className="text-gray-600 font-family-inter text-base mb-8">
                who hopes to run campaigns?
              </p>
              </div>
              
              <button 
                onClick={() => setSelectedType('individual')}
                className="w-full bg-purple-600 text-white font-medium py-2 px-4 rounded font-family-inter hover:bg-purple-700 transition-colors text-lg mb-6"
              >
                Sign Up
              </button>
              
              <div className="text-center font-family-inter">
                <span className="text-gray-600">Already Registered? </span>
                <button className="text-blue-500 hover:text-blue-600 font-medium ml-2">
                  Login Now
                </button>
              </div>
            </div>

            {/* OR Divider */}
            <div className="flex flex-col items-center justify-center pt-14">
              <div className="w-px h-32 bg-gray-300"></div>
              <div className="bg-pink-100 text-pink-600 rounded-full w-12 h-12 flex items-center justify-center font-medium text-lg my-4">
                or
              </div>
              <div className="w-px h-32 bg-gray-300"></div>
            </div>

            {/* Organization Option */}
            <div className="flex-1 text-center">
              <div className="mb-8">
                <div className="w-full h-48 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 p-4">
                  <div className="w-44 h-44 bg-purple-200 rounded-full flex items-center justify-center">
                    <img
                            src={group}
                            alt="group"
                            className="w-full h-full object-cover"
                           
                          />
                  </div>
                </div>
              </div>
               <div className='text-start'>
              <h2 className="text-2xl font-bold font-family-inter text-gray-900 mb-1">
                An Organization
              </h2>
              <p className="text-gray-600 text-base mb-8 font-family-inter">
                who is running charity campaigns?
              </p>
              </div>
              <Link to='/OrganizerRegistration'>
              <button 
                onClick={() => setSelectedType('organization')}
                className="w-full bg-purple-600 text-white font-medium py-2 px-4 rounded font-family-inter hover:bg-purple-700 transition-colors text-lg mb-6"
              >
                Sign Up
              </button>
              </Link>
              
              <div className="text-center font-family-inter">
                <span className="text-gray-600">Already Registered? </span>
                <button className="text-blue-500 hover:text-blue-600 font-medium ml-2">
                   Login Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

  );
};

export default OrganizerTypeSelector;