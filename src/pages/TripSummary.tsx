
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Plane, Hotel, Camera, Edit3 } from "lucide-react";
import { toast } from "sonner";

const TripSummary = () => {
  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('tripDetails');
    if (stored) {
      setTripDetails(JSON.parse(stored));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleProceedToBooking = (type: 'flights' | 'hotels') => {
    toast.success(`Proceeding to ${type} booking!`);
    navigate(`/${type}`);
  };

  if (!tripDetails) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Trip Summary</h1>
          <p className="text-lg text-gray-600">Review your trip details and proceed to booking</p>
        </div>

        {/* Main Trip Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Destination</h3>
                    <p className="text-2xl font-bold text-orange-600">{tripDetails.destination}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Travel Dates</h3>
                    <p className="text-xl font-semibold text-blue-600">{tripDetails.dates}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Travelers</h3>
                    <p className="text-xl font-semibold text-green-600">{tripDetails.travelers}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <div className="text-center text-white">
                    <Camera className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Dubai</h3>
                    <p className="text-orange-100">Adventure Awaits!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  Trip Duration: 7 Days
                </Badge>
                <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-white/60 backdrop-blur-sm"
                onClick={() => handleProceedToBooking('flights')}>
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto">
                <Plane className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Book Flights</h3>
              <p className="text-gray-600">Find the best flight deals for your journey</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Search Flights
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-white/60 backdrop-blur-sm"
                onClick={() => handleProceedToBooking('hotels')}>
            <div className="text-center space-y-4">
              <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto">
                <Hotel className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Book Hotels</h3>
              <p className="text-gray-600">Find perfect accommodations for your stay</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Search Hotels
              </Button>
            </div>
          </Card>
        </div>

        {/* Additional Options */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="p-6 border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">Ready for Your Adventure?</h3>
              <p className="text-orange-100">Let's start planning your perfect trip to Dubai!</p>
              <div className="space-x-4">
                <Button 
                  variant="secondary" 
                  className="bg-white text-orange-600 hover:bg-orange-50"
                  onClick={() => navigate('/guide')}
                >
                  Start Planning Activities
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;
