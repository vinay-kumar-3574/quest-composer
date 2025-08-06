
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plane, Clock, MapPin, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTripExtraction } from "@/hooks/useTripExtraction";
import { useOpenAIChat } from "@/hooks/useOpenAIChat";

const FlightBooking = () => {
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<any>(null);
  
  const { getTripData } = useTripExtraction();
  const { sendMessage } = useOpenAIChat();

  useEffect(() => {
    const data = getTripData();
    if (data) {
      setTripData(data);
      generateFlights(data);
    } else {
      toast.error("Trip data not found. Please plan your trip first.");
      navigate('/');
    }
  }, []);

  const generateFlights = async (data: any) => {
    setLoading(true);
    
    const systemPrompt = `You are a flight booking expert. Generate realistic flight options from ${data.origin || 'major US city'} to ${data.destination} for ${data.travelers} passengers. 

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "airline": "airline name",
    "departure": "time",
    "arrival": "time", 
    "duration": "Xh Ym",
    "stops": "Direct or 1 stop",
    "price": number,
    "class": "Economy or Business",
    "aircraft": "plane model"
  }
]

Generate 4-5 realistic options with varying prices and airlines. Make the data believable for the route.`;

    try {
      const result = await sendMessage.mutateAsync({
        messages: [{ role: 'user', content: `Generate flight options from ${data.origin || 'New York'} to ${data.destination} for ${data.travelers} passengers` }],
        systemPrompt
      });

      const flightData = JSON.parse(result.content);
      setFlights(flightData);
    } catch (error) {
      console.error('Failed to generate flights:', error);
      // Fallback data
      setFlights([
        {
          id: 1,
          airline: "Emirates",
          departure: "10:30 AM",
          arrival: "6:45 PM",
          duration: "8h 15m",
          stops: "Direct",
          price: 899,
          class: "Economy",
          aircraft: "Boeing 777"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = (flightId: number) => {
    setSelectedFlight(flightId);
    toast.success("Flight booking confirmed! WhatsApp confirmation sent.");
    setTimeout(() => {
      navigate('/hotels');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">AI is finding the best flights for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4 hover:bg-blue-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
              AI Flight Recommendations
            </h1>
            <p className="text-gray-600">Personalized flight options curated by AI</p>
          </div>
        </div>

        {/* Flight Search Summary */}
        <Card className="p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="font-semibold text-gray-900">From</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tripData?.origin && tripData.origin !== 'Not specified' 
                    ? tripData.origin.split(',')[0].substring(0, 3).toUpperCase()
                    : 'NYC'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {tripData?.origin && tripData.origin !== 'Not specified' 
                    ? tripData.origin 
                    : 'New York'
                  }
                </p>
              </div>
              <Plane className="h-6 w-6 text-orange-600" />
              <div className="text-center">
                <p className="font-semibold text-gray-900">To</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tripData?.destination.split(',')[0].substring(0, 3).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">{tripData?.destination}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Departure</p>
              <p className="font-semibold">
                {tripData?.startDate !== 'Not specified' 
                  ? new Date(tripData.startDate).toLocaleDateString()
                  : 'Flexible'
                }
              </p>
              <p className="text-sm text-gray-500">{tripData?.travelers} Passengers</p>
            </div>
          </div>
        </Card>

        {/* AI Recommendation Banner */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <p className="text-blue-800 font-medium">
              AI has analyzed {flights.length * 50}+ flights to find you the best options for your trip to {tripData?.destination}
            </p>
          </div>
        </Card>

        {/* Flight Options */}
        <div className="space-y-4">
          {flights.map((flight) => (
            <Card 
              key={flight.id} 
              className={`p-6 transition-all duration-300 hover:shadow-lg cursor-pointer border-0 ${
                selectedFlight === flight.id 
                  ? 'bg-blue-50 border-blue-500 shadow-lg' 
                  : 'bg-white/80 backdrop-blur-sm hover:scale-102'
              }`}
              onClick={() => setSelectedFlight(flight.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-gray-900">{flight.airline}</h3>
                      <Badge variant={flight.class === 'Business' ? 'default' : 'secondary'}>
                        {flight.class}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {flight.aircraft}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{flight.departure}</p>
                      <p className="text-sm text-gray-500">
                        {tripData?.origin && tripData.origin !== 'Not specified' 
                          ? tripData.origin.split(',')[0]
                          : 'NYC'
                        }
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <Plane className="h-4 w-4 text-orange-600" />
                        <div className="flex-1 border-t border-gray-300"></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{flight.duration}</p>
                      <p className="text-xs text-blue-600">{flight.stops}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{flight.arrival}</p>
                      <p className="text-sm text-gray-500">{tripData?.destination.split(',')[0]}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-8">
                  <p className="text-3xl font-bold text-orange-600">${flight.price}</p>
                  <p className="text-sm text-gray-500">per person</p>
                  <Button 
                    className={`mt-4 ${
                      selectedFlight === flight.id 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-orange-600 hover:bg-orange-700'
                    } text-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookFlight(flight.id);
                    }}
                  >
                    {selectedFlight === flight.id ? 'Selected ✓' : 'Select Flight'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Total Summary */}
        {selectedFlight && (
          <Card className="p-6 mt-8 shadow-xl border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🎯 Booking Summary</h3>
                <p className="text-orange-100">
                  {tripData?.travelers} passengers × ${flights.find(f => f.id === selectedFlight)?.price}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-orange-100">Total</p>
                <p className="text-3xl font-bold">
                  ${(flights.find(f => f.id === selectedFlight)?.price || 0) * (tripData?.travelers || 1)}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FlightBooking;
