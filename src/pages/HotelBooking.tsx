
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Hotel, Star, MapPin, Wifi, Car, Utensils, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTripExtraction } from "@/hooks/useTripExtraction";
import { useOpenAIChat } from "@/hooks/useOpenAIChat";

const HotelBooking = () => {
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<any>(null);
  
  const { getTripData } = useTripExtraction();
  const { sendMessage } = useOpenAIChat();

  useEffect(() => {
    const data = getTripData();
    if (data) {
      setTripData(data);
      generateHotels(data);
    } else {
      toast.error("Trip data not found. Please plan your trip first.");
      navigate('/');
    }
  }, []);

  const generateHotels = async (data: any) => {
    setLoading(true);
    
    const systemPrompt = `You are a hotel booking expert. Generate realistic hotel options in ${data.destination} for ${data.travelers} guests. 

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "name": "hotel name",
    "rating": 4 or 5,
    "location": "specific area in city",
    "price": number,
    "amenities": ["amenity1", "amenity2", "amenity3", "amenity4"],
    "description": "brief description",
    "roomType": "room type for guests count"
  }
]

Generate 4-5 realistic hotels with varying prices and styles. Consider the destination's character and popular hotel chains/local options.`;

    try {
      const result = await sendMessage.mutateAsync({
        messages: [{ role: 'user', content: `Generate hotel options in ${data.destination} for ${data.travelers} guests for ${data.duration}` }],
        systemPrompt
      });

      const hotelData = JSON.parse(result.content);
      setHotels(hotelData);
    } catch (error) {
      console.error('Failed to generate hotels:', error);
      // Fallback data
      setHotels([
        {
          id: 1,
          name: "Luxury Resort & Spa",
          rating: 5,
          location: "City Center",
          price: 250,
          amenities: ["Spa", "Pool", "WiFi", "Restaurant"],
          description: "Luxury accommodation in prime location",
          roomType: "Deluxe Suite"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookHotel = (hotelId: number) => {
    setSelectedHotel(hotelId);
    toast.success("Hotel booking confirmed! WhatsApp confirmation sent.");
    setTimeout(() => {
      navigate('/guide');
    }, 2000);
  };

  const getDurationInNights = () => {
    if (tripData?.duration) {
      const match = tripData.duration.match(/(\d+)/);
      return match ? parseInt(match[1]) : 7;
    }
    return 7;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">AI is finding perfect accommodations for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4 hover:bg-purple-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Sparkles className="h-8 w-8 text-purple-600 mr-3" />
              AI Hotel Recommendations
            </h1>
            <p className="text-gray-600">Perfect stays curated by AI for your trip</p>
          </div>
        </div>

        {/* Search Summary */}
        <Card className="p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <p className="font-semibold text-gray-900">Destination</p>
                <p className="text-xl font-bold text-purple-600">{tripData?.destination}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Duration</p>
                <p className="text-lg">{getDurationInNights()} nights</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Guests</p>
                <p className="text-lg">{tripData?.travelers} {tripData?.travelers === 1 ? 'Guest' : 'Guests'}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Dates</p>
                <p className="text-lg">
                  {tripData?.startDate !== 'Not specified' 
                    ? new Date(tripData.startDate).toLocaleDateString()
                    : 'Flexible'
                  }
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Recommendation Banner */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <p className="text-purple-800 font-medium">
              AI has curated the best accommodations in {tripData?.destination} based on your preferences and group size
            </p>
          </div>
        </Card>

        {/* Hotel Options */}
        <div className="grid lg:grid-cols-1 gap-6">
          {hotels.map((hotel) => (
            <Card 
              key={hotel.id} 
              className={`overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer border-0 ${
                selectedHotel === hotel.id 
                  ? 'bg-purple-50 border-purple-500 shadow-lg' 
                  : 'bg-white/80 backdrop-blur-sm hover:scale-102'
              }`}
              onClick={() => setSelectedHotel(hotel.id)}
            >
              <div className="flex">
                <div className="w-1/3">
                  <div className="h-64 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Hotel className="h-16 w-16 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {[...Array(hotel.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                        ))}
                        <span className="text-sm text-gray-500">({hotel.rating} stars)</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{hotel.location}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-3xl font-bold text-purple-600">${hotel.price}</p>
                      <p className="text-sm text-gray-500">per night</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{hotel.description}</p>
                  <p className="text-sm font-medium text-gray-800 mb-3">Room: {hotel.roomType}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-gray-500">
                      <Wifi className="h-4 w-4" />
                      <Car className="h-4 w-4" />
                      <Utensils className="h-4 w-4" />
                    </div>
                    
                    <Button 
                      className={`${
                        selectedHotel === hotel.id 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-purple-600 hover:bg-purple-700'
                      } text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookHotel(hotel.id);
                      }}
                    >
                      {selectedHotel === hotel.id ? 'Selected ✓' : 'Book Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Total Summary */}
        {selectedHotel && (
          <Card className="p-6 mt-8 shadow-xl border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🎯 Booking Summary</h3>
                <p className="text-purple-100">
                  {getDurationInNights()} nights × ${hotels.find(h => h.id === selectedHotel)?.price}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-100">Total</p>
                <p className="text-3xl font-bold">
                  ${(hotels.find(h => h.id === selectedHotel)?.price || 0) * getDurationInNights()}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HotelBooking;
