import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import register from '../../public/register.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error('Email is required.');
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!formData.password) {
      toast.error('Password is required.');
      return;
    }
   
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Store token and user ID in localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userId', data.user.id);

        // Navigate based on role
        switch (data.user.role) {
          case 'user':
            navigate('/');
            break;
          case 'organizer':
            navigate('/organizer-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            toast.error('Unknown role. Please contact support.');
            break;
        }
      } else {
        toast.error(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please check your network and try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="flex-1 relative">
        <img
          src={register}
          alt="Hands holding together"
          className="w-full h-full object-cover"
          onError={(e) => console.error('Image failed to load:', e)}
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-8 py-12">
        <div className="w-full max-w-md">
          {/* Form Header */}
          <div className="text-center mb-8">
            <p className="text-gray-600 text-base mb-2 font-family-inter">Welcome Back</p>
            <h1 className="text-3xl font-bold text-gray-900 font-family-inter">Login to your account</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-family-inter">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-4 py-3 border font-family-inter border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-family-inter">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border font-family-inter border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-end text-blue-500">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"

              className="w-full py-3 px-4 rounded-md font-family-inter font-medium text-white transition-colors bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
              Next
            </button>
          </form>

          <div className="flex justify-center mt-9 text-base font-family-inter gap-2">
            <p>Don't have an account?</p>
            <Link to="/register" className="text-blue-600 hover:text-blue-700 ml-1">Join us today</Link>
          </div>

          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    </div>
  );
};

export default Login;