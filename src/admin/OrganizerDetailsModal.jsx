import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowLeft, User, Calendar, Eye } from 'lucide-react';

const OrganizerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log('DEBUG: Fetching organizer for ID:', id);
        const organizerResponse = await axios.get(`http://localhost:3000/organizer/organizers/${id}`);
        console.log('DEBUG: Organizer response:', organizerResponse.data);
        if (!organizerResponse.data) {
          throw new Error('No organizer data returned');
        }
        setOrganizer(organizerResponse.data);

        console.log('DEBUG: Fetching events for organizer ID:', id);
        const eventsResponse = await axios.get(`http://localhost:3000/event/geteventsbyorganizer/${id}`);
        console.log('DEBUG: Events response:', eventsResponse.data);
        const approvedEvents = eventsResponse.data.filter(event => event.status === 'approved');
        setEvents(approvedEvents);
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
        setError('Failed to load organizer details or events.');
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
        console.log('DEBUG: Loading complete, organizer:', organizer, 'events:', events);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          Loading details...
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

  if (!organizer) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          Organizer not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/admin/organizers')}
          className="mb-6 flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Back to organizers list"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Organizers
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-200">
            {organizer.img ? (
              <img
                src={organizer.img}
                alt={`${organizer.organizationName}'s profile`}
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center"
              style={{ display: organizer.img ? 'none' : 'flex' }}
            >
              <User className="w-16 h-16 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{organizer.organizationName || 'Unnamed Organization'}</h1>
              <p className="text-lg text-gray-700 mt-1">{organizer.email || 'No email'}</p>
              <p className="text-sm text-gray-500 mt-1">
                Contact Person: {organizer.contactPersonName || 'Unknown'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Phone: {organizer.phoneNumber || 'No phone number'}
              </p>
              <p
                className={`mt-3 px-3 py-1 text-sm font-semibold rounded-full inline-block ${
                  organizer.currentStatus === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                Status: {organizer.currentStatus || 'Unknown'}
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Approved Events ({events.length})
            </h2>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Current Events</h3>
                <p className="text-gray-500">This organizer has no approved events at the moment.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {event.title || 'Untitled Event'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 capitalize">
                          Type: {event.type?.replace('_', ' ') || 'Unknown Type'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Date:{' '}
                          {event.eventDate
                            ? new Date(event.eventDate).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'No date'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Location: {event.location || 'No location'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Category: {event.category || 'No category'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Status:{' '}
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              event.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {event.status || 'Unknown'}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                          {event.description || 'No description available.'}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/Admin/events/${event._id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                        aria-label={`View details for ${event.title || 'event'}`}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDetails;