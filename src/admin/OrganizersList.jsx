import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Info, Ban, Building, Plus, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrganizersList = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banning, setBanning] = useState(null); // Track banning/unbanning organizer ID
  const navigate = useNavigate();

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/organizer/organizers');
      console.log('DEBUG: Organizers response:', response.data);
      setOrganizers(response.data);
    } catch (err) {
      console.error('Error fetching organizers:', err.response?.data || err.message);
      setError('Failed to fetch organizer list.');
      toast.error('Failed to load organizers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const handleBanOrganizer = async (organizerId, currentStatus) => {
    const isBanning = currentStatus === 'active';
    const action = isBanning ? 'ban' : 'unban';
    if (!window.confirm(`Are you sure you want to ${action} this organizer?`)) {
      return;
    }

    try {
      setBanning(organizerId);
      await axios.put(`http://localhost:3000/organizer/organizers/${organizerId}/status`, {
        newStatus: isBanning ? 'banned' : 'active',
      });
      console.log(`DEBUG: Organizer ${action}ned, ID:`, organizerId);
      toast.success(`Organizer ${action}ned successfully!`);
      fetchOrganizers();
    } catch (err) {
      console.error(`Error ${action}ning organizer:`, err.response?.data || err.message);
      toast.error(`Failed to ${action} organizer.`);
    } finally {
      setBanning(null);
    }
  };

  const handleViewDetails = (organizerId) => {
    navigate(`/admin/organizers/${organizerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          Loading organizers...
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
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Organizer Management</h1>
          <button
            onClick={() => navigate('/admin/add-organizer')}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Add new organizer"
          >
            <Plus className="w-5 h-5" />
            Add New Organizer
          </button>
        </div>

        {organizers.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizers found</h3>
            <p className="text-gray-500">Click "Add New Organizer" to create an organizer account.</p>
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
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
                {organizers.map((organizer) => (
                  <tr
                    key={organizer._id}
                    className="hover:bg-gray-50 transition-colors"
                    role="row"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {organizer.img ? (
                        <img
                          src={organizer.img}
                          alt={`${organizer.organizationName}'s profile`}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center"
                        style={{ display: organizer.img ? 'none' : 'flex' }}
                      >
                        <Building className="w-6 h-6 text-white" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {organizer.organizationName || 'Unnamed Organization'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {organizer.email || 'No email'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          organizer.currentStatus === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {organizer.currentStatus || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(organizer._id)}
                          className="p-2 text-teal-600 hover:text-teal-700 rounded-full hover:bg-teal-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                          aria-label={`View details for ${organizer.organizationName}`}
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleBanOrganizer(organizer._id, organizer.currentStatus)}
                          disabled={banning === organizer._id}
                          className={`p-2 text-white rounded-full transition-colors focus:outline-none focus:ring-2 ${
                            banning === organizer._id
                              ? 'bg-gray-400 cursor-not-allowed focus:ring-gray-500'
                              : organizer.currentStatus === 'banned'
                              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                          }`}
                          aria-label={`${
                            organizer.currentStatus === 'banned' ? 'Unban' : 'Ban'
                          } organizer ${organizer.organizationName}`}
                        >
                          {organizer.currentStatus === 'banned' ? (
                            <RotateCcw className="w-5 h-5" />
                          ) : (
                            <Ban className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizersList;