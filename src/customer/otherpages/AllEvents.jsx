import { useState, useEffect } from 'react';
import { MapPin, Heart, Users, PawPrint, BookOpen, AlertTriangle, TreePine, Shield, Trophy } from 'lucide-react';
import { RiVirusLine } from "react-icons/ri";
import Lottie from "lottie-react";
import animationData from "../../../public/No-Data.json";
import Header from '../../common/Header';
import { Link } from 'react-router-dom';
import { MdDateRange } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import Footer from '../../common/Footer';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return <h1 className="text-center text-red-600 mt-8">Something went wrong. Please try again later.</h1>;
  }

  return children;
};

const CharityEventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Date Added (Newest)');
  const [activeTab, setActiveTab] = useState('Trending');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const categories = [
    { name: 'Healthcare', icon: Heart, color: 'bg-pink-100' },
    { name: 'Community', icon: Users, color: 'bg-gray-100' },
    { name: 'Animal Welfare', icon: PawPrint, color: 'bg-gray-100' },
    { name: 'Education', icon: BookOpen, color: 'bg-gray-100' },
    { name: 'Emergency', icon: AlertTriangle, color: 'bg-gray-100' },
    { name: 'Environment', icon: TreePine, color: 'bg-gray-100' },
    { name: 'Cancer', icon: RiVirusLine, color: 'bg-gray-100' },
    { name: 'sports', icon: Trophy, color: 'bg-gray-100' },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/event/allEvents');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let updatedEvents = [...events];

    if (selectedCategory !== 'All') {
      updatedEvents = updatedEvents.filter(event => event.category === selectedCategory);
    }

    if (selectedStatus) {
      updatedEvents = updatedEvents.filter(event => {
        if (selectedStatus === 'Active') {
          return event.programmeStatus === 'Active' ||
            (event.programmeStatus !== 'Expired' && new Date(event.eventDate) >= new Date());
        } else if (selectedStatus === 'Expired') {
          return event.programmeStatus === 'Expired' || new Date(event.eventDate) < new Date();
        } else if (selectedStatus === 'Completed') {
          return event.programmeStatus === 'Completed';
        }
        return true;
      });
    }

    if (selectedTypes.length > 0) {
      updatedEvents = updatedEvents.filter(event => selectedTypes.includes(event.type));
    }

    if (dateRange.from || dateRange.to) {
      updatedEvents = updatedEvents.filter(event => {
        const eventDate = new Date(event.createdAt).toISOString().split('T')[0];
        const fromDate = dateRange.from;
        const toDate = dateRange.to;

        if (fromDate && toDate) {
          return eventDate >= fromDate && eventDate <= toDate;
        } else if (fromDate) {
          return eventDate >= fromDate;
        } else if (toDate) {
          return eventDate <= toDate;
        }
        return true;
      });
    }

    updatedEvents.sort((a, b) => {
      if (sortBy === 'Amount Raised') {
        return b.raisedAmount - a.raisedAmount;
      } else if (sortBy === 'Goal Amount') {
        return b.fundingGoal - a.fundingGoal;
      } else {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortBy === 'Date Added (Newest)' ? dateB - dateA : dateA - dateB;
      }
    });

    updatedEvents = updatedEvents.map(event => ({
      ...event,
      percentage: event.type !== 'volunteer' && event.fundingGoal > 0 ? `${Math.round((event.raisedAmount / event.fundingGoal) * 100)}%` : '0%',
    }));

    setFilteredEvents(updatedEvents);
  }, [selectedCategory, selectedStatus, selectedTypes, dateRange, sortBy, events]);

  const handleDateSelect = (dateString) => {
    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      setDateRange({ from: dateString, to: '' });
    } else if (dateString >= dateRange.from) {
      setDateRange({ ...dateRange, to: dateString });
    } else {
      setDateRange({ from: dateString, to: dateRange.from });
    }
  };

  return (
    <ErrorBoundary>
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 mt-14">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-lg font-semibold font-family-inter text-gray-800 mb-8">Find Causes You Care About</h1>

            <div className="overflow-x-auto mb-13">
              <div className="flex gap-4 min-w-max pb-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.name;
                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`flex flex-col items-center justify-center font-family-inter p-3 rounded-lg border transition-all duration-200 min-w-[150px] ${isSelected
                        ? 'bg-pink-100 border-pink-200 text-pink-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {Icon && (
                        <div className={`p-2 rounded-full mb-2 ${isSelected ? 'bg-pink-200' : 'bg-gray-100'}`}>
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-pink-600' : 'text-gray-500'}`} />
                        </div>
                      )}
                      <span className="text-sm font-medium text-center whitespace-nowrap">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-8">
              <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <button className="text-blue-600 text-base font-family-inter mb-6 hover:underline" onClick={() => {
                    setSelectedStatus('Active');
                    setSelectedTypes([]);
                    setDateRange({ from: '', to: '' });
                    setSortBy('Date Added (Newest)');
                    setShowDatePicker(false);
                  }}>Reset</button>

                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-family-inter"
                    />
                    <button className="w-full mt-3 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-family-inter">
                      Search
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-base font-semibold text-black font-family-inter">Sort By</label>
                    </div>
                    <div className="relative border border-gray-300 rounded-md bg-white shadow-sm hover:border-gray-400">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-3 pr-10 bg-transparent text-gray-700 text-sm appearance-none cursor-pointer focus:outline-none font-family-inter"
                      >
                        <option className="font-family-inter">Date Added (Newest)</option>
                        <option className="font-family-inter">Date Added (Oldest)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-base font-semibold text-black font-family-inter">Programme Status</label>
                    </div>
                    <div className="space-y-4">
                      {['Active', 'Expired', 'Completed'].map((status) => (
                        <label key={status} className="flex items-center">
                          <input
                            type="radio"
                            name="programmeStatus"
                            className="border-gray-300 text-blue-600 mr-2"
                            checked={selectedStatus === status}
                            onChange={() => setSelectedStatus(status)}
                          />
                          <span className="text-base font-medium text-gray-500 font-family-inter">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-base font-semibold text-black font-family-inter">Programme Type</label>
                    </div>
                    <div className="space-y-4">
                      {['fundraising', 'goods_collection', 'volunteer', 'mixed'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 mr-2"
                            checked={selectedTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTypes([...selectedTypes, type]);
                              } else {
                                setSelectedTypes(selectedTypes.filter(t => t !== type));
                              }
                            }}
                          />
                          <span className="text-base font-medium text-gray-600 font-family-inter">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-base font-semibold text-black font-family-inter">Posted Date</label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Select date range"
                        value={dateRange.from && dateRange.to
                          ? `${dateRange.from} to ${dateRange.to}`
                          : dateRange.from
                            ? `From ${dateRange.from}`
                            : dateRange.to
                              ? `Until ${dateRange.to}`
                              : ''
                        }
                        readOnly
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-family-inter cursor-pointer bg-white"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>

                      {showDatePicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-80">
                          <div className="flex justify-between items-center mb-4">
                            <button
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <h3 className="font-semibold text-purple-600 font-family-inter">
                              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>

                          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
                            <div>Sun</div>
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                          </div>

                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 42 }, (_, i) => {
                              const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                              const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                              const startDate = new Date(firstDayOfMonth);
                              startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

                              const cellDate = new Date(startDate);
                              cellDate.setDate(cellDate.getDate() + i);

                              const isCurrentMonth = cellDate.getMonth() === currentMonth.getMonth();
                              const dateString = cellDate.toISOString().split('T')[0];
                              const isSelected = dateString === dateRange.from || dateString === dateRange.to;
                              const isInRange = dateRange.from && dateRange.to && dateString >= dateRange.from && dateString <= dateRange.to;

                              return (
                                <button
                                  key={i}
                                  onClick={() => handleDateSelect(dateString)}
                                  className={`w-8 h-8 text-xs rounded transition-colors ${!isCurrentMonth
                                      ? 'text-gray-300 hover:bg-gray-50'
                                      : isSelected
                                        ? 'bg-purple-600 text-white'
                                        : isInRange
                                          ? 'bg-purple-100 text-purple-600'
                                          : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                  {cellDate.getDate()}
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <button
                              onClick={() => {
                                setDateRange({ from: '', to: '' });
                                setShowDatePicker(false);
                              }}
                              className="text-sm text-gray-500 hover:text-gray-700 font-family-inter"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => setShowDatePicker(false)}
                              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors font-family-inter"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-base font-semibold text-black font-family-inter">Location</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="px-6">
                  <h2 className="text-xl font-semibold font-family-inter text-gray-800 mb-4">All Charity Programmes</h2>

                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                    {['Trending', 'Featured', 'All'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 text-sm font-medium transition-all duration-200 rounded-md font-family-inter ${activeTab === tab
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <div className='border-[0.1px] mb-7 border-zinc-200 mt-5' />

                <div className="space-y-6">
                  {filteredEvents.map((event) => (
                    <div key={event._id} className="bg-white rounded-lg shadow-sm overflow-hidden relative">
                      {(event.programmeStatus === 'Expired' || new Date(event.eventDate) < new Date()) && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded z-10">
                          EXPIRED
                        </div>
                      )}

                      <div className="flex">
                        <div className="w-60 h-[17rem] flex-shrink-0">
                          <img
                            src={event.img || '/api/placeholder/240/180'}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 px-6 py-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-2xl font-bold font-family-inter text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className='font-family-inter text-base'>{event.location}</span>
                                <span className="ml-8 bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs border-2 font-family-inter">
                                  {event.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='border-[0.1px] mb-3 border-zinc-200' />

                          <p className="text-gray-600 font-family-inter text-sm text-shadow-gray-500 font-medium mb-6 line-clamp-2">
                            {event.description}
                          </p>

                          {event.type === 'volunteer' && (
                            <div className="flex flex-row justify-between text-gray-600 font-family-inter mb-6">
                              <div className='flex flex-row gap-3'>
                                <MdDateRange className='text-xl' />
                                <p className='text-base'>{new Date(event.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </div>
                              <div className='flex flex-row gap-2'>
                                <FaRegClock className='text-xl mr-2'/>
                                 <p className='text-base'>{event.startTime || 'N/A'}</p>
                                 <p>-</p>
                                  <p className='text-base'>{event.endTime || 'N/A'}</p>
                              </div>

                            </div>
                          )}

                          {event.type !== 'volunteer' && (
                            <div className="flex justify-between items-end">
                              <div className="flex items-center gap-8">
                                <div className="relative w-20 h-20">
                                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                                    <circle
                                      cx="40"
                                      cy="40"
                                      r="32"
                                      stroke="currentColor"
                                      strokeWidth="6"
                                      fill="none"
                                      className="text-gray-200"
                                    />
                                    <circle
                                      cx="40"
                                      cy="40"
                                      r="32"
                                      stroke="currentColor"
                                      strokeWidth="6"
                                      fill="none"
                                      strokeDasharray={`${(parseInt(event.percentage?.replace('%', '') || '0') / 100) * 201.06} 201.06`}
                                      className={event.percentage === '0%' ? "text-gray-300" : "text-green-500"}
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold font-family-inter text-gray-900">{event.percentage || '0%'}</span>
                                  </div>
                                </div>

                                <div className="flex flex-col space-y-2">
                                  <div className="flex items-center">
                                    <span className="text-green-600 font-semibold text-xl font-family-inter w-32">Raised:</span>
                                    <span className="font-bold text-xl text-gray-900 font-family-inter">LKR {event.raisedAmount?.toLocaleString() || '0'}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-purple-600 font-semibold text-xl font-family-inter w-32">Goal:</span>
                                    <span className="font-bold text-xl text-gray-900 font-family-inter">LKR {event.fundingGoal?.toLocaleString() || '0'}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="ml-8">
                                {(event.programmeStatus === 'Expired' || new Date(event.eventDate) < new Date()) ? (
                                  <button className="bg-gray-600 text-white cursor-pointer px-8 py-2 font-family-inter rounded-md hover:bg-gray-700 transition-colors font-medium">
                                    View
                                  </button>
                                ) : (
                                  <Link to={`/donation/${event._id}`} className="bg-purple-600 text-white cursor-pointer px-8 py-2 font-family-inter rounded-md hover:bg-purple-700 transition-colors font-medium">
                                    Donate Now
                                  </Link>
                                )}
                              </div>
                            </div>
                          )}

                          {event.type === 'volunteer' && (
                            <div className="flex justify-end">
                              <div className="ml-8">
                                {(event.programmeStatus === 'Expired' || new Date(event.eventDate) < new Date()) ? (
                                  <button className="bg-gray-600 text-white cursor-pointer px-8 py-2 font-family-inter rounded-md hover:bg-gray-700 transition-colors font-medium">
                                    View
                                  </button>
                                ) : (
                                  <Link to={`/donation/${event._id}`} className="bg-purple-600 text-white cursor-pointer px-8 py-2 font-family-inter rounded-md hover:bg-purple-700 transition-colors font-medium">
                                    Register Now
                                  </Link>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {(!events.length || !filteredEvents.length) && (
                  <div className="text-center mt-12 px-8">
                    <div className="mb-8 flex justify-center">
                      <img
                        src="/No-Data.json"
                        alt="No data illustration"
                        className="w-80 h-80 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-purple-600 font-family-inter mb-4">No results found!</h3>
                    <p className="text-gray-500 text-lg font-family-inter mb-2">
                      No results match the current filter criteria. Check the spelling or try to remove filters.
                    </p>
                    <div className="flex justify-center items-center h-screen -mt-32">
                      <Lottie
                        animationData={animationData}
                        loop={true}
                        style={{ width: 400, height: 400 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </ErrorBoundary>
  );
};

export default CharityEventsPage;