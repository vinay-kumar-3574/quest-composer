
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock, MapPin, Plane, Building } from 'lucide-react';
import { useOpenAIChat } from '@/hooks/useOpenAIChat';
import { toast } from 'sonner';

const ScenarioPlanner = () => {
  const [activeScenarios, setActiveScenarios] = useState([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const { sendMessage } = useOpenAIChat();

  const mockScenarios = [
    {
      id: 1,
      type: 'attraction_closed',
      title: 'Burj Khalifa Temporarily Closed',
      description: 'High winds have caused temporary closure until 3 PM',
      severity: 'medium',
      affectedTime: '9:00 AM - 11:00 AM',
      status: 'active'
    },
    {
      id: 2,
      type: 'flight_delay',
      title: 'Return Flight Delayed',
      description: 'EK208 delayed by 2 hours due to technical issues',
      severity: 'high',
      affectedTime: 'Oct 17, 8:30 PM',
      status: 'resolved'
    }
  ];

  const generatePlanB = async (scenario: any) => {
    setIsGeneratingPlan(true);
    
    try {
      const systemPrompt = `You are a crisis management travel assistant. When travel disruptions occur, provide immediate, practical alternative solutions including:
      - Alternative activities or attractions nearby
      - Rescheduling recommendations
      - Budget adjustments if needed
      - Transportation alternatives
      - Backup reservations
      - Time optimization strategies
      
      Always provide 2-3 specific alternatives with detailed steps.`;

      const userPrompt = `Travel disruption: ${scenario.title}. ${scenario.description}. 
      Original plan was affected during ${scenario.affectedTime}. 
      Provide immediate alternative solutions for Dubai travelers.`;

      const result = await sendMessage.mutateAsync({
        messages: [{ role: 'user', content: userPrompt }],
        systemPrompt
      });

      toast.success("Alternative plan generated! Check your updated itinerary.");
      
      // Mock updating the scenario status
      setActiveScenarios(prev => prev.map(s => 
        s.id === scenario.id ? { ...s, planB: result.content, status: 'plan_ready' } : s
      ));
      
    } catch (error) {
      toast.error("Failed to generate alternative plan. Please try again.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const simulateScenario = (type: string) => {
    const scenarios = {
      weather: {
        title: 'Unexpected Sandstorm Warning',
        description: 'Dubai weather service issued sandstorm warning for next 4 hours',
        severity: 'high',
        affectedTime: 'Next 4 hours'
      },
      transport: {
        title: 'Metro Line Disruption',
        description: 'Red line service suspended between Dubai Mall and Burj Khalifa',
        severity: 'medium',
        affectedTime: '2:00 PM - 6:00 PM'
      },
      attraction: {
        title: 'Dubai Aquarium Maintenance',
        description: 'Unexpected maintenance closure at Dubai Mall Aquarium',
        severity: 'low',
        affectedTime: 'Rest of the day'
      }
    };

    const newScenario = {
      id: Date.now(),
      type,
      ...scenarios[type],
      status: 'active'
    };

    setActiveScenarios(prev => [...prev, newScenario]);
    toast.warning(`Scenario activated: ${newScenario.title}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">"What If..." Scenario Planner</h1>
          <p className="text-gray-600">AI-powered backup plans for travel disruptions</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => simulateScenario('weather')}
            className="text-orange-600 border-orange-600"
          >
            Simulate Weather Issue
          </Button>
          <Button 
            variant="outline" 
            onClick={() => simulateScenario('transport')}
            className="text-blue-600 border-blue-600"
          >
            Simulate Transport Issue
          </Button>
          <Button 
            variant="outline" 
            onClick={() => simulateScenario('attraction')}
            className="text-purple-600 border-purple-600"
          >
            Simulate Closure
          </Button>
        </div>
      </div>

      {/* Active Scenarios */}
      {activeScenarios.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Scenarios</h2>
          {activeScenarios.map((scenario) => (
            <Alert key={scenario.id} className={`border-l-4 ${
              scenario.severity === 'high' ? 'border-red-500 bg-red-50' :
              scenario.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{scenario.title}</h3>
                    <p className="text-gray-700 mb-2">{scenario.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Affected: {scenario.affectedTime}</span>
                      </div>
                      <Badge className={
                        scenario.severity === 'high' ? 'bg-red-100 text-red-800' :
                        scenario.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {scenario.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="ml-4">
                    {scenario.status === 'active' && (
                      <Button 
                        onClick={() => generatePlanB(scenario)}
                        disabled={isGeneratingPlan}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Generate Plan B
                      </Button>
                    )}
                    {scenario.status === 'plan_ready' && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Plan B Ready
                      </Badge>
                    )}
                  </div>
                </div>
                
                {scenario.planB && (
                  <div className="mt-4 p-3 bg-white rounded border-l-2 border-green-500">
                    <h4 className="font-medium text-green-800 mb-2">Alternative Plan:</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{scenario.planB}</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Historical Scenarios */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Scenarios</h2>
        <div className="space-y-3">
          {mockScenarios.map((scenario) => (
            <div key={scenario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {scenario.type === 'attraction_closed' ? (
                  <Building className="h-5 w-5 text-gray-500" />
                ) : (
                  <Plane className="h-5 w-5 text-gray-500" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{scenario.title}</h3>
                  <p className="text-sm text-gray-600">{scenario.affectedTime}</p>
                </div>
              </div>
              <Badge className={scenario.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                {scenario.status === 'resolved' ? 'Resolved' : 'Active'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Resilience Score */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trip Resilience Score</h3>
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold text-green-600">8.5</div>
              <div className="text-sm text-gray-600">
                <p>Excellent backup planning</p>
                <p>2 scenarios handled successfully</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-700">Well Prepared</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ScenarioPlanner;
