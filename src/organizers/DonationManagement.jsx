import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from 'axios';

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

const DonationManagement = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [campaigns, setCampaigns] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    averageDonation: 0,
    totalDonors: 0,
    conversionRate: 0,
  });

  // Replace with logged-in organizer ID
  const organizerId = "68bb0c220258851dd2262867";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch campaigns (fundraising events)
        const eventsRes = await axios.get(`http://localhost:3000/event/geteventsbyorganizer/${organizerId}`);
        const fundraisingEvents = eventsRes.data.filter(event => event.type === 'fundraising');
        setCampaigns(fundraisingEvents);

        // Fetch donation progress for chart
        const donationsRes = await axios.get(`http://localhost:3000/donation/progress/organizer/${organizerId}`);
        const data = donationsRes.data;
        const eventsWithData = Object.keys(data).filter(eventName => data[eventName].monthlyTotals.length > 0);
        const chartData = buildCumulativeChartData(data);

        // Calculate stats (simplified based on available data)
        let totalDonations = 0;
        let totalDonors = 0;
        Object.values(data).forEach(event => {
          totalDonations += event.overallSummary.grandTotal;
          totalDonors += event.overallSummary.JoinedUsers || 0; // Assuming donorCount is available
        });
        const averageDonation = totalDonors > 0 ? totalDonations / totalDonors : 0;
        const conversionRate = totalDonors > 0 ? (totalDonors / 1000) * 100 : 0; // Placeholder logic

        setStats({
          totalDonations,
          averageDonation,
          totalDonors,
          conversionRate,
        });

        setChartData(chartData);
        setEventNames(eventsWithData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [organizerId]);

  const formatCurrency = (amount) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-teal-600';
    if (progress >= 80) return 'bg-teal-600';
    if (progress >= 50) return 'bg-teal-600';
    return 'bg-teal-600';
  };

  const statsData = [
    {
      title: 'Total Donations',
      value: formatCurrency(stats.totalDonations),
      change: '+12.5% from last month',
      isPositive: true,
    },
    {
      title: 'Average Donation',
      value: formatCurrency(stats.averageDonation),
      change: '+5.2% from last month',
      isPositive: true,
    },
    {
      title: 'Total Donors',
      value: stats.totalDonors.toString(),
      change: '+23.1% from last month',
      isPositive: true,
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      change: '-0.5% from last month',
      isPositive: false,
    },
  ];

  const tabs = ['Overview', 'Donations', 'Campaigns'];

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-6 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Donation Management</h1>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-500"> {stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`flex items-center text-sm ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Fundraising Progress Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8 font-family-inter">
          <h2 className="text-lg font-semibold mb-6 text-gray-900">Fundraising Progress</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading donation data...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No fundraising data available.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart 
                data={chartData}
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
                    stroke={['#8B5A3C', '#4C72B0', '#55A3A3', '#C44E52', '#8172B3', '#CCB974'][i % 6]}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: ['#8B5A3C', '#4C72B0', '#55A3A3', '#C44E52', '#8172B3', '#CCB974'][i % 6] }}
                    name={eventName.length > 30 ? eventName.substring(0, 27) + "..." : eventName}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Campaigns Table */}
        <div className="bg-white rounded-lg border border-gray-200 bottom-3">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Campaigns</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Raised
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Goal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donors
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(campaign.raisedAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(campaign.fundingGoal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 mr-3">
                          {Math.round((campaign.raisedAmount / campaign.fundingGoal) * 100)}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(Math.round((campaign.raisedAmount / campaign.fundingGoal) * 100))}`}
                            style={{ width: `${Math.round((campaign.raisedAmount / campaign.fundingGoal) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {campaign.JoinedUsers.length}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationManagement;