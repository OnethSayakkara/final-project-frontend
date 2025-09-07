import React, { useEffect } from 'react';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Clear any registration-related data from localStorage or state
    // localStorage.removeItem('registrationData');
  }, []);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 mt-20 flex items-center justify-center px-4 font-family-inter">
        <div className="max-w-5xl w-full bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3 font-family-inter">
              Thank You for Registering!
            </h1>
            <p className="text-gray-600 font-family-inter text-lg">
              Your commitment to volunteering will make a meaningful impact. We’re thrilled to have you on board!
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <p className="text-lg text-green-800 font-family-inter mb-4">
                A confirmation email has been sent to your email address with event details.
              </p>
              <h3 className="text-lg font-semibold text-green-700 mt-3 mb-5 font-family-inter">Volunteer Guidelines:</h3>
              <div className='ml-[14rem] w-[40rem] items-center justify-center'>
                 <ul className="text-base text-start text-green-800 list-disc list-inside mt-1 space-y-1 font-family-inter">
                <li>Arrive at least 15 minutes early at the event location.</li>
                <li>Follow all safety instructions provided by the organizers.</li>
                <li>Wear comfortable clothing and bring any required items (e.g., ID, water bottle).</li>
                <li>Check your email for updates or last-minute changes.</li>
                <li>Contact us at unitedcharity.progress@gmail.com if you have any questions.</li>
              </ul>

              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium font-family-inter hover:shadow-md"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Event
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium font-family-inter hover:shadow-lg"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;