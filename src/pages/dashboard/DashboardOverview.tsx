
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  MessageCircle, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  Plane, 
  Hotel,
  FileText,
  Star,
  TrendingUp,
  Clock,
  Users,
  Sparkles
} from 'lucide-react';
import { useTripExtraction } from '@/hooks/useTripExtraction';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { getTripData } = useTripExtraction();
  const tripData = getTripData();

  const quickActions = [
    {
      title: 'AI Travel Assistant',
      description: 'Chat with AI for instant travel help',
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-600',
      path: '/guide/chat'
    },
    {
      title: 'Smart Itinerary',
      description: 'AI-powered daily plans',
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
      path: '/guide/itinerary'
    },
    {
      title: 'Scenario Planner',
      description: 'Plan B for every situation',
      icon: MapPin,
      color: 'bg-purple-100 text-purple-600',
      path: '/guide/scenarios'
    },
    {
      title: 'Budget Tracker',
      description: 'Track expenses smartly',
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
      path: '/guide/budget'
    }
  ];

  const tripStats = [
    {
      title: 'Days to Go',
      value: tripData?.startDate !== 'Not specified' 
        ? Math.max(0, Math.ceil((new Date(tripData.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : '—',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Travelers',
      value: tripData?.travelers || '—',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Destination',
      value: tripData?.destination.split(',')[0] || 'Not Set',
      icon: MapPin,
      color: 'text-green-600'
    },
    {
      title: 'Duration',
      value: tripData?.duration || '—',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-8 w-8 text-orange-600 mr-3" />
            Welcome to Your Travel Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {tripData 
              ? `Planning your amazing trip to ${tripData.destination}` 
              : 'Start planning your next adventure with AI assistance'
            }
          </p>
        </div>
        {!tripData && (
          <Button 
            onClick={() => navigate('/guide/chat')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Planning
          </Button>
        )}
      </div>

      {/* Trip Stats */}
      {tripData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tripStats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => navigate(action.path)}
            >
              <div className="text-center space-y-4">
                <div className={`p-3 rounded-full w-fit mx-auto ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Dashboard Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Travel Progress</h3>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trip Planning</span>
                <Badge className="bg-green-100 text-green-800">
                  {tripData ? 'In Progress' : 'Not Started'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Flight Booking</span>
                <Badge variant="outline">Pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hotel Booking</span>
                <Badge variant="outline">Pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Itinerary Planning</span>
                <Badge variant="outline">Ready</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">AI Recommendations</h3>
              <Star className="h-5 w-5 text-orange-600" />
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium text-orange-800">💡 Pro Tip</p>
                <p className="text-sm text-orange-700 mt-1">
                  Start with our AI Travel Assistant to get personalized recommendations
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">🎯 Smart Planning</p>
                <p className="text-sm text-blue-700 mt-1">
                  Use Scenario Planner for backup options during your trip
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Emergency Access */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Emergency SOS
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Quick access to emergency services and assistance
            </p>
          </div>
          <Button 
            onClick={() => navigate('/guide/emergency')}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Access SOS
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;
