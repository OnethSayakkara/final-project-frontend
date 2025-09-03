import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Settings, LogOut } from 'lucide-react';
import { FaUserCircle } from "react-icons/fa";
import Header from '../../common/Header';
import { FaHandHoldingHeart } from "react-icons/fa6";
import { TfiMedall } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import ErrorBoundary from '../../common/ErrorBoundary';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // Add axios for HTTP requests

const MyProfile = () => {
    const [currentView, setCurrentView] = useState('profile');
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        repeat: false
    });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        gender: '',
        currentPassword: '',
        newPassword: '',
        repeatPassword: ''
    });
    const [donationSummary, setDonationSummary] = useState({
        donationCount: 0,
        totalAmountMinor: 0,
    });
    const [donationHistory, setDonationHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 2;
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // For profile update
    const [selectedImage, setSelectedImage] = useState(null); // For image upload
    const [imagePreview, setImagePreview] = useState(null); // For previewing the image

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle image selection and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file)); // Create a preview URL
        }
    };

    // Upload image to backend
    const handleImageUpload = async () => {
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');
        if (!userId || !selectedImage) return;

        const formData = new FormData();
        formData.append('Img', selectedImage); // Match the Multer field name 'Img'
        formData.append('firstName', formData.firstName);
        formData.append('lastName', formData.lastName);
        formData.append('phoneNumber', formData.mobile);

        try {
            const response = await axios.put(
                `http://localhost:3000/user/updateuser/${userId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setImagePreview(response.data.user.img); // Update with the Cloudinary URL
            toast.success('Profile image updated successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to update profile image. Please try again.');
        }
    };

    // Fetch user details and donation data
    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('userId');
            const accessToken = localStorage.getItem('accessToken');
            if (!userId) {
                console.error('User ID not found in localStorage');
                setIsLoading(false);
                return;
            }

            try {
                const userResponse = await fetch(`http://localhost:3000/user/getuserbyid/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!userResponse.ok) throw new Error('Failed to fetch user details');
                const userData = await userResponse.json();
                setFormData(prev => ({
                    ...prev,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    mobile: userData.phoneNumber || ''
                }));
                setImagePreview(userData.img || null); // Set existing image if available

                const summaryResponse = await fetch(`http://localhost:3000/donation/summary/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!summaryResponse.ok) throw new Error('Failed to fetch donation summary');
                const summaryData = await summaryResponse.json();
                setDonationSummary({
                    donationCount: summaryData.data?.donationCount || 0,
                    totalAmountMinor: summaryData.data?.totalAmountMinor || 0,
                });

                const historyResponse = await fetch(`http://localhost:3000/donation/donationhistory/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (!historyResponse.ok) throw new Error('Failed to fetch donation history');
                const historyData = await historyResponse.json();
                setDonationHistory(historyData.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle form submission for update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return;
        }

        setIsSaving(true);
        try {
            const { firstName, lastName, mobile, email } = formData;
            const response = await fetch(`http://localhost:3000/user/updateuser/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ firstName, lastName, phoneNumber: mobile, email: undefined }),
            });

            if (!response.ok) throw new Error('Failed to update user');
            const result = await response.json();
            console.log('Update successful:', result);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderChangePassword = () => (
        <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center mt-20 mb-8">
                    <button
                        onClick={() => setCurrentView('profile')}
                        className="mr-4 p-2 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-4xl font-semibold text-gray-900">Account Settings</h1>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-80 space-y-3">
                        <button
                            onClick={() => setCurrentView('editProfile')}
                            className="w-full px-6 py-4 text-left bg-white border border-gray-300 rounded- hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-gray-700 font-medium">Edit Profile</span>
                        </button>
                        <button className="w-full px-6 py-4 text-left bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            <span className="text-gray-700 font-medium">Interested Categories</span>
                        </button>
                        <button className="w-full px-6 py-4 text-left bg-purple-100 border border-purple-300 rounded">
                            <span className="text-purple-700 font-medium">Change Password</span>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 max-w-ful">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword.current ? "text" : "password"}
                                    placeholder="Current Password"
                                    value={formData.currentPassword}
                                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword.new ? "text" : "password"}
                                        placeholder="New Password"
                                        value={formData.newPassword}
                                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Repeat New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword.repeat ? "text" : "password"}
                                        placeholder="Repeat New Password"
                                        value={formData.repeatPassword}
                                        onChange={(e) => handleInputChange('repeatPassword', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('repeat')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword.repeat ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEditProfile = () => (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto mt-20 font-family-inter">
                    {/* Header */}
                    <div className="flex items-center mb-14">
                        <button
                            onClick={() => setCurrentView('profile')}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-4xl font-semibold text-gray-900">Account Settings</h1>
                    </div>

                    <div className="flex gap-8">
                        {/* Sidebar */}
                        <div className="w-80 space-y-3">
                            <button className="w-full px-6 py-4 text-left bg-purple-100 border border-purple-300 rounded">
                                <span className="text-purple-700 font-medium">Edit Profile</span>
                            </button>
                            <button className="w-full px-6 py-4 text-left bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                <span className="text-gray-700 font-medium">Interested Categories</span>
                            </button>
                            <button
                                onClick={() => setCurrentView('changePassword')}
                                className="w-full px-6 py-4 text-left bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-gray-700 font-medium">Change Password</span>
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Profile Picture */}
                            <div className="flex items-center mb-8">
                                <label htmlFor="imageUpload" className="cursor-pointer">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile"
                                            className="w-28 h-28 rounded-full object-cover mr-8"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-28 h-28 text-purple-900 mr-8" />
                                    )}
                                </label>
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <div className="space-x-4">
                                    <button
                                        onClick={handleImageUpload}
                                        className="px-4 py-2 text-purple-900 border-2 border-purple-900 rounded hover:shadow-2xl"
                                    >
                                        Change
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedImage(null);
                                            setImagePreview(null);
                                            handleImageUpload(); // Send update to remove image
                                        }}
                                        className="px-4 py-2 text-red-600 border-2 border-red-600 rounded hover:shadow-2xl"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleUpdateProfile} className="grid grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mobile Number <span className="text-red-500">*</span>
                                        </label>
                                        <PhoneInput
                                            country={'lk'} // Default to Sri Lanka
                                            value={formData.mobile}
                                            onChange={(value) => handleInputChange("mobile", value)}
                                            inputProps={{
                                                required: true,
                                                className:
                                                    "w-full px-11 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                                            }}
                                            containerStyle={{ width: "100%" }}
                                            inputStyle={{ width: "100%" }}
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            readOnly
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </form>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    type="button"
                                    className="px-6 py-2 text-black border-2 border-black rounded"
                                    onClick={() => setCurrentView("profile")}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-white bg-purple-900 rounded hover:bg-purple-950 transition-colors"
                                    disabled={isSaving}
                                    onClick={handleUpdateProfile}
                                >
                                    {isSaving ? 'Saving' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProfile = () => {
        const indexOfLastCard = currentPage * cardsPerPage;
        const indexOfFirstCard = indexOfLastCard - cardsPerPage;
        const currentCards = donationHistory.slice(indexOfFirstCard, indexOfLastCard);
        const totalPages = Math.ceil(donationHistory.length / cardsPerPage);

        const handlePageChange = (newPage) => {
            if (newPage > 0 && newPage <= totalPages) {
                setCurrentPage(newPage);
            }
        };

        return (
            <ErrorBoundary>
                <Header />
                <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-16">Profile</h1>

                        <div className="flex gap-8">
                            {/* Left Side - Profile Info */}
                            <div className="w-[26rem] p-6 h-fit">
                                {/* Profile Picture */}
                                <div className="flex flex-col items-center mb-6">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile"
                                            className="w-28 h-28 rounded-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-28 h-28 text-purple-900" />
                                    )}
                                    <h2 className="text-2xl font-semibold text-gray-900 mt-5">{formData.firstName} {formData.lastName}</h2>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-row justify-between gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-purple-600">{donationSummary.donationCount}</div>
                                        <div className="text-base text-black">Donations</div>
                                    </div>
                                    <div className="border-l-2 border-gray-300" />
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-purple-600">LKR {donationSummary.totalAmountMinor.toLocaleString()}</div>
                                        <div className="text-base text-black">Donated</div>
                                    </div>
                                </div>

                                {/* Interested Categories */}
                                <div className="mb-8">
                                    <h3 className="text-base font-medium text-gray-500 mb-7 text-center">Interested Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">Healthcare</span>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">Community</span>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">Animal Welfare</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setCurrentView('editProfile')}
                                        className="w-full flex cursor-pointer items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </button>
                                    <button className="w-full flex cursor-pointer items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </div>

                            <div className="border-l-2 border-gray-300 -mt-14" />

                            {/* Right Side - Donations History */}
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8 -mt-10">Donations History</h2>

                                <div className="space-y-4">
                                    {currentCards.length > 0 ? (
                                        currentCards.map((donation, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h3 className="text-lg font-semibold text-gray-900 w-[32rem] line-clamp-1">{donation.eventName}</h3>
                                                    <span className="text-xl font-medium text-purple-900">LKR {donation.amountMinor.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-items-start gap-9 text-sm text-gray-600">
                                                    <span className="text-base text-gray-500">{new Date(donation.donatedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                    <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs border-2">{donation.eventCategory.charAt(0).toUpperCase() + donation.eventCategory.slice(1)}</span>
                                                </div>
                                                <div className="flex flex-row gap-4 bg-yellow-50/70 p-2 my-4 rounded">
                                                    <TfiMedall className="text-2xl" />
                                                    <p className="line-clamp-1 text-sm">{donation.greetingSentence}</p>
                                                </div>
                                                <div className="flex flex-row justify-between mt-5">
                                                    <div className="flex flex-row gap-3">
                                                        <FaHandHoldingHeart className="text-pink-500 text-2xl" />
                                                        <p>Thank you for your generosity!</p>
                                                    </div>
                                                    <Link to={`/donation/${donation.event?._id?.toString() || ''}`}>
                                                        <button className="text-blue-500 hover:underline">View Charity</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-80 text-center mt-20 px-4">
                                            <div className="w-32 h-32 rounded-full bg-pink-200 mb-5 flex justify-center items-center">
                                                <FaHandHoldingHeart className="text-6xl text-white" />
                                            </div>

                                            <h3 className="text-2xl font-semibold mb-3">No donations yet</h3>
                                            <p className="text-gray-500 mb-8 text-lg">
                                                When you make a donation to any campaign, your<br /> contribution history will appear here.
                                            </p>
                                            <Link to="/allevents">
                                                <button className="bg-purple-900 cursor-pointer text-white px-6 py-2 rounded hover:bg-purple-950 transition">
                                                    Explore Campaigns
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {donationHistory.length > cardsPerPage && (
                                    <div className="flex justify-end gap-5 mt-4">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 bg-white border cursor-pointer border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <MdOutlineNavigateBefore />
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 bg-white border cursor-pointer border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            <MdOutlineNavigateNext />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        );
    };

    // Render based on current view
    switch (currentView) {
        case 'changePassword':
            return renderChangePassword();
        case 'editProfile':
            return (
                <>
                    <ToastContainer />
                    {renderEditProfile()}
                </>
            );
        default:
            return renderProfile();
    }
};

export default MyProfile;