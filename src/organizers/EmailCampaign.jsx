import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Filter, Mail } from 'lucide-react';

const EmailCampaign = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('Reminder: Upcoming Volunteer Event');
  const [message, setMessage] = useState('Dear {{name}}, this is a reminder about your upcoming volunteer event: {{event_name}} on {{event_date}}.');
  const [loading, setLoading] = useState(false);

  // Fetch events data on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/event/volunteer-users/68bb0c220258851dd2262867');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get joined users for selected event
  const getSelectedEventUsers = () => {
    const event = events.find(e => e.eventId === selectedEvent);
    return event ? event.joinedUsers : [];
  };

  // Filter users based on search term
  const filteredUsers = getSelectedEventUsers().filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all users
  const toggleSelectAll = () => {
    const allUserIds = filteredUsers.map(user => user.id);
    if (selectedUsers.length === allUserIds.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(allUserIds);
    }
  };

  // Send email function
  const sendEmail = async () => {
    if (!selectedEvent || selectedUsers.length === 0) {
      alert('Please select an event and at least one recipient');
      return;
    }

    try {
      setLoading(true);
      // Replace with your actual send email API endpoint
      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: selectedEvent,
          recipients: selectedUsers,
          subject: subject,
          message: message
        })
      });

      if (response.ok) {
        alert('Email sent successfully!');
        setSelectedUsers([]);
        setSelectedEvent('');
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-family-inter">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Email Campaign</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Select Recipients */}
        <div className=" p-6 border border-black/10 rounded-lg bg-white">
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
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="">-- Select an event --</option>
                {events.map(event => (
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                    className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
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
                  filteredUsers.map(user => (
                    <div key={user.id} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Email subject"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder="Email message"
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
                className="flex-1 flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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