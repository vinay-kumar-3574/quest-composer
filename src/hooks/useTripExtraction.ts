
import { useState } from 'react';
import { useOpenAIChat } from './useOpenAIChat';

export interface TripData {
  destination: string;
  origin: string;
  travelers: number;
  duration: string;
  startDate: string;
  endDate: string;
  budget?: string;
  interests?: string[];
}

export const useTripExtraction = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const { sendMessage } = useOpenAIChat();

  const extractTripData = async (userMessage: string) => {
    const systemPrompt = `You are a travel data extraction expert. Extract trip information from user messages and return ONLY a valid JSON object with this exact structure:

{
  "destination": "city, country",
  "origin": "departure city/country or 'Not specified'",
  "travelers": number,
  "duration": "X days",
  "startDate": "YYYY-MM-DD or 'Not specified'",
  "endDate": "YYYY-MM-DD or 'Not specified'",
  "budget": "amount or 'Not specified'",
  "interests": ["interest1", "interest2"] or []
}

If information is missing, use sensible defaults. Return ONLY the JSON, no other text.`;

    try {
      const result = await sendMessage.mutateAsync({
        messages: [{ role: 'user', content: userMessage }],
        systemPrompt
      });

      const extractedData = JSON.parse(result.content);
      setTripData(extractedData);
      localStorage.setItem('tripData', JSON.stringify(extractedData));
      return extractedData;
    } catch (error) {
      console.error('Failed to extract trip data:', error);
      return null;
    }
  };

  const getTripData = (): TripData | null => {
    if (tripData) return tripData;
    
    const stored = localStorage.getItem('tripData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setTripData(parsed);
      return parsed;
    }
    
    return null;
  };

  return {
    extractTripData,
    getTripData,
    tripData
  };
};
