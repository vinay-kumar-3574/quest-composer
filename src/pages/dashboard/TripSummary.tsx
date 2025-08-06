
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Star, 
  Download, 
  Share2, 
  Camera,
  Plane,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

const TripSummary = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const tripData = {
    destination: 'Dubai, UAE',
    duration: '7 days',
    totalBudget: '$5,000',
    totalSpent: '$4,650',
    placesVisited: 15,
    photosToken: 287,
    topExperiences: [
      'Burj Khalifa Sunset',
      'Desert Safari Adventure',
      'Dubai Mall Shopping',
      'Marina Walk'
    ]
  };

  const timeline = [
    { day: 1, highlight: 'Arrival & Burj Khalifa', spent: '$850' },
    { day: 2, highlight: 'Desert Safari & Traditional Dinner', spent: '$420' },
    { day: 3, highlight: 'Dubai Mall & Aquarium', spent: '$380' },
    { day: 4, highlight: 'Marina & JBR Beach', spent: '$290' },
    { day: 5, highlight: 'Cultural District & Museums', spent: '$250' },
    { day: 6, highlight: 'Palm Jumeirah & Atlantis', spent: '$680' },
    { day: 7, highlight: 'Last-minute Shopping & Departure', spent: '$780' }
  ];

  const generateStoryCard = () => {
    toast.success("Trip story card generated! Ready to share on social media.");
  };

  const submitFeedback = () => {
    if (feedback.trim() && rating > 0) {
      toast.success("Thank you for your feedback! It helps us improve.");
      setFeedback('');
      setRating(0);
    } else {
      toast.error("Please provide a rating and feedback.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip Completion Summary</h1>
          <p className="text-gray-600">Your Dubai adventure recap</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          Trip Completed
        </Badge>
      </div>

      {/* Trip Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{tripData.duration}</p>
          <p className="text-sm text-gray-600">Total Duration</p>
        </Card>

        <Card className="p-6 text-center">
          <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{tripData.placesVisited}</p>
          <p className="text-sm text-gray-600">Places Visited</p>
        </Card>

        <Card className="p-6 text-center">
          <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{tripData.totalSpent}</p>
          <p className="text-sm text-gray-600">Total Spent</p>
        </Card>

        <Card className="p-6 text-center">
          <Camera className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{tripData.photosToken}</p>
          <p className="text-sm text-gray-600">Photos Taken</p>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Timeline</h3>
        <div className="space-y-4">
          {timeline.map((day) => (
            <div key={day.day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {day.day}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{day.highlight}</h4>
                  <p className="text-sm text-gray-600">Day {day.day}</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">{day.spent}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Experiences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Experiences</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tripData.topExperiences.map((experience, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg text-center">
              <Star className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="font-medium text-gray-900 text-sm">{experience}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Story Card Generator */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Share Your Journey</h3>
          <p className="text-gray-600">Generate a beautiful story card to share your Dubai adventure</p>
          
          <div className="flex justify-center space-x-4">
            <Button onClick={generateStoryCard} className="bg-purple-600 hover:bg-purple-700">
              <Download className="h-4 w-4 mr-2" />
              Generate Story Card
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Timeline
            </Button>
          </div>
        </div>
      </Card>

      {/* Feedback Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How was your trip?</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Rate your experience</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`h-8 w-8 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Share your feedback</p>
            <Textarea
              placeholder="Tell us about your Dubai experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>

          <Button onClick={submitFeedback} className="w-full bg-orange-600 hover:bg-orange-700">
            Submit Feedback
          </Button>
        </div>
      </Card>

      {/* Plan Another Trip */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center">
        <Plane className="h-16 w-16 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Ready for Your Next Adventure?</h3>
        <p className="text-blue-100 mb-4">Discover more amazing destinations with our AI travel planner</p>
        <Button className="bg-white text-blue-600 hover:bg-blue-50">
          <Plus className="h-4 w-4 mr-2" />
          Plan Another Trip
        </Button>
      </Card>
    </div>
  );
};

export default TripSummary;
