
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Zap, CheckCircle, Clock, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { useOpenAIChat } from '@/hooks/useOpenAIChat';
import { useTripExtraction } from '@/hooks/useTripExtraction';
import { toast } from 'sonner';

const ScenarioPlanner = () => {
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      title: "Flight Delay",
      description: "Your flight is delayed by 3 hours",
      status: "active",
      solution: "",
      isGenerating: false
    },
    {
      id: 2,
      title: "Attraction Closed",
      description: "Main tourist attraction is closed unexpectedly",
      status: "pending",
      solution: "",
      isGenerating: false
    },
    {
      id: 3,
      title: "Weather Change",
      description: "Heavy rain forecasted for outdoor activities",
      status: "pending", 
      solution: "",
      isGenerating: false
    }
  ]);

  const [customScenario, setCustomScenario] = useState('');
  const { sendMessage } = useOpenAIChat();
  const { getTripData } = useTripExtraction();

  const generateSolution = async (scenarioId: number) => {
    const tripData = getTripData();
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setScenarios(prev => prev.map(s => 
      s.id === scenarioId ? { ...s, isGenerating: true } : s
    ));

    const systemPrompt = `You are a travel crisis management expert. For the travel scenario provided, give 3 practical alternative solutions. 

${tripData ? `Trip context: ${tripData.travelers} travelers going to ${tripData.destination} for ${tripData.duration}` : ''}

Format your response as:
🎯 **Quick Solutions:**

1. **Option 1:** [brief solution]
2. **Option 2:** [brief solution]  
3. **Option 3:** [brief solution]

💡 **Pro Tip:** [helpful additional advice]

Be specific, actionable, and consider the destination context.`;

    try {
      const result = await sendMessage.mutateAsync({
        messages: [{ role: 'user', content: scenario.description }],
        systemPrompt
      });

      setScenarios(prev => prev.map(s => 
        s.id === scenarioId ? { 
          ...s, 
          solution: result.content,
          status: 'resolved',
          isGenerating: false
        } : s
      ));

      toast.success("AI has generated backup solutions!");
    } catch (error) {
      toast.error("Failed to generate solutions. Please try again.");
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId ? { ...s, isGenerating: false } : s
      ));
    }
  };

  const addCustomScenario = async () => {
    if (!customScenario.trim()) return;

    const newScenario = {
      id: Date.now(),
      title: "Custom Scenario",
      description: customScenario,
      status: "pending" as const,
      solution: "",
      isGenerating: false
    };

    setScenarios(prev => [...prev, newScenario]);
    setCustomScenario('');
    toast.success("Custom scenario added!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'active': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tripData = getTripData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Zap className="h-7 w-7 text-orange-600 mr-3" />
            "What If..." Scenario Planner
          </h1>
          <p className="text-gray-600">AI-powered backup plans for every travel situation</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <Sparkles className="h-4 w-4 mr-1" />
          AI-Enhanced
        </Badge>
      </div>

      {/* Trip Context */}
      {tripData && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Planning scenarios for your trip to {tripData.destination}</p>
              <p className="text-sm text-blue-600">{tripData.travelers} travelers • {tripData.duration}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Add Custom Scenario */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Scenario</h3>
        <div className="flex space-x-3">
          <Input
            placeholder="Describe a potential travel scenario..."
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomScenario()}
            className="flex-1"
          />
          <Button 
            onClick={addCustomScenario}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            Add Scenario
          </Button>
        </div>
      </Card>

      {/* Scenarios List */}
      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                {getStatusIcon(scenario.status)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{scenario.title}</h3>
                  <p className="text-gray-600 mt-1">{scenario.description}</p>
                </div>
              </div>
              <Badge className={getStatusColor(scenario.status)}>
                {scenario.status.charAt(0).toUpperCase() + scenario.status.slice(1)}
              </Badge>
            </div>

            {scenario.solution && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-medium text-green-800 mb-2">AI-Generated Solutions:</h4>
                <div className="text-sm text-green-700 whitespace-pre-wrap">
                  {scenario.solution}
                </div>
              </div>
            )}

            {!scenario.solution && (
              <Button
                onClick={() => generateSolution(scenario.id)}
                disabled={scenario.isGenerating}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                {scenario.isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    AI is generating solutions...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Solutions
                  </>
                )}
              </Button>
            )}
          </Card>
        ))}
      </div>

      {/* AI Tips */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <div className="flex items-start space-x-3">
          <Sparkles className="h-6 w-6 text-orange-600 mt-1" />
          <div>
            <h3 className="font-semibold text-orange-800 mb-2">AI Travel Tips</h3>
            <div className="text-sm text-orange-700 space-y-1">
              <p>• Always have backup plans for major attractions and activities</p>
              <p>• Keep digital copies of important documents in cloud storage</p>
              <p>• Download offline maps and translation apps before traveling</p>
              <p>• Research local emergency numbers and embassy contacts</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ScenarioPlanner;
