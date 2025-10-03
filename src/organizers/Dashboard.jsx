import { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Landmark,
  ReceiptText,
  TrendingUpIcon,
  TrendingDownIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

// Custom Badge component (mimics shadcn/ui Badge)
const Badge = ({ variant = "default", className = "", children }) => {
  const baseClasses = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2";
  const variantClasses = {
    default: "border-transparent bg-teal-600 text-white hover:bg-teal-700",
    outline: "text-gray-900 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900"
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Custom Card components (mimics shadcn/ui Card)
const Card = ({ className = "", children }) => (
  <div className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardFooter = ({ className = "", children }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// 🔹 Helper to generate month sequence from earliest start month to current
function generateMonthSequence(events) {
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  let earliestMonth = currentMonth;
  Object.values(events).forEach(event => {
    if (event.monthlyTotals.length > 0) {
      const firstMonth = event.monthlyTotals[0].month;
      if (firstMonth < earliestMonth) {
        earliestMonth = firstMonth;
      }
    }
  });

  const months = [];
  const [startYear, startMonth] = earliestMonth.split('-').map(Number);
  const [endYear, endMonth] = currentMonth.split('-').map(Number);
  
  let year = startYear;
  let month = startMonth;
  
  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${String(month).padStart(2, '0')}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  
  return months;
}

// 🔹 Helper to format month for display (e.g., "2025-07" -> "Jul")
function formatMonthForDisplay(monthStr) {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short' });
}

// 🔹 Helper to build cumulative chart data
function buildCumulativeChartData(eventsData) {
  const eventNames = Object.keys(eventsData).filter(name => 
    eventsData[name].monthlyTotals.length > 0
  );
  
  if (eventNames.length === 0) return [];
  
  const months = generateMonthSequence(eventsData);
  
  const chartData = months.map(month => {
    const monthData = {
      month: formatMonthForDisplay(month),
      fullMonth: month
    };
    
    eventNames.forEach(eventName => {
      const event = eventsData[eventName];
      let cumulativeTotal = 0;
      event.monthlyTotals.forEach(monthlyData => {
        if (monthlyData.month <= month) {
          cumulativeTotal += monthlyData.grandTotal;
        }
      });
      monthData[eventName] = cumulativeTotal;
    });
    
    return monthData;
  });
  
  return chartData;
}

// 🔹 Helper to format Y-axis values (e.g., 20000 -> "20K")
function formatYAxisValue(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${Math.round(value / 1000)}K`;
  }
  return value.toString();
}

// 🔹 Helper to build volunteer progress chart data
function buildVolunteerProgressData(volunteerData) {
  return volunteerData.map(event => {
    const eventName = event.eventName.length > 20 
      ? event.eventName.substring(0, 17) + "..." 
      : event.eventName;
    const targetVolunteers = event.TargetVolunteers || 100; // Use TargetVolunteers or default to 100
    
    console.log('DEBUG: Volunteer progress for event:', {
      eventId: event.eventId,
      eventName: event.eventName,
      joinedUsers: event.joinedUsers.length,
      targetVolunteers
    });
    
    return {
      name: eventName,
      fullName: event.eventName,
      "Registered Volunteers": event.joinedUsers.length,
      "Target": targetVolunteers
    };
  });
}

// 🔹 Calculate percentage change
function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous * 100);
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalDonations: 0,
    totalVolunteers: 0,
    pendingBankSlips: 0,
    prevTotalEvents: 0,
    prevTotalDonations: 0,
    prevTotalVolunteers: 0,
    prevPendingBankSlips: 0,
  });

  const [donationData, setDonationData] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [volunteerLoading, setVolunteerLoading] = useState(true);
  const [error, setError] = useState(null);

  const organizerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!organizerId) {
      setError('Organizer ID not found. Please log in again.');
      setLoading(false);
      setVolunteerLoading(false);
      return;
    }

    const fetchStatsAndDonations = async () => {
      try {
        console.log('DEBUG: Fetching donation data for organizer:', organizerId);
        const donationsRes = await axios.get(
          `http://localhost:3000/donation/progress/organizer/${organizerId}`
        );
        console.log('DEBUG: Donation data response:', donationsRes.data);

        const data = donationsRes.data;
        const eventsWithData = Object.keys(data).filter(eventName => 
          data[eventName].monthlyTotals.length > 0
        );
        const chartData = buildCumulativeChartData(data);

        let totalDonations = 0;
        let totalEvents = Object.keys(data).length;
        
        Object.values(data).forEach(event => {
          totalDonations += event.overallSummary.grandTotal;
        });

        setStats(prev => ({
          ...prev,
          totalEvents,
          totalDonations,
          prevTotalEvents: Math.floor(totalEvents * 0.9),
          prevTotalDonations: Math.floor(totalDonations * 0.85),
        }));

        setDonationData(chartData);
        setEventNames(eventsWithData);
        
      } catch (error) {
        console.error("Error fetching donation data:", error.response?.data || error.message);
        setError('Failed to fetch donation data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchVolunteerData = async () => {
      try {
        console.log('DEBUG: Fetching volunteer data for organizer:', organizerId);
        const volunteerRes = await axios.get(
          `http://localhost:3000/event/volunteer-users/${organizerId}`
        );
        console.log('DEBUG: Volunteer data response:', volunteerRes.data);
        
        const volunteerChartData = buildVolunteerProgressData(volunteerRes.data);
        
        const totalVolunteers = volunteerRes.data.reduce((total, event) => {
          return total + event.joinedUsers.length;
        }, 0);

        setStats(prev => ({
          ...prev,
          totalVolunteers,
          prevTotalVolunteers: Math.floor(totalVolunteers * 0.8),
          prevPendingBankSlips: 15, // Mock data
        }));

        setVolunteerData(volunteerChartData);
        
      } catch (error) {
        console.error("Error fetching volunteer data:", error.response?.data || error.message);
        setError('Failed to fetch volunteer data. Please try again later.');
      } finally {
        setVolunteerLoading(false);
      }
    };

    fetchStatsAndDonations();
    fetchVolunteerData();
  }, [organizerId]);

  // Color palette for charts
  const colors = ["#2dd4bf", "#4c72b0", "#55a3a3", "#c44e52", "#8172b3", "#ccb974"];

  // Calculate percentage changes
  const eventsChange = calculatePercentageChange(stats.totalEvents, stats.prevTotalEvents);
  const donationsChange = calculatePercentageChange(stats.totalDonations, stats.prevTotalDonations);
  const volunteersChange = calculatePercentageChange(stats.totalVolunteers, stats.prevTotalVolunteers);
  const bankSlipsChange = calculatePercentageChange(stats.pendingBankSlips, stats.prevPendingBankSlips);

  // Render error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-family-inter">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-family-inter">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 px-4 lg:px-6">
          <Card className="bg-gradient-to-t from-teal-50 to-white">
            <CardHeader className="relative">
              <CardDescription className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                Total Events
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {stats.totalEvents}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {eventsChange >= 0 ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {eventsChange >= 0 ? '+' : ''}{eventsChange.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {eventsChange >= 0 ? 'Growing this period' : 'Down this period'}
                {eventsChange >= 0 ? (
                  <TrendingUpIcon className="size-4" />
                ) : (
                  <TrendingDownIcon className="size-4" />
                )}
              </div>
              <div className="text-gray-500">
                Event creation tracking
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-t from-teal-50 to-white">
            <CardHeader className="relative">
              <CardDescription className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-teal-600" />
                Total Donations
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                LKR {stats.totalDonations.toLocaleString()}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {donationsChange >= 0 ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {donationsChange >= 0 ? '+' : ''}{donationsChange.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {donationsChange >= 0 ? 'Fundraising up' : 'Fundraising down'}
                {donationsChange >= 0 ? (
                  <TrendingUpIcon className="size-4" />
                ) : (
                  <TrendingDownIcon className="size-4" />
                )}
              </div>
              <div className="text-gray-500">
                Across all your events
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-t from-teal-50 to-white">
            <CardHeader className="relative">
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                Total Volunteers
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {stats.totalVolunteers}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {volunteersChange >= 0 ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {volunteersChange >= 0 ? '+' : ''}{volunteersChange.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {volunteersChange >= 0 ? 'Strong engagement' : 'Engagement needs boost'}
                {volunteersChange >= 0 ? (
                  <TrendingUpIcon className="size-4" />
                ) : (
                  <TrendingDownIcon className="size-4" />
                )}
              </div>
              <div className="text-gray-500">
                Volunteer participation
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-t from-teal-50 to-white">
            <CardHeader className="relative">
              <CardDescription className="flex items-center gap-2">
                <ReceiptText className="w-4 h-4 text-teal-600" />
                Pending Bank Slips
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {stats.pendingBankSlips}
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                  {bankSlipsChange >= 0 ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  {bankSlipsChange >= 0 ? '+' : ''}{bankSlipsChange.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stats.pendingBankSlips > 10 ? 'Needs attention' : 'Under control'}
                {stats.pendingBankSlips > 10 ? (
                  <TrendingUpIcon className="size-4" />
                ) : (
                  <TrendingDownIcon className="size-4" />
                )}
              </div>
              <div className="text-gray-500">
                Awaiting approval
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Charts Section - Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8 px-6">
          {/* Fundraising Progress Chart */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Fundraising Progress</CardTitle>
            </CardHeader>
            <div className="p-6 pt-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">Loading donation data...</p>
                </div>
              ) : donationData.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">No fundraising data available.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart 
                    data={donationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                      tickFormatter={formatYAxisValue}
                      domain={[0, 'dataMax']}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        `LKR ${value.toLocaleString()}`, 
                        name
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                    {eventNames.map((eventName, i) => (
                      <Line
                        key={i}
                        type="monotone"
                        dataKey={eventName}
                        stroke={colors[i % colors.length]}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: colors[i % colors.length] }}
                        name={eventName.length > 30 ? eventName.substring(0, 27) + "..." : eventName}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Volunteer Registration Progress Chart */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Volunteer Registration Progress</CardTitle>
            </CardHeader>
            <div className="p-6 pt-0">
              {volunteerLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">Loading volunteer data...</p>
                </div>
              ) : volunteerData.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">No volunteer data available.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={volunteerData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#666' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                      domain={[0, 'dataMax']}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label, payload) => {
                        const item = volunteerData.find(d => d.name === label);
                        return item ? item.fullName : label;
                      }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="Registered Volunteers" 
                      fill="#2dd4bf" 
                      name="Registered Volunteers"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar 
                      dataKey="Target" 
                      fill="#d1d5db" 
                      name="Target"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;