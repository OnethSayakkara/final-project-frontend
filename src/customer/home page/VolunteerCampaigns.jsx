import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdLocationPin } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";

const VolunteerCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [programmeStatus, setProgrammeStatus] = useState('Active'); // Default status

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/event/allEvents');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();

        // Filter for volunteer events and randomize
        const volunteerEvents = data.filter(event => event.type === 'volunteer');
        const shuffledEvents = volunteerEvents.sort(() => 0.5 - Math.random());
        const randomThreeEvents = shuffledEvents.slice(0, 3);

        setCampaigns(randomThreeEvents);
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
      <h2 className="text-3xl font-medium text-gray-800 mb-20 text-center mt-10">Volunteer Campaigns</h2>
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
                <div className='flex flex-row gap-1'>
                    <MdLocationPin className='text-lg'/>
                     <p className="text-gray-600 text-sm">{campaign.location}</p>
                </div>
               
                <div className="border px-3 rounded-full text-center pb-0.5">
                  <p className="text-gray-600 text-xs">{campaign.category}</p>
                </div>
              </div>

                            {/* Event Date, Start Time, End Time */}
              <div className="flex flex-row justify-between text-gray-600 text-sm mb-4 font-medium font-family-inter">
              <div className='flex flex-row gap-1'>
                <MdDateRange className='text-lg text-black'/>
                <p>{new Date(campaign.eventDate).toLocaleDateString()}</p>
              </div>
                <div className='flex flex-row gap-1'>
                        <p>{campaign.startTime}</p>
                        <p>-</p>
                        <p>{campaign.endTime}</p>
                </div>
              </div>
              
              {/* Black divider above description */}
              <hr className="border-t border-black mb-4" />
              
              <p className="text-gray-500 text-base font-medium mb-4 line-clamp-2">
                {campaign.description.substring(0, 200)}...
              </p>
              {/* Joined Users Count */}
              <p className="text-gray-700 font-medium mb-4">
                {campaign.JoinedUsers ? campaign.JoinedUsers.length : 0} Joined 
              </p>
              
              <button
                onClick={() => handleButtonClick(campaign._id)}
                className="w-full bg-pink-700 text-white py-2 rounded hover:bg-pink-800"
              >
                {programmeStatus === 'Active' ? 'Register Now' : 'View'}
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

export default VolunteerCampaigns;