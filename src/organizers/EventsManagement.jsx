import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EventsManagement = () => {
  const [activeTab, setActiveTab] = useState('All Events');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ['All Events', 'Volunteer Events', 'Fundraising Campaigns'];
  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const organizerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!organizerId) {
      setError('Organizer ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        console.log('DEBUG: Fetching events for organizer ID:', organizerId);
        const response = await axios.get(`http://localhost:3000/event/geteventsbyorganizer/${organizerId}`);
        console.log('DEBUG: Events response:', response.data);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error.response?.data || error.message);
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [organizerId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'Upcoming': return 'bg-blue-100 text-blue-700';
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Environment': return 'bg-green-100 text-green-700';
      case 'Healthcare': return 'bg-blue-100 text-blue-700';
      case 'Education': return 'bg-purple-100 text-purple-700';
      case 'Cancer': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressPercentage = (current, total) => {
    return total > 0 ? Math.round((current / total) * 100) : 0;
  };

  const formatCurrency = (amount) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === 'All Events' ||
      (activeTab === 'Volunteer Events' && event.type === 'volunteer') ||
      (activeTab === 'Fundraising Campaigns' && event.type === 'fundraising');
    const matchesTypeFilter = eventTypeFilter === 'All' || event.type === eventTypeFilter.toLowerCase();
    const matchesStatusFilter = statusFilter === 'All' || event.status === statusFilter;
    console.log('DEBUG: Filtering event:', {
      id: event._id,
      title: event.title,
      matchesSearch,
      matchesTab,
      matchesTypeFilter,
      matchesStatusFilter,
    });
    return matchesSearch && matchesTab && matchesTypeFilter && matchesStatusFilter;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 font-family-inter">Events Management</h1>
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-family-inter">Events Management</h1>
          <Link to="/organizer/registerevents">
            <button
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              aria-label="Create new event"
            >
              <Plus className="w-5 h-5" />
              <span className="font-family-inter">Create Event</span>
            </button>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-family-inter"
              aria-label="Search events"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-family-inter"
            aria-label="Filter by event status"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Additional filters"
          >
            <Filter className="w-5 h-5" />
            <span className="font-family-inter">Filter</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } font-family-inter`}
                aria-label={`View ${tab}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 font-family-inter">Loading events...</p>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Event Title and Status */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 font-family-inter">{event.title}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status === 'pending_review' ? 'Pending Review' : event.status}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>

                    {/* Event Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-family-inter">
                          {event.eventDate
                            ? new Date(event.eventDate).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'No date'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="font-family-inter">{event.location || 'No location'}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(event.type === 'volunteer' || event.type === 'mixed') && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="font-family-inter">
                          {event.JoinedUsers?.length || 0}/{event.TargetVolunteers || 100} registered (
                          {getProgressPercentage(event.JoinedUsers?.length || 0, event.TargetVolunteers || 100)}%)
                        </span>
                        <div className="flex-1 max-w-xs">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${getProgressPercentage(
                                  event.JoinedUsers?.length || 0,
                                  event.TargetVolunteers || 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {(event.type === 'fundraising' || event.type === 'mixed') && (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="font-family-inter">
                          {formatCurrency(event.raisedAmount || 0)} of {formatCurrency(event.fundingGoal || 0)} raised (
                          {getProgressPercentage(event.raisedAmount || 0, event.fundingGoal || 0)}%)
                        </span>
                        <div className="flex-1 max-w-xs">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${getProgressPercentage(event.raisedAmount || 0, event.fundingGoal || 0)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label={`Edit event ${event.title}`}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`Delete event ${event.title}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-family-inter">No events found</h3>
              <p className="text-gray-500 font-family-inter">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsManagement;