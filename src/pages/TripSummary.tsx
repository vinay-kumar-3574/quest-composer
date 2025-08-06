
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Users, Plane, Hotel, Camera, Edit3, Sparkles, Save } from "lucide-react";
import { toast } from "sonner";
import { useTripExtraction } from "@/hooks/useTripExtraction";

const TripSummary = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [destinationImage, setDestinationImage] = useState<string>('');
  const { getTripData, updateTripData } = useTripExtraction();
  const [tripDetails, setTripDetails] = useState<any>(null);

  useEffect(() => {
    const extractedData = getTripData();
    if (extractedData) {
      setTripDetails(extractedData);
      setEditData(extractedData);
      generateDestinationImage(extractedData.destination);
    } else {
      navigate('/');
    }
  }, [navigate, getTripData]);

  const generateDestinationImage = (destination: string) => {
    const destinationLower = destination.toLowerCase();
    let gradient = 'from-orange-400 to-orange-600';
    let icon = '🏙️';
    
    if (destinationLower.includes('dubai')) {
      gradient = 'from-yellow-400 via-orange-500 to-red-600';
      icon = '🏗️';
    } else if (destinationLower.includes('paris')) {
      gradient = 'from-pink-400 via-purple-500 to-indigo-600';
      icon = '🗼';
    } else if (destinationLower.includes('tokyo')) {
      gradient = 'from-red-400 via-pink-500 to-purple-600';
      icon = '🏯';
    } else if (destinationLower.includes('london')) {
      gradient = 'from-gray-400 via-blue-500 to-indigo-600';
      icon = '🏛️';
    } else if (destinationLower.includes('new york')) {
      gradient = 'from-blue-400 via-purple-500 to-pink-600';
      icon = '🏙️';
    } else if (destinationLower.includes('goa') || destinationLower.includes('bali') || destinationLower.includes('miami')) {
      gradient = 'from-cyan-400 via-blue-500 to-blue-600';
      icon = '🏖️';
    } else if (destinationLower.includes('kerala') || destinationLower.includes('switzerland')) {
      gradient = 'from-green-400 via-emerald-500 to-teal-600';
      icon = '🏔️';
    }
    
    setDestinationImage(`${gradient}|${icon}`);
  };

  const handleSaveEdit = () => {
    updateTripData(editData);
    setTripDetails(editData);
    setIsEditing(false);
    toast.success('Trip details updated successfully!');
  };

  const handleProceedToBooking = (type: 'flights' | 'hotels') => {
    toast.success(`Proceeding to ${type} booking!`);
    navigate(`/${type}`);
  };

  const formatDate = (dateStr: string) => {
    if (dateStr === 'Not specified') return dateStr;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (!tripDetails) return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your trip summary...</p>
      </div>
    </div>
  );

  const [gradient, icon] = destinationImage.split('|');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">✨ Your Trip Summary</h1>
          <p className="text-lg text-gray-600">Review and confirm your AI-extracted trip details</p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Trip Details</h2>
                  <Button
                    onClick={() => isEditing ? handleSaveEdit() : setIsEditing(true)}
                    variant={isEditing ? "default" : "outline"}
                    className={isEditing ? "bg-green-600 hover:bg-green-700" : "text-orange-600 border-orange-600 hover:bg-orange-50"}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Details
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Destination</h3>
                      {isEditing ? (
                        <Input
                          value={editData.destination}
                          onChange={(e) => setEditData({...editData, destination: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-2xl font-bold text-orange-600">{tripDetails.destination}</p>
                      )}
                    </div>
                  </div>

                  {tripDetails.origin !== 'Not specified' && (
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Plane className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">From</h3>
                        {isEditing ? (
                          <Input
                            value={editData.origin}
                            onChange={(e) => setEditData({...editData, origin: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-xl font-semibold text-purple-600">{tripDetails.origin}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Travel Dates</h3>
                      {isEditing ? (
                        <div className="space-y-2 mt-1">
                          <Input
                            type="date"
                            value={editData.startDate !== 'Not specified' ? editData.startDate : ''}
                            onChange={(e) => setEditData({...editData, startDate: e.target.value})}
                          />
                          <Input
                            type="date"
                            value={editData.endDate !== 'Not specified' ? editData.endDate : ''}
                            onChange={(e) => setEditData({...editData, endDate: e.target.value})}
                          />
                        </div>
                      ) : (
                        <div>
                          {tripDetails.startDate !== 'Not specified' ? (
                            <p className="text-xl font-semibold text-blue-600">
                              {formatDate(tripDetails.startDate)} - {formatDate(tripDetails.endDate)}
                            </p>
                          ) : (
                            <p className="text-xl font-semibold text-blue-600">{tripDetails.duration}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Travelers</h3>
                      {isEditing ? (
                        <Input
                          type="number"
                          min="1"
                          value={editData.travelers}
                          onChange={(e) => setEditData({...editData, travelers: parseInt(e.target.value)})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-xl font-semibold text-green-600">
                          {tripDetails.travelers} {tripDetails.travelers === 1 ? 'person' : 'people'}
                        </p>
                      )}
                    </div>
                  </div>

                  {tripDetails.travelMode && tripDetails.travelMode !== 'Not specified' && (
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-indigo-100 rounded-full">
                        <Plane className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Travel Mode</h3>
                        <p className="text-xl font-semibold text-indigo-600">{tripDetails.travelMode}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className={`w-64 h-64 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">{icon}</div>
                    <h3 className="text-2xl font-bold">{tripDetails.destination.split(',')[0]}</h3>
                    <p className="text-orange-100">Adventure Awaits!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-gradient-to-r from-orange-100 to-orange-200">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Duration: {tripDetails.duration}
                </Badge>
                
                {tripDetails.budget && tripDetails.budget !== 'Not specified' && (
                  <Badge variant="secondary" className="px-4 py-2 text-sm bg-gradient-to-r from-green-100 to-green-200">
                    Budget: {tripDetails.budget}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-white/60 backdrop-blur-sm"
                onClick={() => handleProceedToBooking('flights')}>
            <div className="text-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto">
                <Plane className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Book Flights</h3>
              <p className="text-gray-600">AI-powered flight recommendations for your journey</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Flight Recommendations
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
              <p className="text-gray-600">Perfect accommodations curated by AI</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Hotel Recommendations
              </Button>
            </div>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          <Card className="p-6 border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">🚀 Ready for Your Adventure?</h3>
              <p className="text-orange-100">Let's start planning your perfect trip with AI assistance!</p>
              <div className="space-x-4">
                <Button 
                  variant="secondary" 
                  className="bg-white text-orange-600 hover:bg-orange-50"
                  onClick={() => navigate('/guide')}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start AI Trip Planning
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
