
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useTripExtraction } from '@/hooks/useTripExtraction';

const TripExtractionInterface = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { extractTripData, isExtracting } = useTripExtraction();
  const navigate = useNavigate();

  const handleExtractTrip = async () => {
    if (!input.trim()) {
      toast.error('Please describe your trip plans');
      return;
    }

    const extractedData = await extractTripData(input);
    if (extractedData) {
      toast.success('Trip details extracted successfully!');
      navigate('/trip-summary');
    } else {
      toast.error('Failed to extract trip details. Please try again.');
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Listening... Please speak your trip plans');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error('Voice recognition not supported in this browser');
    }
  };

  const quickExamples = [
    "Planning a 7-day trip for 4 people from Hyderabad to Dubai (Oct 10–17 by flight)",
    "Weekend getaway to Goa from Mumbai for 2 people, budget ₹20,000",
    "Family vacation to Kerala for 5 days, 6 travelers, starting next week"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plan Your Perfect Trip with{" "}
            <span className="text-orange-600">AI</span>
          </h1>
          <p className="text-lg text-gray-600">
            Just describe your trip in natural language, and we'll handle the rest
          </p>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-orange-600 justify-center">
              <Sparkles className="h-6 w-6" />
              <span className="text-lg font-medium">AI-Powered Trip Extraction</span>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Describe your trip plans here... e.g., 'Planning a 7-day trip for 4 people from Hyderabad to Dubai (Oct 10–17 by flight)'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                className="text-lg"
              />

              <div className="flex gap-3">
                <Button
                  onClick={handleVoiceInput}
                  variant="outline"
                  disabled={isListening || isExtracting}
                  className="flex items-center space-x-2"
                >
                  <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
                  <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
                </Button>

                <Button
                  onClick={handleExtractTrip}
                  disabled={!input.trim() || isExtracting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting Trip Details...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Extract Trip Details
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isExtracting && (
              <Card className="p-4 bg-orange-50 border-orange-200">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
                  <p className="text-orange-800">
                    AI is analyzing your trip description and extracting details...
                  </p>
                </div>
              </Card>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 text-center">
            Try These Examples
          </h3>
          <div className="grid gap-3">
            {quickExamples.map((example, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-102 border-0 bg-white/60 backdrop-blur-sm"
                onClick={() => setInput(example)}
              >
                <p className="text-gray-700 italic">"{example}"</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripExtractionInterface;
