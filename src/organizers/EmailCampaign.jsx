import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Filter, Mail, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailCampaign = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: '', type: '' });

  const organizerId = localStorage.getItem('userId');

  useEffect(() => {
    fetchEvents();
  }, [organizerId]);

  const fetchEvents = async () => {
    if (!organizerId) {
      setModal({
        isOpen: true,
        message: 'Organizer ID not found. Please log in.',
        type: 'error',
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('DEBUG: Fetching events for organizer ID:', organizerId);
      const response = await axios.get(`http://localhost:3000/event/volunteer-users/${organizerId}`);
      console.log('DEBUG: Events response:', response.data);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error.response?.data || error.message);
      setModal({
        isOpen: true,
        message: 'Failed to fetch events. Please try again later.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedEventUsers = () => {
    const event = events.find((e) => e.eventId === selectedEvent);
    return event ? event.joinedUsers : [];
  };

  const filteredUsers = getSelectedEventUsers().filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    const allUserIds = filteredUsers.map((user) => user.id);
    setSelectedUsers((prev) =>
      prev.length === allUserIds.length ? [] : allUserIds
    );
  };

  const sendEmail = async () => {
    if (!selectedEvent || selectedUsers.length === 0) {
      setModal({
        isOpen: true,
        message: 'Please select an event and at least one recipient.',
        type: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      console.log('DEBUG: Sending email with data:', {
        eventId: selectedEvent,
        recipients: selectedUsers,
        subject,
        message,
      });
      const response = await axios.post('http://localhost:3000/event/send-campaign', {
        eventId: selectedEvent,
        recipients: selectedUsers,
        subject,
        message,
      });
      console.log('DEBUG: Email response:', response.data);
      setModal({
        isOpen: true,
        message: 'Email sent successfully!',
        type: 'success',
      });
      setSelectedUsers([]);
      setSelectedEvent('');
      setSubject('');
      setMessage('');
      toast.success('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error.message);
      setModal({
        isOpen: true,
        message: error.response?.data?.message || 'Failed to send email.',
        type: 'error',
      });
      toast.error('Failed to send email.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: '', type: '' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-family-inter">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              {modal.type === 'error' ? (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {modal.type === 'error' ? 'Error' : 'Success'}
              </h2>
            </div>
            <p className="text-gray-600 mb-6">{modal.message}</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Close modal"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Email Campaign</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Select Recipients */}
        <div className="p-6 border border-black/10 rounded-lg bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Recipients</h2>
          {/* Event Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Event
            </label>
            <div className="relative">
              <select
                value={selectedEvent}
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  setSelectedUsers([]);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Select event"
                disabled={loading}
              >
                <option value="">-- Select an event --</option>
                {events.map((event) => (
                  <option key={event.eventId} value={event.eventId}>
                    {event.eventName} ({event.joinedUsers.length} volunteers)
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {/* User Search */}
          {selectedEvent && (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Search users"
                />
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {/* Select All */}
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="mr-2 h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    aria-label="Select all users"
                  />
                  <span className="text-sm font-medium text-gray-700">Select All</span>
                </label>
                <span className="text-sm text-gray-500">{selectedUsers.length} selected</span>
              </div>
              {/* User List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {selectedEvent ? 'No volunteers found for this event' : 'Select an event to view volunteers'}
                  </p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        aria-label={`Select ${user.firstName} ${user.lastName}`}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 truncate">{user.email}</div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Volunteer
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        {/* Right Panel - Compose Email */}
        <div className="bg-gray-50 p-6 rounded-lg border border-black/10">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Compose Email</h2>
          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Email subject"
              aria-label="Email subject"
            />
          </div>
          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="Email message"
              aria-label="Email message"
            />
          </div>
          {/* Send Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                Sending to {selectedUsers.length} recipients
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={sendEmail}
                disabled={loading || !selectedEvent || selectedUsers.length === 0}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  loading || !selectedEvent || selectedUsers.length === 0
                    ? 'bg-teal-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
                aria-label="Send email"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Mail className="h-5 w-5 mr-2" />
                )}
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCampaign;