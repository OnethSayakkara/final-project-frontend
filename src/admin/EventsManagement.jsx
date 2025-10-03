import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, User } from 'lucide-react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const EventsManagement = () => {
  const [activeTab, setActiveTab] = useState('Pending Events');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tabs for admin view
  const tabs = ['Pending Events', 'Volunteer Events', 'Non-Volunteer Events'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/event/allEvents');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Environment': return 'bg-green-100 text-green-700';
      case 'Healthcare': return 'bg-blue-100 text-blue-700';
      case 'Education': return 'bg-purple-100 text-purple-700';
      case 'Cancer': return 'bg-red-100 text-red-700';
      case 'Community': return 'bg-teal-100 text-teal-700';
      case 'Animal Welfare': return 'bg-orange-100 text-orange-700';
      case 'Emergency': return 'bg-red-100 text-red-700';
      case 'sports': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesTab = false;
    if (activeTab === 'Pending Events') {
      matchesTab = event.status === 'pending_review';
    } else if (activeTab === 'Volunteer Events') {
      matchesTab = ['volunteer', 'mixed'].includes(event.type);
    } else if (activeTab === 'Non-Volunteer Events') {
      matchesTab = ['fundraising', 'goods_collection'].includes(event.type);
    }
    const matchesTypeFilter = eventTypeFilter === 'All' || event.type === eventTypeFilter.toLowerCase();
    return matchesSearch && matchesTab && matchesTypeFilter;
  });

  // Render error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Events Management (Admin)</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Events Management (Admin)</h1>
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
            />
          </div>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-family-inter"
          >
            <option value="All">All Types</option>
            <option value="volunteer">Volunteer</option>
            <option value="fundraising">Fundraising</option>
            <option value="goods_collection">Goods Collection</option>
            <option value="mixed">Mixed</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-family-inter">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors font-family-inter ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
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
                        {event.status}
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
                          {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="font-family-inter">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="font-family-inter">{event.organizer?.name || 'Unknown Organizer'}</span>
                      </div>
                    </div>

                    {/* Additional Info if Rejected */}
                    {event.status === 'rejected' && event.rejectionReason && (
                      <div className="text-sm text-red-600 mb-4 font-family-inter">
                        Rejection Reason: {event.rejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="ml-4">
                    <NavLink
                      to={`/Admin/events/${event._id}`}
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium font-family-inter"
                      title="View Event Details"
                    >
                      Get Action
                    </NavLink>
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