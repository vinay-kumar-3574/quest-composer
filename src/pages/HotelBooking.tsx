
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Hotel, Star, MapPin, Wifi, Car, Utensils } from "lucide-react";
import { toast } from "sonner";

const HotelBooking = () => {
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);

  const mockHotels = [
    {
      id: 1,
      name: "Burj Al Arab Jumeirah",
      rating: 5,
      location: "Jumeirah Beach",
      image: "/placeholder.svg",
      price: 850,
      amenities: ["Spa", "Pool", "WiFi", "Restaurant"],
      description: "World's most luxurious hotel"
    },
    {
      id: 2,
      name: "Atlantis The Palm",
      rating: 5,
      location: "Palm Jumeirah",
      image: "/placeholder.svg",
      price: 650,
      amenities: ["Aquapark", "Pool", "WiFi", "Multiple Restaurants"],
      description: "Resort with waterpark and aquarium"
    },
    {
      id: 3,
      name: "Four Seasons Resort Dubai",
      rating: 5,
      location: "Jumeirah Beach Road",
      image: "/placeholder.svg",
      price: 450,
      amenities: ["Beach Access", "Spa", "Pool", "Fine Dining"],
      description: "Beachfront luxury resort"
    }
  ];

  const handleBookHotel = (hotelId: number) => {
    setSelectedHotel(hotelId);
    toast.success("Hotel booking confirmed! WhatsApp confirmation sent.");
    setTimeout(() => {
      navigate('/guide');
    }, 2000);
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Hotel Booking</h1>
            <p className="text-gray-600">Find your perfect stay in Dubai</p>
          </div>
        </div>

        {/* Search Summary */}
        <Card className="p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <p className="font-semibold text-gray-900">Destination</p>
                <p className="text-xl font-bold text-purple-600">Dubai, UAE</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Check-in</p>
                <p className="text-lg">Oct 10, 2024</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Check-out</p>
                <p className="text-lg">Oct 17, 2024</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Guests</p>
                <p className="text-lg">4 Adults</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Hotel Options */}
        <div className="grid lg:grid-cols-1 gap-6">
          {mockHotels.map((hotel) => (
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

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.map((amenity, index) => (
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
                      {selectedHotel === hotel.id ? 'Selected' : 'Book Now'}
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
                <h3 className="text-xl font-bold mb-2">Booking Summary</h3>
                <p className="text-purple-100">
                  7 nights × ${mockHotels.find(h => h.id === selectedHotel)?.price}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-100">Total</p>
                <p className="text-3xl font-bold">
                  ${(mockHotels.find(h => h.id === selectedHotel)?.price || 0) * 7}
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
