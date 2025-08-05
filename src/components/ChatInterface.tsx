import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { useOpenAIChat } from "@/hooks/useOpenAIChat";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialInput: string;
  onTripParsed: (input: string) => void;
  onBack: () => void;
}

export const ChatInterface = ({ initialInput, onTripParsed, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI travel assistant. Where are you planning to go? Just tell me your destination, dates, and number of travelers, and I'll help you plan the perfect trip!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState(initialInput);
  const { sendMessage, isLoading } = useOpenAIChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialInput) {
      handleSendMessage();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const systemPrompt = `You are a helpful AI travel assistant. Help users plan their trips by:
1. Extracting travel details (destination, dates, number of travelers)
2. Providing travel advice and recommendations
3. If you detect complete trip information (destination, dates, travelers), end your response with the exact phrase: "PARSE_TRIP_DETAILS"
4. Be conversational, helpful, and enthusiastic about travel`;

    try {
      const result = await sendMessage.mutateAsync({
        messages: [{ role: 'user', content: currentInput }],
        systemPrompt
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.content,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // Check if AI wants to parse trip details
      if (result.content.includes('PARSE_TRIP_DETAILS')) {
        setTimeout(() => {
          onTripParsed(currentInput);
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to get AI response. Please try again.");
      console.error('Chat error:', error);
    }

    setCurrentInput("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <Bot className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">TravelSense AI</h1>
                <p className="text-sm text-gray-500">Your travel planning assistant</p>
              </div>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto max-w-4xl px-4 py-6 h-full">
          <ScrollArea ref={scrollAreaRef} className="h-full pr-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-3`}>
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      message.sender === 'user' 
                        ? 'bg-orange-600 text-white ml-2' 
                        : 'bg-gray-200 text-gray-700 mr-2'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    
                    <Card className={`p-4 shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-gray-900 border-gray-200'
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
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-end space-x-3 max-w-3xl">
                    <div className="flex-shrink-0 p-2 rounded-full bg-gray-200 text-gray-700 mr-2">
                      <Bot className="h-4 w-4" />
                    </div>
                    <Card className="p-4 shadow-sm bg-white border-gray-200">
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
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white shadow-sm">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Type your travel plans here..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-12 py-3 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                disabled={isLoading}
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Try: "We are 4 people going to Dubai from October 10 to 17"
          </p>
        </div>
      </div>
    </div>
  );
};
