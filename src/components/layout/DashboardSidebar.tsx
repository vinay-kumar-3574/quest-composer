
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  MessageCircle, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  FileText,
  Home,
  RefreshCw,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Plane,
  Hotel
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Overview', path: '/guide' },
  { icon: MessageCircle, label: 'AI Assistant', path: '/guide/chat' },
  { icon: Calendar, label: 'Smart Itinerary', path: '/guide/itinerary' },
  { icon: Zap, label: 'Scenario Planner', path: '/guide/scenarios' },
  { icon: DollarSign, label: 'Budget Tracker', path: '/guide/budget' },
  { icon: Plane, label: 'Flight Booking', path: '/guide/flights' },
  { icon: Hotel, label: 'Hotel Booking', path: '/guide/hotels' },
  { icon: AlertTriangle, label: 'Emergency SOS', path: '/guide/emergency' },
  { icon: RefreshCw, label: 'Return Booking', path: '/guide/return-booking' },
  { icon: FileText, label: 'Trip Summary', path: '/guide/summary' },
];

export const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        {/* Collapse Button */}
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <NavLink 
              to="/"
              className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </NavLink>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto hover:bg-orange-100"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* AI Badge */}
        {!isCollapsed && (
          <div className="mb-6 p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">AI-Powered Travel</span>
            </div>
            <p className="text-xs text-orange-600 mt-1">Smart planning at your fingertips</p>
          </div>
        )}
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/guide'}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-orange-100 text-orange-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${isCollapsed ? 'justify-center' : 'space-x-3'}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapsed AI Info */}
        {isCollapsed && (
          <div className="mt-6 p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg">
            <Sparkles className="h-5 w-5 text-orange-600 mx-auto" />
          </div>
        )}
      </div>
    </aside>
  );
};
