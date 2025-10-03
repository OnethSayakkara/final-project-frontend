import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Calendar,
    ReceiptText,
    LogOut,
    User,
    UserRoundSearch
} from "lucide-react";

const AdminSidebar = () => {
    // Retrieve userId from local storage
    const userId = localStorage.getItem('userId');

    // Navigation items
    const navItems = [
        {
            to: "/Admin/admindashboard",
            icon: <LayoutDashboard className="w-5 h-5" />,
            label: "Dashboard",
        },
        {
            to: "/Admin/allevents",
            icon: <Calendar className="w-5 h-5" />,
            label: "Pending Events",
        },
        {
            to: "/Admin/bank-slip-approval",
            icon: <ReceiptText className="w-5 h-5" />,
            label: "Bank Slip Approval",
        },
        {
            to: "/Admin/admins",
            icon: <User className="w-5 h-5" />,
            label: "Manage Admins",
        },
        {
            to: "/Admin/organizers",
            icon: <UserRoundSearch className="w-5 h-5" />,
            label: "Manage Organizers",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-800 text-white w-64 fixed top-0 left-0 flex flex-col font-family-inter">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold">Admin Portal</h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                                        ? "bg-teal-600 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={() => {
                        localStorage.removeItem('userId');
                        window.location.href = '/login'; // Redirect to login page
                    }}
                    className="flex items-center gap-3 p-3 w-full text-left rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;