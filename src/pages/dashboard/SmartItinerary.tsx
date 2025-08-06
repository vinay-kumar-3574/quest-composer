
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star, Calendar, RefreshCw, Plus } from 'lucide-react';
import { useOpenAIChat } from '@/hooks/useOpenAIChat';
import { toast } from 'sonner';

const SmartItinerary = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const { sendMessage } = useOpenAIChat();

  const itinerary = {
    day1: [
      {
        time: "9:00 AM",
        activity: "Burj Khalifa Visit",
        location: "Downtown Dubai",
        duration: "2 hours",
        status: "completed",
        rating: 4.8,
        description: "Visit the world's tallest building"
      },
      {
        time: "12:00 PM",
        activity: "Dubai Mall Exploration",
        location: "Downtown Dubai",
        duration: "3 hours",
        status: "current",
        rating: 4.7,
        description: "Shopping and dining experience"
      },
      {
        time: "4:00 PM",
        activity: "Dubai Fountain Show",
        location: "Dubai Mall",
        duration: "1 hour",
        status: "upcoming",
        rating: 4.9,
        description: "Spectacular water and light show"
      }
    ],
    day2: [
      {
        time: "10:00 AM",
        activity: "Dubai Marina Walk",
        location: "Dubai Marina",
        duration: "2 hours",
        status: "upcoming",
        rating: 4.6,
        description: "Scenic waterfront promenade"
      },
      {
        time: "1:00 PM",
        activity: "Atlantis Aquaventure",
        location: "Palm Jumeirah",
        duration: "4 hours",
        status: "upcoming",
        rating: 4.5,
        description: "Water park adventure"
      }
    ]
  };

  const generateSmartPlan = async () => {
    setIsGenerating(true);
    
    try {
      const systemPrompt = `You are an expert travel planner for Dubai. Generate a detailed, optimized itinerary based on:
      - Current location and weather
      - Popular attractions and hidden gems
      - Optimal travel routes to minimize time
      - Local events and seasonal activities
      - Budget considerations
      - Cultural experiences
      
      Provide a structured plan with specific times, locations, durations, and practical tips.`;

      await sendMessage.mutateAsync({
        messages: [{ role: 'user', content: 'Generate an optimized 3-day Dubai itinerary for first-time visitors focusing on must-see attractions, local culture, and unique experiences.' }],
        systemPrompt
      });

      toast.success("Smart itinerary generated successfully!");
    } catch (error) {
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const days = Object.keys(itinerary);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Itinerary</h1>
          <p className="text-gray-600">AI-optimized daily plans for your Dubai trip</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={generateSmartPlan}
            disabled={isGenerating}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Regenerate Plan'}
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Day Selector */}
      <Card className="p-4">
        <div className="flex space-x-2">
          {days.map((day, index) => (
            <Button
              key={day}
              variant={selectedDay === index + 1 ? "default" : "outline"}
              onClick={() => setSelectedDay(index + 1)}
              className={selectedDay === index + 1 ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Day {index + 1}
            </Button>
          ))}
        </div>
      </Card>

      {/* Itinerary Display */}
      <div className="grid gap-4">
        {itinerary[`day${selectedDay}` as keyof typeof itinerary]?.map((item, index) => (
          <Card key={index} className={`p-6 transition-all duration-300 ${
            item.status === 'current' 
              ? 'ring-2 ring-orange-500 bg-orange-50' 
              : item.status === 'completed'
              ? 'bg-green-50 opacity-75'
              : 'hover:shadow-md'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">{item.time}</span>
                  </div>
                  <Badge 
                    className={
                      item.status === 'current' ? 'bg-orange-100 text-orange-800' :
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{item.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.activity}</h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{item.location}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{item.duration}</span>
                </div>

                <p className="text-gray-600 mb-4">{item.description}</p>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Get Directions
                  </Button>
                  {item.status === 'upcoming' && (
                    <Button size="sm" variant="outline">
                      Modify Time
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Optimization Panel */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Optimization Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Best time to visit Burj Khalifa: Early morning for clearer views</li>
              <li>• Dubai Mall is less crowded on weekday mornings</li>
              <li>• Book Dubai Fountain dinner viewing for tomorrow evening</li>
              <li>• Weather forecast shows light rain - indoor activities recommended</li>
            </ul>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Apply Suggestions
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SmartItinerary;
