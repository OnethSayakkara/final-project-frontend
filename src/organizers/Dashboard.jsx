import { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Landmark,
  ReceiptText
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

// 🔹 Helper to generate month sequence from earliest start month to current
function generateMonthSequence(events) {
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  // Find the earliest start month
  let earliestMonth = currentMonth;
  Object.values(events).forEach(event => {
    if (event.monthlyTotals.length > 0) {
      const firstMonth = event.monthlyTotals[0].month;
      if (firstMonth < earliestMonth) {
        earliestMonth = firstMonth;
      }
    }
  });

  // Generate sequence from earliest to current
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
      
      // Calculate cumulative total up to this month
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
  const TARGET_VOLUNTEERS = 100;
  
  return volunteerData.map(event => {
    const eventName = event.eventName.length > 20 
      ? event.eventName.substring(0, 17) + "..." 
      : event.eventName;
    
    return {
      name: eventName,
      fullName: event.eventName,
      "Registered Volunteers": event.joinedUsers.length,
      "Target": TARGET_VOLUNTEERS
    };
  });
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalDonations: 0,
    totalVolunteers: 0,
    pendingBankSlips: 0,
  });

  const [donationData, setDonationData] = useState([]);
  const [volunteerData, setVolunteerData] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [volunteerLoading, setVolunteerLoading] = useState(true);

  // Replace with logged-in organizer ID
  const organizerId = "68bb0c220258851dd2262867";

  useEffect(() => {
    const fetchStatsAndDonations = async () => {
      try {
        const donationsRes = await axios.get(
          `http://localhost:3000/donation/progress/organizer/${organizerId}`
        );

        const data = donationsRes.data;
        
        // Filter events that have donation data
        const eventsWithData = Object.keys(data).filter(eventName => 
          data[eventName].monthlyTotals.length > 0
        );

        // Build cumulative chart data
        const chartData = buildCumulativeChartData(data);

        // Calculate total stats
        let totalDonations = 0;
        let totalEvents = Object.keys(data).length;
        
        Object.values(data).forEach(event => {
          totalDonations += event.overallSummary.grandTotal;
        });

        setStats(prev => ({
          ...prev,
          totalEvents,
          totalDonations
        }));

        setDonationData(chartData);
        setEventNames(eventsWithData);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchVolunteerData = async () => {
      try {
        const volunteerRes = await axios.get(
          `http://localhost:3000/event/volunteer-users/${organizerId}`
        );
        
        const volunteerChartData = buildVolunteerProgressData(volunteerRes.data);
        
        // Calculate total volunteers
        const totalVolunteers = volunteerRes.data.reduce((total, event) => {
          return total + event.joinedUsers.length;
        }, 0);

        setStats(prev => ({
          ...prev,
          totalVolunteers
        }));

        setVolunteerData(volunteerChartData);
        
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
      } finally {
        setVolunteerLoading(false);
      }
    };

    fetchStatsAndDonations();
    fetchVolunteerData();
  }, [organizerId]);

  // Color palette similar to the reference image
  const colors = ["#8B5A3C", "#4C72B0", "#55A3A3", "#C44E52", "#8172B3", "#CCB974"];

  return (
    <div className="min-h-screen bg-gray-50 font-family-inter">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Organizer Dashboard
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Total Events</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalEvents}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Landmark className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Total Donations</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              LKR {stats.totalDonations.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Total Volunteers</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalVolunteers}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <ReceiptText className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Pending Bank Slips</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.pendingBankSlips}</p>
          </div>
        </div>

        {/* Charts Section - Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Fundraising Progress Chart */}
          <div className="p-6 shadow-md bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Fundraising Progress</h2>
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

          {/* Volunteer Registration Progress Chart */}
          <div className="p-6 shadow-md bg-white rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Volunteer Registration Progress</h2>
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
                    fill="#2563eb" 
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
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/organizer/events"
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              Manage Events
            </Link>
            <Link
              to="/organizer/bank-slip-approval"
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              Approve Bank Slips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;