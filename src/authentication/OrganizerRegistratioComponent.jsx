import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import organizerlogin from '../../public/organizerlogin.jpg';
import Header from '../common/Header';
import Footer from '../common/Footer';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const OrganizerRegistrationComponent = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        organizationName: '',
        organizationEmail: '',
        password: '',
        organization: '',
        contactName: '',
        mobile: '',
        logo: null,
    });
    const [charCount, setCharCount] = useState(0);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (field === 'organization') {
            setCharCount(value.length);
        }
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Selected file:', file.name, file.type, file.size);
            setFormData((prev) => ({
                ...prev,
                logo: file,
            }));
        } else {
            toast.error('No file selected', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const validateStep1 = () => {
        if (!formData.organizationName || !formData.organizationEmail || !formData.password) {
            toast.error('All fields are required', {
                position: 'top-right',
                autoClose: 3000,
            });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.organizationEmail)) {
            toast.error('Please enter a valid email', {
                position: 'top-right',
                autoClose: 3000,
            });
            return false;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters', {
                position: 'top-right',
                autoClose: 3000,
            });
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.organization || !formData.contactName || !formData.mobile || !formData.logo) {
            toast.error('All fields are required, including the organization logo', {
                position: 'top-right',
                autoClose: 3000,
            });
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep2()) return;

        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('organizationName', formData.organizationName);
        data.append('aboutOrganization', formData.organization);
        data.append('contactPersonName', formData.contactName);
        data.append('phoneNumber', formData.mobile);
        data.append('email', formData.organizationEmail);
        data.append('password', formData.password);
        if (formData.logo) {
            data.append('Img', formData.logo);
            console.log('FormData includes file:', formData.logo.name);
        } else {
            console.log('No file in FormData');
        }

        try {
            const response = await axios.post('http://localhost:3000/organizer/registerOrganizer', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            localStorage.setItem('accessToken', response.data.accessToken);
            toast.success('Registration successful! Redirecting to dashboard...', {
                position: 'top-right',
                autoClose: 2000,
                onClose: () => navigate('/Organizer/dashboard'),
            });
        } catch (err) {
            console.error('Frontend error:', err);
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                {/* Left side - Fixed Background image */}
                <div className="w-1/2 fixed left-0 top-0 h-screen">
                    <img
                        src={organizerlogin}
                        alt="organizer"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right side - Scrollable Form */}
                <div className="w-1/2 ml-[50%]">
                    <div className="h-screen overflow-y-auto">
                        <div className="w-lg p-8 ml-32 font-family-inter min-h-full flex flex-col">
                            <ToastContainer />

                            {/* Step 1: Create Account Form */}
                            {currentStep === 1 && (
                                <div className="mt-20">
                                    <div className="mb-8">
                                        <div className="text-gray-600 mb-2">Start Fundraising</div>
                                        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create your account</h1>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Organization Name */}
                                        <div>
                                            <div className="block text-gray-700 text-sm font-medium mb-2">
                                                Organization Name <span className="text-red-500">*</span>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="team united charity"
                                                value={formData.organizationName}
                                                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Organization Email */}
                                        <div>
                                            <div className="block text-gray-700 text-sm font-medium mb-2">
                                                Organization Email <span className="text-red-500">*</span>
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="example@gmail.com"
                                                value={formData.organizationEmail}
                                                onChange={(e) => handleInputChange('organizationEmail', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <div className="block text-gray-700 text-sm font-medium mb-2">
                                                Password <span className="text-red-500">*</span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••••"
                                                    value={formData.password}
                                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next Button */}
                                    <div className="mt-8">
                                        <button
                                            onClick={handleNext}
                                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                                            disabled={loading}
                                        >
                                            Next
                                        </button>
                                    </div>

                                    {/* Login Link */}
                                    <div className="mt-6 text-center">
                                        <span className="text-gray-600">Already Registered? </span>
                                        <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                            Log In Now
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Organization Details */}
                            {currentStep === 2 && (
                                <div className="flex-1 pt-16">
                                    <div className="mb-8">
                                        <div className="text-gray-600 mb-2">Welcome to United Charity</div>
                                        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tell Us More About You</h1>
                                    </div>

                                    <div className="space-y-6">
                                        {/* About Organization */}
                                        <div>
                                            <div className="block text-gray-700 text-sm font-medium mb-2">
                                                About Organization <span className="text-red-500">*</span>
                                            </div>
                                            <textarea
                                                placeholder="About Organization"
                                                value={formData.organization}
                                                onChange={(e) => handleInputChange('organization', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md resize-none h-24 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                maxLength={2000}
                                            />
                                            <div className="text-right text-xs text-gray-400 mt-1">
                                                {charCount}/2000
                                            </div>
                                        </div>

                                        {/* Organization Logo */}
                                        <div>
                                            <div className="block text-gray-700 text-sm font-medium mb-2">
                                                Organization Logo <span className="text-red-500">*</span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        {/* Contact Person Name */}
                                        <div>
                                            <div className="block text-gray-700 text-sm font-medium mb-2">
                                                Contact Person Name <span className="text-red-500">*</span>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Contact Person Name"
                                                value={formData.contactName}
                                                onChange={(e) => handleInputChange('contactName', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>

                                        {/* Mobile Number with PhoneInput */}
                                        <div>
                                            <div className="block text-gray-700 text-sm font-medium mb-2">
                                                Mobile Number <span className="text-red-500">*</span>
                                            </div>
                                            <PhoneInput
                                                country={'lk'}
                                                value={formData.mobile}
                                                onChange={(value) => handleInputChange('mobile', value)}
                                                inputStyle={{
                                                    width: '100%',
                                                    height: '48px',
                                                    fontSize: '16px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '5px',
                                                    paddingLeft: '48px',
                                                }}
                                                containerStyle={{
                                                    width: '100%',
                                                }}
                                                buttonStyle={{
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '8px 0 0 8px',
                                                    backgroundColor: '#f9fafb',
                                                }}
                                            />
                                        </div>

                                    </div>

                                    {/* Register Button */}
                                    <div className="mt-8">
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full bg-purple-800 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                                            disabled={loading}
                                        >
                                            {loading ? 'Registering...' : 'Register'}
                                        </button>
                                    </div>

                                    {/* Back Button */}
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerRegistrationComponent;