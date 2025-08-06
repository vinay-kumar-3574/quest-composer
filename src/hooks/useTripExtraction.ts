
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
  travelMode?: string;
}

export const useTripExtraction = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const { sendMessage } = useOpenAIChat();

  const extractTripData = async (userMessage: string) => {
    setIsExtracting(true);
    
    const systemPrompt = `You are a travel data extraction expert. Extract trip information from user messages and return ONLY a valid JSON object with this exact structure:

{
  "destination": "city, country",
  "origin": "departure city/country or 'Not specified'",
  "travelers": number,
  "duration": "X days",
  "startDate": "YYYY-MM-DD or 'Not specified'",
  "endDate": "YYYY-MM-DD or 'Not specified'",
  "budget": "amount or 'Not specified'",
  "interests": ["interest1", "interest2"] or [],
  "travelMode": "Flight/Train/Bus or 'Flight'"
}

Examples:
- "Planning a 7-day trip for 4 people from Hyderabad to Dubai (Oct 10–17 by flight)" should extract:
  - destination: "Dubai, UAE"
  - origin: "Hyderabad, India"
  - travelers: 4
  - duration: "7 days"
  - startDate: "2024-10-10"
  - endDate: "2024-10-17"
  - travelMode: "Flight"

If information is missing, use sensible defaults or "Not specified". Return ONLY the JSON, no other text.`;

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
    } finally {
      setIsExtracting(false);
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

  const updateTripData = (updates: Partial<TripData>) => {
    const current = getTripData();
    if (current) {
      const updated = { ...current, ...updates };
      setTripData(updated);
      localStorage.setItem('tripData', JSON.stringify(updated));
    }
  };

  const clearTripData = () => {
    setTripData(null);
    localStorage.removeItem('tripData');
  };

  return {
    extractTripData,
    getTripData,
    updateTripData,
    clearTripData,
    tripData,
    isExtracting
  };
};
