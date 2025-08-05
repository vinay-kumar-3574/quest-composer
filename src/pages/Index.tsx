
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChatInterface } from "@/components/ChatInterface";
import { TravelHero } from "@/components/TravelHero";
import { Send, Sparkles, MapPin, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [tripInput, setTripInput] = useState("");
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    setShowChat(true);
  };

  const handleQuickStart = (template: string) => {
    setTripInput(template);
    setShowChat(true);
  };

  const parseTripDetails = (input: string) => {
    // Simple parsing logic - in production, this would use GPT-4
    const details = {
      destination: "Dubai",
      travelers: "4 people",
      dates: "October 10-17",
      source: "Current location"
    };
    
    // Store in localStorage for now (would use Supabase in production)
    localStorage.setItem('tripDetails', JSON.stringify(details));
    
    toast.success("Trip details parsed successfully!");
    navigate("/trip-summary");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {!showChat ? (
        <div className="container mx-auto px-4 py-8">
          <TravelHero />
          
          <div className="max-w-4xl mx-auto mt-16">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Plan Your Perfect Trip with{" "}
                <span className="text-orange-600">AI</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Just tell us where you want to go, and we'll handle everything else
              </p>
            </div>

            <Card className="p-8 mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center space-x-2 text-orange-600">
                  <Sparkles className="h-6 w-6" />
                  <span className="text-lg font-medium">AI-Powered Travel Assistant</span>
                </div>
                
                <Button 
                  onClick={handleStartPlanning}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Start Planning Your Trip
                </Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: <MapPin className="h-8 w-8 text-orange-600" />,
                  title: "Smart Planning",
                  description: "AI analyzes your preferences to create the perfect itinerary",
                  template: "Plan a romantic weekend in Paris for 2 people"
                },
                {
                  icon: <Calendar className="h-8 w-8 text-orange-600" />,
                  title: "Flexible Booking",
                  description: "Book flights, hotels, and activities all in one place",
                  template: "Family trip to Disney World for 5 days with kids"
                },
                {
                  icon: <Users className="h-8 w-8 text-orange-600" />,
                  title: "Group Travel",
                  description: "Coordinate with friends and split expenses easily",
                  template: "Bachelor party in Las Vegas for 8 friends"
                }
              ].map((feature, index) => (
                <Card 
                  key={index}
                  className="p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 bg-white/60 backdrop-blur-sm"
                  onClick={() => handleQuickStart(feature.template)}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {feature.icon}
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <ChatInterface 
          initialInput={tripInput}
          onTripParsed={parseTripDetails}
          onBack={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default Index;
