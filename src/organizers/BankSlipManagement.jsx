import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BankSlipManagement = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState({ isOpen: false, message: '', type: '' });

  const organizerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!organizerId) {
      setError('Organizer ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchDonations = async () => {
      try {
        setLoading(true);
        console.log('DEBUG: Fetching bank slip donations for organizer:', {
          organizerId,
          page,
          limit,
          status: statusFilter,
        });
        const response = await axios.get(`http://localhost:3000/bankslipdonation/getbankslipsby/${organizerId}`, {
          params: { page, limit, status: statusFilter || undefined },
        });
        console.log('DEBUG: Bank slip donations response:', response.data);
        setDonations(response.data.donations);
        setTotalPages(Math.ceil(response.data.count / limit));
      } catch (error) {
        console.error('Error fetching bank slip donations:', error.response?.data || error.message);
        setError('Failed to fetch bank slip donations. Please try again later.');
        setModal({
          isOpen: true,
          message: error.response?.data?.message || 'Failed to fetch bank slip donations.',
          type: 'error',
        });
        toast.error('Failed to fetch donations.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [organizerId, page, statusFilter]);

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      console.log('DEBUG: Updating bank slip status:', { donationId, newStatus });
      const response = await axios.put(`http://localhost:3000/bankslipdonation/updatebankslip/${donationId}`, {
        status: newStatus,
      });
      console.log('DEBUG: Update response:', response.data);
      setDonations((prev) =>
        prev.map((donation) =>
          donation._id === donationId ? { ...donation, DonationAdminStatus: newStatus } : donation
        )
      );
      setModal({
        isOpen: true,
        message: `Donation ${newStatus.toLowerCase()} successfully!`,
        type: 'success',
      });
      toast.success(`Donation ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Error updating bank slip status:', error.response?.data || error.message);
      setModal({
        isOpen: true,
        message: error.response?.data?.message || `Failed to ${newStatus.toLowerCase()} donation.`,
        type: 'error',
      });
      toast.error(`Failed to ${newStatus.toLowerCase()} donation.`);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: '', type: '' });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">Bank Slip Management</h1>
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-family-inter">
      <ToastContainer position="top-right" autoClose={3000} />
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              {modal.type === 'error' ? (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {modal.type === 'error' ? 'Error' : 'Success'}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">{modal.message}</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Bank Slip Management</h1>

        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-[200px] border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount (LKR)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Bank Slip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                      <span className="ml-2 text-gray-500">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    No bank slip donations found.
                  </td>
                </tr>
              ) : (
                donations.map((donation) => (
                  <tr key={donation._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{donation.eventId.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{donation.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{donation.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(donation.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a href={donation.img} target="_blank" rel="noopener noreferrer">
                        <button className="p-2 text-teal-600 hover:text-teal-700" aria-label="View bank slip">
                          <Image className="h-5 w-5" />
                        </button>
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donation.DonationAdminStatus === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(donation._id, 'Approved')}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                            aria-label="Approve donation"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(donation._id, 'Rejected')}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                            aria-label="Reject donation"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to{' '}
            {Math.min(page * limit, donations.length + (page - 1) * limit)} of{' '}
            {donations.length + (page - 1) * limit} donations
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-teal-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-teal-400"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankSlipManagement;