import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, Image, X, User } from 'lucide-react';
import { toast } from 'react-toastify';

const AddAdminModal = ({ isOpen, onClose, onAdminAdded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:3000/admin/create-admin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Admin created successfully!', { autoClose: 2000 });
      onAdminAdded();
    } catch (err) {
      console.error('Error creating admin:', err.response?.data || err.message);
      const message = err.response?.data?.message || 'Failed to create admin.';
      toast.error(message);
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
      setImage(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md font-family-inter transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-3">
            Add New Admin
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 text-gray-500" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              required
              placeholder="Enter admin email"
              aria-required="true"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Lock className="w-4 h-4 text-gray-500" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              required
              placeholder="Enter admin password"
              aria-required="true"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Image className="w-4 h-4 text-gray-500" />
              Profile Image (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-teal-50 file:text-teal-700 file:hover:bg-teal-100 transition-colors"
                accept="image/*"
              />
              {image && (
                <p className="mt-2 text-sm text-gray-600 truncate">{image.name}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Cancel adding admin"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
              }`}
              aria-label="Add admin"
            >
              {loading ? 'Adding...' : 'Add Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;