
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MapPin, Utensils, ShoppingBag, Camera, AlertTriangle } from 'lucide-react';
import { useOpenAIChat } from '@/hooks/useOpenAIChat';
import { toast } from 'sonner';

const AIGuideChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hi! I'm your AI travel guide for Dubai. I can help you with attractions, restaurants, navigation, cultural tips, and any travel questions. What would you like to explore today?",
      sender: 'ai' as const,
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  
  const { sendMessage, isLoading } = useOpenAIChat();

  const quickSuggestions = [
    { icon: MapPin, text: "Best attractions near me", category: "attractions" },
    { icon: Utensils, text: "Recommend local restaurants", category: "dining" },
    { icon: ShoppingBag, text: "Where to shop in Dubai", category: "shopping" },
    { icon: Camera, text: "Instagram-worthy photo spots", category: "photography" },
    { icon: AlertTriangle, text: "Cultural etiquette tips", category: "culture" },
  ];

  const handleSendMessage = async (messageText?: string) => {
    const currentInput = messageText || input;
    if (!currentInput.trim() || isLoading) return;

    const newMessage = {
      id: messages.length + 1,
      content: currentInput,
      sender: 'user' as const,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    const systemPrompt = `You are an expert AI travel guide for Dubai. You are helping tourists who are currently in Dubai.
    
    Provide helpful, accurate, and detailed information about:
    - Local attractions and hidden gems
    - Restaurant recommendations with specific dishes to try
    - Cultural tips and etiquette
    - Navigation and transportation
    - Shopping recommendations
    - Emergency information
    - Budget-friendly options
    - Photo spot recommendations
    - Current events and seasonal activities
    
    Always be friendly, informative, and specific to Dubai. Use clear formatting with bullet points or numbered lists when appropriate.
    If asked about emergencies, provide both local emergency numbers and practical advice.`;

    try {
      const result = await sendMessage.mutateAsync({
        messages: [{ role: 'user', content: currentInput }],
        systemPrompt
      });

      const aiResponse = {
        id: messages.length + 2,
        content: result.content,
        sender: 'ai' as const,
        timestamp: new Date(),
        type: 'response'
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast.error("Failed to get AI response. Please try again.");
      console.error('Chat error:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">AI Travel Guide</h1>
        <p className="text-gray-600">Get personalized recommendations and travel assistance</p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Help</h3>
          <div className="space-y-3">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => handleSendMessage(suggestion.text)}
                disabled={isLoading}
              >
                <suggestion.icon className="h-4 w-4 mr-2 text-orange-600" />
                <span className="text-sm">{suggestion.text}</span>
              </Button>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Current Location</h4>
            <p className="text-sm text-orange-700">Dubai Mall Area</p>
            <p className="text-xs text-orange-600">Downtown Dubai</p>
          </div>
        </Card>

        {/* Chat Panel */}
        <Card className="col-span-2 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Chat with AI Guide</h3>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
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
                        : 'bg-gray-50 text-gray-900 border-gray-200'
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
                    <Card className="p-4 bg-gray-50 border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-gray-500 text-sm">AI is thinking...</span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about Dubai..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={() => handleSendMessage()}
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIGuideChat;
