
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: Message[];
  systemPrompt?: string;
}

export const useOpenAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useMutation({
    mutationFn: async ({ messages, systemPrompt }: ChatCompletionRequest) => {
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { messages, systemPrompt }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      if (data?.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    }
  });

  const addUserMessage = (content: string) => {
    const newMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    addUserMessage,
    clearMessages,
    isLoading: sendMessage.isPending
  };
};
