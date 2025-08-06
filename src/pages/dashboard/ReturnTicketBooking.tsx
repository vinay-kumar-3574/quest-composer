
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plane, Clock, Calendar, CheckCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const ReturnTicketBooking = () => {
  const [bookingStatus, setBookingStatus] = useState('ready'); // ready, booking, confirmed
  const [showWhatsAppMock, setShowWhatsAppMock] = useState(false);

  const tripData = {
    destination: 'Dubai, UAE',
    departureCity: 'New York',
    tripEndDate: 'Oct 17, 2024',
    daysRemaining: 1,
    recommendedDeparture: 'Oct 17, 8:30 PM'
  };

  const handleBookReturn = async () => {
    setBookingStatus('booking');
    
    // Simulate booking process
    setTimeout(() => {
      setBookingStatus('confirmed');
      setShowWhatsAppMock(true);
      toast.success("Return ticket booked successfully! WhatsApp confirmation sent.");
    }, 2000);
  };

  const mockWhatsAppMessage = `✈️ FLIGHT CONFIRMATION
Emirates EK208
Dubai (DXB) → New York (JFK)
Oct 17, 2024 - 8:30 PM
Seat: 23A (Window)
Confirmation: EK7X9B2

📱 Mobile check-in available 24hrs before
🎒 Baggage: 2x23kg included
⏰ Arrive 3 hours before departure

Safe travels! 🌟`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Return Ticket Auto-Booking</h1>
          <p className="text-gray-600">Smart booking for your journey home</p>
        </div>
        <Badge className="bg-orange-100 text-orange-800">
          {tripData.daysRemaining} day remaining
        </Badge>
      </div>

      {/* Trip End Alert */}
      {tripData.daysRemaining <= 1 && bookingStatus === 'ready' && (
        <Alert className="border-orange-500 bg-orange-50">
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800 mb-1">Trip Ending Soon!</h3>
                <p className="text-orange-700">
                  Your Dubai adventure ends tomorrow. Shall I book your return ticket now?
                </p>
              </div>
              <Button 
                onClick={handleBookReturn}
                className="ml-4 bg-orange-600 hover:bg-orange-700"
              >
                Book Return Ticket
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Booking Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">From</span>
              <span className="font-semibold">{tripData.destination}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">To</span>
              <span className="font-semibold">{tripData.departureCity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Departure</span>
              <span className="font-semibold">{tripData.recommendedDeparture}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Flight</span>
              <span className="font-semibold">Emirates EK208</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price</span>
              <span className="font-semibold text-green-600">$899</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
          
          {bookingStatus === 'ready' && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-full w-fit mx-auto">
                <Plane className="h-12 w-12 text-blue-600" />
              </div>
              <p className="text-gray-600">Ready to book your return journey</p>
              <Button 
                onClick={handleBookReturn}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Book Now
              </Button>
            </div>
          )}

          {bookingStatus === 'booking' && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-orange-50 rounded-full w-fit mx-auto">
                <Clock className="h-12 w-12 text-orange-600 animate-pulse" />
              </div>
              <p className="text-gray-600">Booking your return ticket...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
          )}

          {bookingStatus === 'confirmed' && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 rounded-full w-fit mx-auto">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <p className="text-green-600 font-semibold">Booking Confirmed!</p>
              <Badge className="bg-green-100 text-green-800">
                Confirmation: EK7X9B2
              </Badge>
            </div>
          )}
        </Card>
      </div>

      {/* WhatsApp Mock */}
      {showWhatsAppMock && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-600 rounded-full">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 mb-2">WhatsApp Confirmation Sent</h3>
              <div className="bg-white p-4 rounded-lg border border-green-200 max-w-md">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {mockWhatsAppMessage}
                </pre>
              </div>
              <p className="text-sm text-green-600 mt-2">
                Message sent to +1-XXX-XXX-XXXX
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Smart Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Recommendations</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <span>Optimal departure time selected based on traffic patterns</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <span>Window seat automatically assigned (based on preferences)</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <span>Extra baggage included for shopping souvenirs</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <span>Mobile check-in reminder scheduled for tomorrow</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReturnTicketBooking;
