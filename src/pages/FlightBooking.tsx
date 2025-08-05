
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plane, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

const FlightBooking = () => {
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);

  const mockFlights = [
    {
      id: 1,
      airline: "Emirates",
      departure: "10:30 AM",
      arrival: "6:45 PM",
      duration: "8h 15m",
      stops: "Direct",
      price: 899,
      class: "Economy"
    },
    {
      id: 2,
      airline: "Qatar Airways",
      departure: "2:15 PM",
      arrival: "10:30 PM",
      duration: "8h 15m",
      stops: "Direct",
      price: 1049,
      class: "Economy"
    },
    {
      id: 3,
      airline: "Etihad",
      departure: "11:45 PM",
      arrival: "7:30 AM +1",
      duration: "7h 45m",
      stops: "Direct",
      price: 1299,
      class: "Business"
    }
  ];

  const handleBookFlight = (flightId: number) => {
    setSelectedFlight(flightId);
    toast.success("Flight booking confirmed! WhatsApp confirmation sent.");
    setTimeout(() => {
      navigate('/hotels');
    }, 2000);
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Flight Booking</h1>
            <p className="text-gray-600">Choose your perfect flight to Dubai</p>
          </div>
        </div>

        {/* Flight Search Summary */}
        <Card className="p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="font-semibold text-gray-900">From</p>
                <p className="text-2xl font-bold text-blue-600">NYC</p>
                <p className="text-sm text-gray-500">New York</p>
              </div>
              <Plane className="h-6 w-6 text-orange-600" />
              <div className="text-center">
                <p className="font-semibold text-gray-900">To</p>
                <p className="text-2xl font-bold text-orange-600">DXB</p>
                <p className="text-sm text-gray-500">Dubai</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Departure</p>
              <p className="font-semibold">Oct 10, 2024</p>
              <p className="text-sm text-gray-500">4 Passengers</p>
            </div>
          </div>
        </Card>

        {/* Flight Options */}
        <div className="space-y-4">
          {mockFlights.map((flight) => (
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
                    <h3 className="text-xl font-bold text-gray-900">{flight.airline}</h3>
                    <Badge variant={flight.class === 'Business' ? 'default' : 'secondary'}>
                      {flight.class}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{flight.departure}</p>
                      <p className="text-sm text-gray-500">NYC (JFK)</p>
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
                      <p className="text-sm text-gray-500">DXB</p>
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
                    {selectedFlight === flight.id ? 'Selected' : 'Select Flight'}
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
                <h3 className="text-xl font-bold mb-2">Booking Summary</h3>
                <p className="text-orange-100">4 passengers × ${mockFlights.find(f => f.id === selectedFlight)?.price}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-orange-100">Total</p>
                <p className="text-3xl font-bold">
                  ${(mockFlights.find(f => f.id === selectedFlight)?.price || 0) * 4}
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
