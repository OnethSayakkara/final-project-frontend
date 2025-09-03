import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const FundraisingCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [programmeStatus, setProgrammeStatus] = useState('Active'); // Default status

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/event/allEvents');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();

        // Filter for fundraising events and randomize
        const fundraisingEvents = data.filter(event => event.type === 'fundraising');
        const shuffledEvents = fundraisingEvents.sort(() => 0.5 - Math.random());
        const randomThreeEvents = shuffledEvents.slice(0, 3);

        // Add percentage calculation to each campaign
        const campaignsWithPercentage = randomThreeEvents.map(campaign => ({
          ...campaign,
          percentage: campaign.fundingGoal > 0 ? `${Math.round((campaign.raisedAmount / campaign.fundingGoal) * 100)}%` : '0%',
        }));

        setCampaigns(campaignsWithPercentage);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const navigate = useNavigate();

  const handleButtonClick = (id) => {
    navigate(`/donation/${id}`);
  };

  return (
    <section className="py-8 px-48 font-family-inter">
      <h2 className="text-3xl font-medium text-gray-800 mb-20 mt-7 text-center">Fundraising Campaigns</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="bg-white shadow-lg rounded-lg overflow-hidden relative">
            <img
              src={campaign.img || 'https://via.placeholder.com/300x200?text=Campaign+Image'}
              alt={campaign.title}
              className="w-full h-48 object-cover"
            />
            {/* Stats overlay at top-left of image */}
            <div className="absolute top-2 left-2">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {campaign.status === 'approved' ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>
              
              {/* Location and Category in flex-row below image */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600 text-sm">{campaign.location ? `🌍 ${campaign.location}` : '🏥 Unknown'}</p>
                <div className="border px-3 rounded-full text-center pb-0.5">
                  <p className="text-gray-600 text-xs">{campaign.category}</p>
                </div>
              </div>
              
              {/* Black divider above description */}
              <hr className="border-t border-black mb-4" />
              
              <p className="text-gray-500 text-base font-medium mb-4 line-clamp-2">
                {campaign.description.substring(0, 200)}...
              </p>
              
              {/* Enhanced Goal, Raised, and Percentage Section */}
              <div className="flex justify-between items-center mb-4">
                {/* Circular Progress Indicator */}
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="none"
                      strokeDasharray={`${(parseInt(campaign.percentage?.replace('%', '') || '0') / 100) * 201.06} 201.06`}
                      className={campaign.percentage === '0%' ? "text-gray-300" : "text-green-500"}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-bold font-family-inter text-gray-900">
                      {campaign.percentage || '0%'}
                    </span>
                  </div>
                </div>

                {/* Raised and Goal Information */}
                <div className="flex flex-col space-y-1 flex-1 ml-10">
                  <div className="flex items-center">
                    <span className="text-green-600 font-semibold text-lg font-family-inter w-16">Raised:</span>
                    <span className="font-bold text-lg text-gray-900 font-family-inter">
                      LKR {campaign.raisedAmount?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-purple-600 font-semibold text-lg font-family-inter w-16">Goal:</span>
                    <span className="font-bold text-lg text-gray-900 font-family-inter">
                      LKR {campaign.fundingGoal?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleButtonClick(campaign._id)}
                className="w-full bg-pink-700 text-white py-2 rounded hover:bg-pink-800"
              >
                {programmeStatus === 'Active' ? 'Donate Now' : 'View'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-14 mb-9">
        <Link to='/allevents'><button className="bg-purple-900 text-white px-6 py-2 rounded hover:bg-purple-950">
          See More
        </button></Link>
      </div>
    </section>
  );
};

export default FundraisingCampaigns;