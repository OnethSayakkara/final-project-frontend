import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Header from '../../common/Header';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CardPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const donationData = location.state;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  if (!donationData) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 font-family-inter mb-4">No donation data found</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-family-inter"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      mobileNumber: value
    }));
    
    if (errors.mobileNumber) {
      setErrors(prev => ({
        ...prev,
        mobileNumber: ''
      }));
    }
  };

  const handlePayNow = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const userId = localStorage.getItem("userId"); // Get userId if logged in

      const response = await fetch('http://localhost:3000/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: donationData.eventId,
          userId: userId || null,
          amount: donationData.amount,
          currency: 'lkr',
          email: formData.email,
          firstName: formData.firstName, // ✅ Fixed: Send separate names
          lastName: formData.lastName,   // ✅ Fixed: Send separate names
          mobileNumber: formData.mobileNumber, // ✅ Fixed: Add mobile number
          anonymous: donationData.anonymous,
          supportMessage: donationData.supportMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        // ✅ The user will be redirected to Stripe checkout
        // After payment, Stripe will redirect to success/cancel URLs
        // Your webhook will handle the actual database saving
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Side - Payment Form */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-family-inter"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 font-family-inter">
                  Pay by a Card
                </h1>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-family-inter">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter ${
                        errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                      }`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 font-family-inter">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-family-inter">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter ${
                        errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 font-family-inter">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-family-inter">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    country={'lk'}
                    value={formData.mobileNumber}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: 'mobileNumber',
                      required: true,
                      className: `w-full px-11 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter ${
                        errors.mobileNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                      }`
                    }}
                    containerStyle={{
                      width: '100%'
                    }}
                    buttonStyle={{
                      border: errors.mobileNumber ? '1px solid #fca5a5' : '1px solid #d1d5db',
                      borderRadius: '0.5rem 0 0 0.5rem',
                      backgroundColor: errors.mobileNumber ? '#fef2f2' : '#f9fafb'
                    }}
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-600 font-family-inter">{errors.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-family-inter">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                    }`}
                    placeholder="Enter Your Email Address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 font-family-inter">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Donation Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 font-family-inter mb-1">Charity Programme</p>
                  <h2 className="text-lg font-semibold text-gray-900 font-family-inter">
                    {donationData?.eventTitle || 'Event Donation'}
                  </h2>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 font-family-inter">Donation Amount</span>
                    <span className="font-medium text-gray-900 font-family-inter">
                      LKR {donationData?.amount?.toLocaleString()}
                    </span>
                  </div>

                  {donationData?.supportMessage && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 font-family-inter mb-1">Support Message</p>
                      <p className="text-sm text-gray-800 italic font-family-inter">
                        "{donationData.supportMessage}"
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    {donationData?.anonymous ? (
                      <span className="inline-block px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full font-family-inter">
                        Anonymous Donation
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full font-family-inter">
                        Public Donation
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handlePayNow}
                    disabled={isProcessing}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium font-family-inter transition-colors ${
                      isProcessing
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isProcessing ? (
                      'Processing...'
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPayment;