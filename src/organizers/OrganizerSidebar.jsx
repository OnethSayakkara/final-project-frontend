import { Shield, MapPin, Users, Heart, PawPrint, BookOpen, ReceiptText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrganizerSidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/organizer/dashboard', icon: Shield },
    { name: 'Events', path: '/organizer/events', icon: MapPin },
    { name: 'Volunteers', path: '/organizer/volunteers', icon: Users },
    { name: 'Donations', path: '/organizer/donations', icon: Heart },
    { name: 'Bank Slips', path: '/organizer/bank-slip-approval', icon: ReceiptText },
    { name: 'Emails', path: '/organizer/emailupdates', icon: Mail },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-purple-800 text-white shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold font-family-inter mb-8">Organizer Panel</h2>
        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-4 px-4 py-6 rounded-lg hover:bg-purple-700 transition-colors font-family-inter text-base"
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default OrganizerSidebar;