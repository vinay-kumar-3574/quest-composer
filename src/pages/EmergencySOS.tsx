
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, Phone, MapPin, Hospital, Shield, Languages } from "lucide-react";
import { toast } from "sonner";

const EmergencySOS = () => {
  const navigate = useNavigate();
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);

  const emergencyContacts = [
    { name: "Police", number: "999", icon: Shield, color: "bg-blue-600" },
    { name: "Ambulance", number: "998", icon: Hospital, color: "bg-red-600" },
    { name: "Fire Department", number: "997", icon: AlertTriangle, color: "bg-orange-600" }
  ];

  const nearbyServices = [
    { name: "Dubai Hospital", distance: "2.1 km", type: "Hospital" },
    { name: "Dubai Police Station", distance: "1.5 km", type: "Police" },
    { name: "US Consulate", distance: "3.2 km", type: "Embassy" }
  ];

  const emergencyPhrases = [
    { english: "I need help", arabic: "أحتاج المساعدة" },
    { english: "Call the police", arabic: "اتصل بالشرطة" },
    { english: "I need a doctor", arabic: "أحتاج طبيب" },
    { english: "Where is the hospital?", arabic: "أين المستشفى؟" }
  ];

  const triggerEmergency = () => {
    setEmergencyTriggered(true);
    toast.error("EMERGENCY ACTIVATED - Location shared with emergency contacts");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4 hover:bg-red-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency SOS</h1>
            <p className="text-gray-600">Get help when you need it most</p>
          </div>
        </div>

        {/* Emergency Panic Button */}
        <Card className="p-8 mb-8 text-center border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="space-y-6">
            <div className="p-6 bg-red-100 rounded-full w-fit mx-auto">
              <AlertTriangle className="h-16 w-16 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Emergency Assistance</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Press the button below in case of emergency. This will share your location and alert local authorities.
            </p>
            <Button 
              size="lg"
              className={`text-white px-12 py-6 text-xl rounded-full shadow-lg transition-all duration-300 ${
                emergencyTriggered 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700 hover:scale-105'
              }`}
              onClick={triggerEmergency}
              disabled={emergencyTriggered}
            >
              {emergencyTriggered ? 'HELP IS ON THE WAY' : 'EMERGENCY SOS'}
            </Button>
            {emergencyTriggered && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                Location shared - Emergency services contacted
              </Badge>
            )}
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Emergency Contacts */}
          <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Emergency Numbers</h3>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${contact.color} text-white rounded-full`}>
                      <contact.icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-gray-900">{contact.name}</span>
                  </div>
                  <Button 
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => toast.success(`Calling ${contact.name}...`)}
                  >
                    <Phone className="h-4 w-4" />
                    <span>{contact.number}</span>
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Nearby Services */}
          <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nearby Services</h3>
            <div className="space-y-3">
              {nearbyServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {service.distance}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-1"
                      onClick={() => toast.success(`Navigating to ${service.name}...`)}
                    >
                      Navigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Emergency Phrases */}
        <Card className="p-6 mt-8 border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Languages className="h-5 w-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Emergency Phrases (Arabic)</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {emergencyPhrases.map((phrase, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">{phrase.english}</p>
                <p className="text-blue-600 text-lg">{phrase.arabic}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Location Sharing */}
        <Card className="p-6 mt-8 border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="text-center space-y-4">
            <MapPin className="h-12 w-12 mx-auto" />
            <h3 className="text-xl font-bold">Share Your Location</h3>
            <p className="text-blue-100">
              Your current location will be shared with emergency contacts and authorities
            </p>
            <Button 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => toast.success("Location shared successfully!")}
            >
              Share Location Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmergencySOS;
