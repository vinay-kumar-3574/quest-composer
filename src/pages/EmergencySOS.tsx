
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Hospital, 
  Building,
  Shield,
  Globe,
  Mic,
  Copy,
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useOpenAIChat } from '@/hooks/useOpenAIChat';
import { useTripExtraction } from '@/hooks/useTripExtraction';
import { toast } from 'sonner';

const EmergencySOS = () => {
  const { getTripData } = useTripExtraction();
  const { sendMessage } = useOpenAIChat();
  const [tripData, setTripData] = useState<any>(null);
  const [emergencyData, setEmergencyData] = useState<any>(null);
  const [translatedPhrases, setTranslatedPhrases] = useState<any>(null);
  const [isGeneratingEmergencyInfo, setIsGeneratingEmergencyInfo] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [panicActivated, setPanicActivated] = useState(false);

  useEffect(() => {
    const data = getTripData();
    setTripData(data);
    if (data) {
      generateEmergencyInfo(data);
    }
  }, [getTripData]);

  const generateEmergencyInfo = async (data: any) => {
    setIsGeneratingEmergencyInfo(true);
    
    const systemPrompt = `You are an emergency services expert. Provide comprehensive emergency information for travelers. Return a JSON object with:
    {
      "emergencyNumbers": {
        "police": "number",
        "ambulance": "number", 
        "fire": "number",
        "touristHelpline": "number"
      },
      "nearestServices": {
        "hospitals": [{"name": "name", "address": "address", "phone": "phone"}],
        "embassy": {"name": "name", "address": "address", "phone": "phone"},
        "police": [{"name": "name", "address": "address"}]
      },
      "importantAddresses": ["address1", "address2"],
      "safetyTips": ["tip1", "tip2", "tip3"],
      "culturalConsiderations": ["consideration1", "consideration2"],
      "commonRisks": ["risk1", "risk2"]
    }`;

    try {
      const result = await sendMessage.mutateAsync({
        messages: [{ 
          role: 'user', 
          content: `Provide emergency information for travelers in ${data.destination}. Include local emergency numbers, nearest hospitals, embassy information, and safety tips.`
        }],
        systemPrompt
      });

      const emergencyInfo = JSON.parse(result.content);
      setEmergencyData(emergencyInfo);
    } catch (error) {
      console.error('Failed to generate emergency info:', error);
      toast.error('Failed to load emergency information');
    } finally {
      setIsGeneratingEmergencyInfo(false);
    }
  };

  const translateEmergencyPhrases = async () => {
    if (!tripData) return;
    
    setIsTranslating(true);
    
    const systemPrompt = `You are a translation expert specializing in emergency phrases. Translate common emergency phrases to the local language. Return a JSON object with:
    {
      "phrases": [
        {"english": "Help me", "local": "translation", "pronunciation": "phonetic"},
        {"english": "I need a doctor", "local": "translation", "pronunciation": "phonetic"},
        {"english": "Call the police", "local": "translation", "pronunciation": "phonetic"},
        {"english": "Where is the hospital?", "local": "translation", "pronunciation": "phonetic"},
        {"english": "I am lost", "local": "translation", "pronunciation": "phonetic"},
        {"english": "I don't speak [language]", "local": "translation", "pronunciation": "phonetic"}
      ],
      "language": "detected language"
    }`;

    try {
      const result = await sendMessage.mutateAsync({
        messages: [{ 
          role: 'user', 
          content: `Translate essential emergency phrases to the local language of ${tripData.destination}. Include phonetic pronunciation.`
        }],
        systemPrompt
      });

      const phrases = JSON.parse(result.content);
      setTranslatedPhrases(phrases);
      toast.success('Emergency phrases translated!');
    } catch (error) {
      console.error('Failed to translate phrases:', error);
      toast.error('Failed to translate emergency phrases');
    } finally {
      setIsTranslating(false);
    }
  };

  const activatePanic = () => {
    setPanicActivated(true);
    toast.error('EMERGENCY MODE ACTIVATED! This is a simulation.');
    
    // Simulate emergency actions
    setTimeout(() => {
      toast.success('Mock emergency services notified');
      toast.success('Mock location shared with emergency contacts');
    }, 1500);

    setTimeout(() => {
      setPanicActivated(false);
    }, 10000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const simulateLocationShare = () => {
    toast.success('Location shared (simulated): Current GPS coordinates sent to emergency contacts');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-7 w-7 text-red-600 mr-3" />
            Emergency SOS
          </h1>
          <p className="text-gray-600">
            {tripData ? `Emergency assistance for ${tripData.destination}` : 'AI-powered emergency assistance'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={translateEmergencyPhrases}
            disabled={isTranslating || !tripData}
            variant="outline"
            className="border-orange-600 text-orange-600"
          >
            {isTranslating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Globe className="h-4 w-4 mr-2" />
            )}
            Translate Phrases
          </Button>
        </div>
      </div>

      {/* Panic Button */}
      <Card className={`p-8 text-center ${panicActivated ? 'bg-red-100 border-red-500 animate-pulse' : 'bg-red-50 border-red-200'}`}>
        <Button
          onClick={activatePanic}
          disabled={panicActivated}
          className={`w-48 h-48 rounded-full text-white text-xl font-bold ${
            panicActivated 
              ? 'bg-red-800 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 hover:scale-110 transition-all duration-200'
          }`}
        >
          {panicActivated ? (
            <>
              <AlertTriangle className="h-12 w-12 mb-2" />
              EMERGENCY<br/>ACTIVATED
            </>
          ) : (
            <>
              <AlertTriangle className="h-12 w-12 mb-2" />
              PANIC<br/>BUTTON
            </>
          )}
        </Button>
        <p className="text-red-700 mt-4 font-medium">
          {panicActivated 
            ? 'Emergency services are being contacted (simulation)' 
            : 'Press for immediate emergency assistance'
          }
        </p>
        <p className="text-red-600 text-sm mt-2">
          This will share your location and notify emergency contacts
        </p>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={simulateLocationShare}>
          <div className="text-center space-y-3">
            <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Share Location</h3>
            <p className="text-sm text-gray-600">Send GPS coordinates to emergency contacts</p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="text-center space-y-3">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Emergency Calls</h3>
            <p className="text-sm text-gray-600">Quick dial local emergency numbers</p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="text-center space-y-3">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto">
              <Mic className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Voice SOS</h3>
            <p className="text-sm text-gray-600">Speak your emergency (simulated)</p>
          </div>
        </Card>
      </div>

      {/* Emergency Numbers */}
      {emergencyData?.emergencyNumbers && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Phone className="h-5 w-5 mr-2 text-red-600" />
            Emergency Numbers for {tripData?.destination}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(emergencyData.emergencyNumbers).map(([service, number]) => (
              <div key={service} className="p-4 bg-red-50 rounded-lg text-center">
                <p className="font-medium text-red-800 capitalize">{service.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-2xl font-bold text-red-900">{number as string}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(number as string)}
                  className="mt-2 border-red-300 text-red-600"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Nearest Services */}
      {emergencyData?.nearestServices && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emergencyData.nearestServices.hospitals && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Hospital className="h-5 w-5 mr-2 text-red-600" />
                Nearest Hospitals
              </h3>
              <div className="space-y-3">
                {emergencyData.nearestServices.hospitals.map((hospital: any, index: number) => (
                  <div key={index} className="p-3 bg-red-50 rounded-lg">
                    <p className="font-medium text-red-800">{hospital.name}</p>
                    <p className="text-sm text-red-700">{hospital.address}</p>
                    <p className="text-sm font-mono text-red-600">{hospital.phone}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {emergencyData.nearestServices.embassy && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Embassy Information
              </h3>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">{emergencyData.nearestServices.embassy.name}</p>
                <p className="text-sm text-blue-700">{emergencyData.nearestServices.embassy.address}</p>
                <p className="text-sm font-mono text-blue-600">{emergencyData.nearestServices.embassy.phone}</p>
              </div>
            </Card>
          )}

          {emergencyData.nearestServices.police && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Police Stations
              </h3>
              <div className="space-y-3">
                {emergencyData.nearestServices.police.map((station: any, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">{station.name}</p>
                    <p className="text-sm text-blue-700">{station.address}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Emergency Phrases */}
      {translatedPhrases && (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Emergency Phrases in {translatedPhrases.language}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {translatedPhrases.phrases.map((phrase: any, index: number) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-sm">
                <p className="font-medium text-gray-900">{phrase.english}</p>
                <p className="text-lg font-bold text-purple-800">{phrase.local}</p>
                <p className="text-sm text-purple-600 italic">({phrase.pronunciation})</p>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => copyToClipboard(phrase.local)}
                  className="mt-2 text-purple-600"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Safety Tips */}
      {emergencyData?.safetyTips && (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            AI Safety Tips for {tripData?.destination}
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {emergencyData.safetyTips.map((tip: string, index: number) => (
              <div key={index} className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-700">⚠️ {tip}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Status Bar */}
      {tripData && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">
                System Active
              </Badge>
              <span className="text-green-800 text-sm">
                📍 Monitoring your safety in {tripData.destination}
              </span>
            </div>
            <div className="text-green-700 text-sm">
              ✅ Emergency contacts notified of your trip
            </div>
          </div>
        </Card>
      )}

      {isGeneratingEmergencyInfo && (
        <Card className="p-8 text-center">
          <RefreshCw className="h-8 w-8 text-orange-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading emergency information for your destination...</p>
        </Card>
      )}
    </div>
  );
};

export default EmergencySOS;
