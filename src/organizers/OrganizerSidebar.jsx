import { Shield, MapPin, Users, Heart, ReceiptText, Mail, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const OrganizerSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/organizer/dashboard', icon: Shield },
    { name: 'Events', path: '/organizer/events', icon: MapPin },
    { name: 'Volunteers', path: '/organizer/volunteers', icon: Users },
    { name: 'Donations', path: '/organizer/donations', icon: Heart },
    { name: 'Bank Slips', path: '/organizer/bank-slip-approval', icon: ReceiptText },
    { name: 'Emails', path: '/organizer/emailupdates', icon: Mail },
  ];

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    
    // Optionally, call a backend endpoint to clear the refreshToken cookie
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include', // Include cookies for httpOnly refreshToken
    })
      .then(() => {
        navigate('/login');
      })
      .catch((err) => {
        console.error('Logout error:', err);
        // Navigate to login even if the backend call fails
        navigate('/login');
      });
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-purple-900 text-white shadow-lg flex flex-col gap-y-2">
      <div className="p-6">
        <h2 className="text-2xl font-semibold font-family-inter mb-16">Organizer Panel</h2>
        <nav className="flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-4 px-4 py-3 rounded-lg mt-5 hover:bg-purple-700 transition-colors font-family-inter text-base"
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-6 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-lg hover:bg-purple-700 transition-colors font-family-inter text-base"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default OrganizerSidebar;