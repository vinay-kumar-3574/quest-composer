
import React from 'react';
import { Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-orange-600">TravelAI</h1>
          <span className="text-sm text-gray-500">Your Smart Travel Companion</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
