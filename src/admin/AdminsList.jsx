import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Ban, Edit, Plus } from 'lucide-react';
import AddAdminModal from './AddAdminModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminsList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banning, setBanning] = useState(null); // Track banning admin ID

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/admin/admins');
      console.log('DEBUG: Admins response:', response.data);
      setAdmins(response.data);
    } catch (err) {
      console.error('Error fetching admins:', err.response?.data || err.message);
      setError('Failed to fetch admin list.');
      toast.error('Failed to load admins.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdminAdded = () => {
    setIsModalOpen(false);
    fetchAdmins();
  };

  const handleBanAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to ban this admin?')) {
      return;
    }

    try {
      setBanning(adminId);
      await axios.put(`http://localhost:3000/admin/${adminId}/ban`);
      toast.success('Admin banned successfully!');
      fetchAdmins();
    } catch (err) {
      console.error('Error banning admin:', err.response?.data || err.message);
      toast.error('Failed to ban admin.');
    } finally {
      setBanning(null);
    }
  };

  const handleEditAdmin = (adminId) => {
    toast.info('Edit admin functionality not implemented yet.');
    console.log('DEBUG: Edit admin:', adminId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          Loading admins...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
      <div className="max-w-7xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Add new admin"
          >
            <Plus className="w-5 h-5" />
            Add New Admin
          </button>
        </div>

        {admins.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
            <p className="text-gray-500">Click "Add New Admin" to create an admin account.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="hover:bg-gray-50 transition-colors"
                    role="row"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.img ? (
                        <img
                          src={admin.img}
                          alt={`${admin.email}'s profile`}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center"
                        style={{ display: admin.img ? 'none' : 'flex' }}
                      >
                        <User className="w-6 h-6 text-white" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {admin.role || 'Admin'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          admin.isBanned
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {admin.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditAdmin(admin._id)}
                          className="p-2 text-teal-600 hover:text-teal-700 rounded-full hover:bg-teal-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                          aria-label={`Edit admin ${admin.email}`}
                          disabled={banning === admin._id}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleBanAdmin(admin._id)}
                          disabled={banning === admin._id || admin.isBanned}
                          className={`p-2 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                            banning === admin._id || admin.isBanned
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                          aria-label={`Ban admin ${admin.email}`}
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AddAdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdminAdded={handleAdminAdded}
        />
      </div>
    </div>
  );
};

export default AdminsList;