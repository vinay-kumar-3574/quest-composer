
import React, { useEffect, useState } from 'react';
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
  Sparkles,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useTripExtraction } from '@/hooks/useTripExtraction';
import { useOpenAIChat } from '@/hooks/useOpenAIChat';
import { toast } from 'sonner';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { getTripData } = useTripExtraction();
  const { sendMessage } = useOpenAIChat();
  const [tripData, setTripData] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    const data = getTripData();
    setTripData(data);
    if (data) {
      generateAIInsights(data);
    }
  }, [getTripData]);

  const generateAIInsights = async (data: any) => {
    setIsGeneratingInsights(true);
    
    const systemPrompt = `You are an expert travel advisor. Based on the trip data provided, generate personalized insights and recommendations. Return a JSON object with this structure:
    {
      "destinationHighlights": ["highlight1", "highlight2", "highlight3"],
      "bestTimeToVisit": "description",
      "culturalTips": ["tip1", "tip2", "tip3"],
      "budgetRecommendations": "budget advice",
      "weatherInfo": "weather description",
      "travelProgress": {
        "planningStatus": "status description",
        "nextSteps": ["step1", "step2"],
        "completionPercentage": 75
      },
      "smartRecommendations": ["rec1", "rec2", "rec3"],
      "riskAssessment": "low/medium/high with explanation"
    }`;

    try {
      const result = await sendMessage.mutateAsync({
        messages: [{ 
          role: 'user', 
          content: `Generate insights for a trip to ${data.destination} with ${data.travelers} travelers for ${data.duration}. Start date: ${data.startDate}, Budget: ${data.budget || 'Not specified'}, Interests: ${data.interests?.join(', ') || 'General tourism'}`
        }],
        systemPrompt
      });

      const insights = JSON.parse(result.content);
      setAiInsights(insights);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      toast.error('Failed to generate AI insights');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const quickActions = [
    {
      title: 'AI Travel Assistant',
      description: tripData ? `Get personalized help for your ${tripData.destination} trip` : 'Chat with AI for instant travel help',
      icon: MessageCircle,
      color: 'bg-blue-100 text-blue-600',
      path: '/guide/chat'
    },
    {
      title: 'Smart Itinerary',
      description: tripData ? `AI-powered ${tripData.duration} plan for ${tripData.destination.split(',')[0]}` : 'AI-powered daily plans',
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
      path: '/guide/itinerary'
    },
    {
      title: 'Scenario Planner',
      description: tripData ? `Backup plans for ${tripData.destination}` : 'Plan B for every situation',
      icon: Zap,
      color: 'bg-purple-100 text-purple-600',
      path: '/guide/scenarios'
    },
    {
      title: 'Budget Tracker',
      description: tripData?.budget && tripData.budget !== 'Not specified' ? `Manage your ${tripData.budget} budget` : 'Track expenses smartly',
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
      path: '/guide/budget'
    }
  ];

  const getTripStats = () => {
    if (!tripData) return [];
    
    const daysToGo = tripData?.startDate !== 'Not specified' 
      ? Math.max(0, Math.ceil((new Date(tripData.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      : '—';

    return [
      {
        title: 'Days to Go',
        value: daysToGo,
        icon: Clock,
        color: 'text-orange-600'
      },
      {
        title: 'Travelers',
        value: tripData.travelers || '—',
        icon: Users,
        color: 'text-blue-600'
      },
      {
        title: 'Destination',
        value: tripData.destination.split(',')[0] || 'Not Set',
        icon: MapPin,
        color: 'text-green-600'
      },
      {
        title: 'Duration',
        value: tripData.duration || '—',
        icon: Calendar,
        color: 'text-purple-600'
      }
    ];
  };

  const bookingActions = [
    {
      title: 'Book Flights',
      description: tripData ? `${tripData.origin || 'Your location'} → ${tripData.destination}` : 'Find the best flights',
      icon: Plane,
      color: 'bg-orange-100 text-orange-600',
      path: '/guide/flights'
    },
    {
      title: 'Book Hotels',
      description: tripData ? `Stay in ${tripData.destination.split(',')[0]}` : 'Find perfect accommodation',
      icon: Hotel,
      color: 'bg-purple-100 text-purple-600',
      path: '/guide/hotels'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-10 w-10 text-orange-600 mr-4" />
            Welcome to Your AI Travel Dashboard
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            {tripData 
              ? `Planning your amazing trip to ${tripData.destination}` 
              : 'Start planning your next adventure with AI assistance'
            }
          </p>
          {aiInsights?.bestTimeToVisit && (
            <p className="text-sm text-gray-500 mt-1">
              💡 {aiInsights.bestTimeToVisit}
            </p>
          )}
        </div>
        {!tripData && (
          <Button 
            onClick={() => navigate('/')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Plan Your Trip
          </Button>
        )}
        {tripData && (
          <Button 
            onClick={() => generateAIInsights(tripData)}
            disabled={isGeneratingInsights}
            variant="outline"
            className="border-orange-600 text-orange-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
            {isGeneratingInsights ? 'Generating...' : 'Refresh AI Insights'}
          </Button>
        )}
      </div>

      {/* Trip Stats */}
      {tripData && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
            Your Trip Overview
            {aiInsights && (
              <Badge className="ml-3 bg-green-100 text-green-800">
                AI Enhanced
              </Badge>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getTripStats().map((stat, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* AI Destination Highlights */}
      {aiInsights?.destinationHighlights && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2" />
            AI-Curated Destination Highlights
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {aiInsights.destinationHighlights.map((highlight: string, index: number) => (
              <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-700">✨ {highlight}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          🚀 Smart Travel Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm"
              onClick={() => navigate(action.path)}
            >
              <div className="text-center space-y-4">
                <div className={`p-4 rounded-full w-fit mx-auto ${action.color}`}>
                  <action.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Booking Actions */}
      {tripData && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            ✈️ Ready to Book?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookingActions.map((action, index) => (
              <Card 
                key={index}
                className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-white via-white to-gray-50"
                onClick={() => navigate(action.path)}
              >
                <div className="flex items-center space-x-6">
                  <div className={`p-4 rounded-full ${action.color}`}>
                    <action.icon className="h-10 w-10" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 mb-4">{action.description}</p>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get AI Recommendations
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Travel Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Travel Progress</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              {aiInsights?.travelProgress?.completionPercentage && (
                <Badge className="bg-green-100 text-green-800">
                  {aiInsights.travelProgress.completionPercentage}% Complete
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Trip Planning</span>
              <Badge className={tripData ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {tripData ? 'Completed' : 'Not Started'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Flight Booking</span>
              <Badge variant="outline">Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Hotel Booking</span>
              <Badge variant="outline">Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Itinerary Planning</span>
              <Badge className={tripData ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                {tripData ? 'Ready' : 'Pending'}
              </Badge>
            </div>
          </div>
          {aiInsights?.travelProgress?.nextSteps && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800 mb-2">🎯 Next Steps:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                {aiInsights.travelProgress.nextSteps.map((step: string, index: number) => (
                  <li key={index}>• {step}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">AI Recommendations</h3>
            <Star className="h-6 w-6 text-orange-600" />
          </div>
          <div className="space-y-4">
            {tripData ? (
              <>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">✅ Trip Extracted</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your {tripData.destination} trip details are ready for booking
                  </p>
                </div>
                {aiInsights?.smartRecommendations && aiInsights.smartRecommendations.map((rec: string, index: number) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">💡 AI Insight</p>
                    <p className="text-sm text-blue-700 mt-1">{rec}</p>
                  </div>
                ))}
                {aiInsights?.riskAssessment && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">⚠️ Risk Assessment</p>
                    <p className="text-sm text-yellow-700 mt-1">{aiInsights.riskAssessment}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">💡 Get Started</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Start by describing your trip to get AI-powered recommendations
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">🎯 Smart Planning</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Our AI will extract all details and create personalized suggestions
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Cultural Tips */}
      {aiInsights?.culturalTips && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Cultural Tips for {tripData?.destination.split(',')[0]}
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {aiInsights.culturalTips.map((tip: string, index: number) => (
              <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-gray-700">🎭 {tip}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Emergency Access */}
      <Card className="p-6 bg-gradient-to-r from-red-50 to-red-100 border-red-200 border-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-red-800 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Emergency SOS
            </h3>
            <p className="text-red-700 mt-1">
              AI-powered emergency assistance and local emergency services for {tripData?.destination || 'your destination'}
            </p>
          </div>
          <Button 
            onClick={() => navigate('/guide/emergency')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Access SOS
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;
