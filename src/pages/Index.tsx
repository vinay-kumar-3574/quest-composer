
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TravelHero } from "@/components/TravelHero";
import TripExtractionInterface from "@/components/TripExtractionInterface";
import { Sparkles, MapPin, Calendar, Users } from "lucide-react";

const Index = () => {
  const [showExtraction, setShowExtraction] = useState(false);
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    setShowExtraction(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {!showExtraction ? (
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
                },
                {
                  icon: <Calendar className="h-8 w-8 text-orange-600" />,
                  title: "Flexible Booking",
                  description: "Book flights, hotels, and activities all in one place",
                },
                {
                  icon: <Users className="h-8 w-8 text-orange-600" />,
                  title: "Group Travel",
                  description: "Coordinate with friends and split expenses easily",
                }
              ].map((feature, index) => (
                <Card 
                  key={index}
                  className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 bg-white/60 backdrop-blur-sm"
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
        <TripExtractionInterface />
      )}
    </div>
  );
};

export default Index;
