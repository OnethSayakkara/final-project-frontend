import React, { useEffect } from 'react';
import { CheckCircle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../common/Header';

const BankSlipSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Clear any donation-related data from localStorage or state
    // localStorage.removeItem('donationData');
  }, []);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-family-inter">
              Bank Slip Submitted!
            </h1>
            <p className="text-gray-600 font-family-inter">
              Thank you for your generous donation via bank slip. Your contribution will make a real difference.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-family-inter">
                Your bank slip has been submitted for verification. You will receive a confirmation email once it's processed (within 24-48 hours).
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate(-2)}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium font-family-inter"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Event
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium font-family-inter"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankSlipSuccess;