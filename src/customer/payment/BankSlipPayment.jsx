import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, CheckCircle, ReceiptText } from 'lucide-react';
import Header from '../../common/Header';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const BankSlipPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const donationData = location.state;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: ''
    });
    const [bankSlipFile, setBankSlipFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    // Bank details for donation
    const bankDetails = {
        bankName: 'Commercial Bank of Ceylon',
        accountName: 'Charity Foundation',
        accountNumber: '1234567890',
        branch: 'Colombo Main Branch',
    };

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

        if (!bankSlipFile) {
            newErrors.bankSlip = 'Bank slip file is required';
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload only JPG, PNG, or PDF files');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            setBankSlipFile(file);
            if (errors.bankSlip) {
                setErrors(prev => ({
                    ...prev,
                    bankSlip: ''
                }));
            }
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const userId = localStorage.getItem("userId"); // Get userId from local storage

            const formDataToSend = new FormData();
            formDataToSend.append('Img', bankSlipFile); // Match backend field name 'Img'
            formDataToSend.append('eventId', donationData.eventId);
            formDataToSend.append('amount', donationData.amount);
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phoneNumber', formData.mobileNumber);

            // Ensure userId is sent if it exists
            if (userId) {
                formDataToSend.append('userId', userId);
            } else {
                // Handle case where userId is not available (optional, depending on your auth flow)
                console.warn('No userId found in localStorage');
                // You might want to redirect or handle this case (e.g., navigate('/login'))
            }

            // Debug: Log the FormData entries
            console.log([...formDataToSend.entries()]);

            const response = await fetch('http://localhost:3000/bankslipdonation/registerbankslip', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Bank slip donation submitted:', result);
                setSubmitted(true);
                navigate('/bank-slip-success');
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to submit donation');
            }
        } catch (error) {
            console.error('Error submitting donation:', error);
            alert(`Failed to submit donation: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div>
                <Header />
                <div className="min-h-screen bg-gray-50 mt-20 flex items-center justify-center px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-family-inter">
                            Donation Submitted!
                        </h1>
                        <p className="text-gray-600 font-family-inter mb-6">
                            Your donation has been submitted for verification. You will receive a confirmation email once it's processed (within 24-48 hours).
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium font-family-inter"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-50 mt-20">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-family-inter mb-5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="bg-white border border-black/10 rounded shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <ReceiptText className="w-7 h-7" />
                            <h1 className="text-2xl font-bold text-gray-900 font-family-inter">
                                Bank Slip Payment
                            </h1>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Side - Donor Information Form */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 font-family-inter">
                                    Donor Information
                                </h2>

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
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
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
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
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
                                                className: `w-full px-11 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter ${errors.mobileNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
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
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-family-inter ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                                                }`}
                                            placeholder="Enter Your Email Address"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600 font-family-inter">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Bank Details */}
                                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4 font-family-inter">
                                    Bank Transfer Details
                                </h2>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-family-inter">Bank:</span>
                                        <span className="font-medium font-family-inter">{bankDetails.bankName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-family-inter">Account Name:</span>
                                        <span className="font-medium font-family-inter">{bankDetails.accountName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-family-inter">Account Number:</span>
                                        <span className="font-medium font-family-inter">{bankDetails.accountNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 font-family-inter">Branch:</span>
                                        <span className="font-medium font-family-inter">{bankDetails.branch}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Upload Section & Donation Summary */}
                            <div>
                                <div className='border-r-2 border-black'/>
                                {/* Donation Summary */}
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 font-family-inter">
                                    Donation Summary
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="font-medium font-family-inter">{donationData.eventTitle}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-purple-800 font-family-inter">LKR {donationData.amount.toLocaleString()}</span>
                                    </div>
                                    {donationData.supportMessage && (
                                        <div>
                                            <span className="text-gray-600 font-family-inter">Message:</span>
                                            <p className="font-medium font-family-inter mt-1">{donationData.supportMessage}</p>
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-xl font-semibold text-gray-900 mb-4 font-family-inter">
                                    Upload Bank Slip
                                </h2>

                                <div className="space-y-4">
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-yellow-800 mb-2 font-family-inter">Instructions:</h4>
                                        <ul className="text-yellow-700 text-sm space-y-1 font-family-inter">
                                            <li>1. Transfer the amount to the above bank account</li>
                                            <li>2. Take a clear photo or scan of your bank slip</li>
                                            <li>3. Upload the bank slip using the form below</li>
                                            <li>4. We'll verify your donation within 24-48 hours</li>
                                        </ul>
                                    </div>

                                    <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.bankSlip ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}>
                                        <input
                                            type="file"
                                            id="bankSlip"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="bankSlip"
                                            className="cursor-pointer flex flex-col items-center gap-3"
                                        >
                                            <Upload className="w-12 h-12 text-gray-400" />
                                            <div>
                                                <p className="text-gray-600 font-medium font-family-inter">
                                                    Click to upload bank slip
                                                </p>
                                                <p className="text-gray-400 text-sm font-family-inter">
                                                    PNG, JPG, or PDF (max 5MB)
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                    {errors.bankSlip && (
                                        <p className="text-sm text-red-600 font-family-inter">{errors.bankSlip}</p>
                                    )}

                                    {bankSlipFile && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <p className="font-medium text-green-800 font-family-inter">
                                                        File Selected: {bankSlipFile.name}
                                                    </p>
                                                    <p className="text-green-600 text-sm font-family-inter">
                                                        Size: {(bankSlipFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`w-full py-3 rounded-lg font-medium font-family-inter transition-colors ${isSubmitting
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : 'bg-purple-800 text-white hover:bg-purple-950'
                                            }`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Donation'}
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

export default BankSlipPayment;