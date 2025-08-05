
import { Card } from "@/components/ui/card";
import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
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
  );
};
