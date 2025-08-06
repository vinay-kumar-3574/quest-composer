
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  Plane,
  Hotel,
  MessageCircle,
  AlertTriangle 
} from 'lucide-react';

const DashboardOverview = () => {
  const tripData = {
    destination: 'Dubai, UAE',
    duration: '7 days',
    budget: '$5,000',
    spent: '$2,340',
    currentDay: 3,
    upcomingActivity: 'Burj Khalifa Visit'
  };

  const quickActions = [
    { icon: MessageCircle, label: 'Ask AI Guide', path: '/guide/chat', color: 'bg-blue-600' },
    { icon: Calendar, label: 'View Itinerary', path: '/guide/itinerary', color: 'bg-green-600' },
    { icon: DollarSign, label: 'Track Budget', path: '/guide/budget', color: 'bg-purple-600' },
    { icon: AlertTriangle, label: 'Emergency SOS', path: '/guide/emergency', color: 'bg-red-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your trip overview</p>
        </div>
        <Badge className="bg-green-100 text-green-800">Day {tripData.currentDay} of 7</Badge>
      </div>

      {/* Trip Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <MapPin className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Destination</p>
              <p className="text-xl font-bold text-gray-900">{tripData.destination}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-xl font-bold text-gray-900">{tripData.duration}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget Used</p>
              <p className="text-xl font-bold text-gray-900">{tripData.spent}</p>
              <p className="text-xs text-gray-500">of {tripData.budget}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Activity</p>
              <p className="text-lg font-bold text-gray-900">{tripData.upcomingActivity}</p>
              <p className="text-xs text-gray-500">in 2 hours</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => window.location.href = action.path}
            >
              <div className={`p-2 ${action.color} text-white rounded-full`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Today's Schedule */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <div>
                <p className="font-medium">Burj Khalifa Visit</p>
                <p className="text-sm text-gray-600">Downtown Dubai</p>
              </div>
              <Badge>Current</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Dubai Mall Lunch</p>
                <p className="text-sm text-gray-600">12:00 PM</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Dubai Fountain Show</p>
                <p className="text-sm text-gray-600">3:00 PM</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Places Visited</span>
              <span className="font-bold">8 / 15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Budget Used</span>
              <span className="font-bold">46.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Photos Taken</span>
              <span className="font-bold">127</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Days Remaining</span>
              <span className="font-bold">4 days</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
