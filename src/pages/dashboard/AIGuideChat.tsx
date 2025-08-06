
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MapPin, Utensils, ShoppingBag, Camera, AlertTriangle, Sparkles } from 'lucide-react';
import { useOpenAIChat } from '@/hooks/useOpenAIChat';
import { useTripExtraction } from '@/hooks/useTripExtraction';
import { toast } from 'sonner';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: string;
}

const AIGuideChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "🌟 Welcome to your AI Travel Assistant! I'm here to help plan your perfect trip. Tell me about your travel plans - where do you want to go, when, and with how many people? I'll extract all the details and create a personalized experience for you!",
      sender: 'ai',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  
  const { sendMessage, isLoading } = useOpenAIChat();
  const { extractTripData, getTripData } = useTripExtraction();

  const quickSuggestions = [
    { icon: MapPin, text: "Best attractions for my destination", category: "attractions" },
    { icon: Utensils, text: "Local restaurants I should try", category: "dining" },
    { icon: ShoppingBag, text: "Shopping recommendations", category: "shopping" },
    { icon: Camera, text: "Instagram-worthy photo spots", category: "photography" },
    { icon: AlertTriangle, text: "Cultural tips and etiquette", category: "culture" },
    { icon: Sparkles, text: "Hidden gems and local secrets", category: "hidden" },
  ];

  const handleSendMessage = async (messageText?: string) => {
    const currentInput = messageText || input;
    if (!currentInput.trim() || isLoading) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: currentInput,
      sender: 'user',
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Extract trip data in background
    try {
      await extractTripData(currentInput);
    } catch (error) {
      console.log('Trip data extraction failed, continuing with chat');
    }

    const tripData = getTripData();
    let contextualPrompt = `You are an expert AI travel guide. `;
    
    if (tripData) {
      contextualPrompt += `The user is planning a trip to ${tripData.destination} with ${tripData.travelers} people for ${tripData.duration}. `;
    }
    
    contextualPrompt += `Provide helpful, detailed, and personalized travel advice. Use emojis and clear formatting with bullet points or numbered lists when appropriate. Be enthusiastic and knowledgeable about travel.`;

    try {
      const result = await sendMessage.mutateAsync({
        messages: [{ role: 'user', content: currentInput }],
        systemPrompt: contextualPrompt
      });

      const aiResponse: Message = {
        id: messages.length + 2,
        content: result.content,
        sender: 'ai',
        timestamp: new Date(),
        type: 'response'
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast.error("Failed to get AI response. Please try again.");
      console.error('Chat error:', error);
    }
  };

  const tripData = getTripData();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Travel Assistant</h1>
        <p className="text-gray-600">Get personalized recommendations for your journey</p>
        {tripData && (
          <div className="mt-2 p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg">
            <p className="text-sm font-medium text-orange-800">
              🎯 Planning trip to <span className="font-bold">{tripData.destination}</span> for {tripData.travelers} travelers ({tripData.duration})
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">✨ Quick Help</h3>
          <div className="space-y-3">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto p-3 hover:bg-orange-50 hover:border-orange-300"
                onClick={() => handleSendMessage(suggestion.text)}
                disabled={isLoading}
              >
                <suggestion.icon className="h-4 w-4 mr-2 text-orange-600" />
                <span className="text-sm">{suggestion.text}</span>
              </Button>
            ))}
          </div>
          
          {tripData && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">📍 Your Trip Details</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Destination:</strong> {tripData.destination}</p>
                <p><strong>Travelers:</strong> {tripData.travelers} people</p>
                <p><strong>Duration:</strong> {tripData.duration}</p>
                {tripData.startDate !== 'Not specified' && (
                  <p><strong>Dates:</strong> {tripData.startDate}</p>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Chat Panel */}
        <Card className="col-span-2 flex flex-col">
          <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">🤖 AI Travel Assistant</h3>
              <Badge className="bg-green-100 text-green-800">Online & Ready</Badge>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <Card className={`p-4 ${
                      message.sender === 'user'
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border-gray-200'
                    }`}>
                      <div className="space-y-2">
                        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <span className={`text-xs block ${
                          message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl order-1">
                    <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-orange-700 text-sm">AI is crafting your perfect response...</span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-2">
              <Input
                placeholder="Tell me about your travel plans or ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={() => handleSendMessage()}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              💡 Try: "I'm planning a trip to Paris with 2 friends for 5 days in March"
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIGuideChat;
