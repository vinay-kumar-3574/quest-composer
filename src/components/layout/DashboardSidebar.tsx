
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MapPin, 
  MessageCircle, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  Plane, 
  Hotel,
  FileText,
  Home,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Overview', path: '/guide' },
  { icon: MessageCircle, label: 'AI Guide', path: '/guide/chat' },
  { icon: Calendar, label: 'Smart Itinerary', path: '/guide/itinerary' },
  { icon: MapPin, label: 'Scenario Planner', path: '/guide/scenarios' },
  { icon: DollarSign, label: 'Budget Tracker', path: '/guide/budget' },
  { icon: AlertTriangle, label: 'Emergency SOS', path: '/guide/emergency' },
  { icon: Plane, label: 'Flight Booking', path: '/guide/flights' },
  { icon: Hotel, label: 'Hotel Booking', path: '/guide/hotels' },
  { icon: RefreshCw, label: 'Return Booking', path: '/guide/return-booking' },
  { icon: FileText, label: 'Trip Summary', path: '/guide/summary' },
];

export const DashboardSidebar = () => {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="mb-4">
          <NavLink 
            to="/"
            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </NavLink>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/guide'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-orange-100 text-orange-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
