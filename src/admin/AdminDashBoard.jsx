import { useState, useEffect } from "react";
import { Calendar, MapPin, AlertCircle, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import axios from "axios";

// Custom Card components (mimics shadcn/ui Card)
const Card = ({ className = "", children }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);

// Function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const AdminDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        // Fetch all events using the getAllEvents endpoint
        const response = await axios.get("http://localhost:3000/event/allEvents");
        // Filter for pending events (status: 'pending_review')
        const pending = response.data.filter(event => event.status === 'pending_review');
        // Shuffle the pending events and select the first 3
        const randomPending = shuffleArray(pending).slice(0, 3);
        setPendingEvents(randomPending);
      } catch (error) {
        console.error("Error fetching pending events:", error);
        setError('Failed to fetch pending events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingEvents();
  }, []);

  // Function to get category color (matching EventsManagement styling)
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

  // Render error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-family-inter">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-family-inter">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        {/* Pending Events Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Pending Events</CardTitle>
            <CardDescription>Events awaiting review</CardDescription>
          </CardHeader>
          <div className="p-6 pt-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Loading pending events...</p>
              </div>
            ) : pendingEvents.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No pending events found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(event.category)}`}>
                          {event.category}
                        </span>
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">
                          Pending Review
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(event.eventDate).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{event.organizer?.name || 'Unknown Organizer'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <NavLink
                        to={`/organizer/events/${event._id}`}
                        className="text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Review
                      </NavLink>
                    </div>
                  </div>
                ))}
                <div className="mt-4 flex justify-end">
                  <NavLink
                    to="/organizer/events"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                  >
                    See More
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;