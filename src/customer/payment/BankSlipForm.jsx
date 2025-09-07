import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const BankSlipForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    bankSlip: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        bankSlip: file
      }));
    }
  };

  const handlePayNow = () => {
    // Handle payment submission
    console.log('Payment submitted:', formData);
    alert('Thank you for your donation!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 bg-white rounded-lg p-8 shadow-sm">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Upload Bank Slip</h2>
            </div>

            <div className="space-y-6">
              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Your First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Your Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile<span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
                    <div className="w-6 h-4 mr-2 bg-gradient-to-r from-orange-500 via-white to-green-600 rounded-sm flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-800 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">+94</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter Your Mobile Number"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Bank Slip Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Slip<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    {formData.bankSlip ? formData.bankSlip.name : 'Choose File'}
                  </div>
                  <label className="px-6 py-3 bg-pink-600 text-white rounded-lg cursor-pointer hover:bg-pink-700 transition-colors">
                    Browse
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Note */}
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <p className="text-sm text-pink-700">
                  <strong>Note :</strong><br />
                  Submissions can be done by .pdf, .jpg & .png formats.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Programme Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Charity Programmes</p>
              <h3 className="text-lg font-semibold text-gray-800">Thalassemia Fundraising for Aaliya</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Donation Amount:</p>
              <p className="text-3xl font-bold text-pink-600">LKR 500.00</p>
            </div>

            <button
              onClick={handlePayNow}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankSlipForm;