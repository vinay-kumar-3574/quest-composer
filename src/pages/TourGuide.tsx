
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, 
  Clock, 
  MessageCircle, 
  Camera, 
  Utensils, 
  ShoppingBag,
  AlertTriangle,
  DollarSign,
  Languages,
  Send
} from "lucide-react";

const TourGuide = () => {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Welcome to Dubai! I'm your AI travel guide. What would you like to explore today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const mockItinerary = [
    {
      id: 1,
      time: "9:00 AM",
      activity: "Burj Khalifa Visit",
      location: "Downtown Dubai",
      status: "upcoming",
      description: "Visit the world's tallest building"
    },
    {
      id: 2,
      time: "12:00 PM",
      activity: "Dubai Mall Lunch",
      location: "Dubai Mall",
      status: "current",
      description: "Explore the largest mall in the world"
    },
    {
      id: 3,
      time: "3:00 PM",
      activity: "Dubai Fountain Show",
      location: "Dubai Mall",
      status: "upcoming",
      description: "Watch the spectacular fountain show"
    }
  ];

  const quickActions = [
    { icon: <AlertTriangle className="h-5 w-5" />, label: "Emergency", color: "bg-red-600" },
    { icon: <DollarSign className="h-5 w-5" />, label: "Budget", color: "bg-green-600" },
    { icon: <Languages className="h-5 w-5" />, label: "Translate", color: "bg-blue-600" },
    { icon: <Camera className="h-5 w-5" />, label: "Photo Spots", color: "bg-purple-600" }
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      content: chatInput,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setChatInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        content: "That's a great question! Let me help you with that. Dubai has amazing attractions and I can provide you with detailed information about any location you're interested in.",
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Itinerary & Map */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Dubai Tour Guide</h1>
          <p className="text-sm text-gray-500">Oct 10, 2024 - Day 1</p>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`${action.color} text-white border-0 hover:opacity-90`}
              >
                {action.icon}
                <span className="ml-1 text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Itinerary</h2>
            <div className="space-y-3">
              {mockItinerary.map((item) => (
                <Card 
                  key={item.id} 
                  className={`p-4 transition-all duration-300 hover:shadow-md cursor-pointer border-0 ${
                    item.status === 'current' 
                      ? 'bg-orange-100 border-orange-500 shadow-md' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">{item.time}</span>
                        {item.status === 'current' && (
                          <Badge className="bg-orange-600 text-white">Current</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900">{item.activity}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.location}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Static Map Component */}
          <div className="p-4">
            <Card className="p-4 border-0">
              <h3 className="font-semibold text-gray-900 mb-3">Your Route</h3>
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Interactive Map</p>
                  <p className="text-xs opacity-75">Dubai Downtown Area</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Panel - AI Chat */}
      <div className="w-1/2 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <MessageCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AI Travel Assistant</h2>
              <p className="text-sm text-gray-500">Always here to help</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
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
                      : 'bg-gray-100 text-gray-900 border-gray-200'
                  }`}>
                    <p className="leading-relaxed">{message.content}</p>
                    <span className={`text-xs mt-2 block ${
                      message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me anything about Dubai..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button variant="outline" size="sm" className="text-xs">
              <Utensils className="h-3 w-3 mr-1" />
              Find restaurants nearby
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <ShoppingBag className="h-3 w-3 mr-1" />
              Shopping recommendations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuide;
