
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Plus,
  Trash2,
  PieChart,
  AlertTriangle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useOpenAIChat } from '@/hooks/useOpenAIChat';
import { useTripExtraction } from '@/hooks/useTripExtraction';
import { toast } from 'sonner';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

const BudgetTracker = () => {
  const { getTripData } = useTripExtraction();
  const { sendMessage } = useOpenAIChat();
  const [tripData, setTripData] = useState<any>(null);
  const [budget, setBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({ category: '', amount: 0, description: '' });
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  useEffect(() => {
    const data = getTripData();
    setTripData(data);
    if (data?.budget && data.budget !== 'Not specified') {
      const budgetAmount = parseFloat(data.budget.replace(/[^0-9.]/g, ''));
      setBudget(budgetAmount);
    }
    loadExpenses();
  }, [getTripData]);

  const loadExpenses = () => {
    const savedExpenses = localStorage.getItem('tripExpenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  };

  const saveExpenses = (updatedExpenses: Expense[]) => {
    localStorage.setItem('tripExpenses', JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
  };

  const addExpense = () => {
    if (!newExpense.category || !newExpense.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: newExpense.amount,
      description: newExpense.description,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedExpenses = [...expenses, expense];
    saveExpenses(updatedExpenses);
    setNewExpense({ category: '', amount: 0, description: '' });
    toast.success('Expense added successfully!');
  };

  const removeExpense = (id: string) => {
    const updatedExpenses = expenses.filter(e => e.id !== id);
    saveExpenses(updatedExpenses);
    toast.success('Expense removed');
  };

  const generateAIAdvice = async () => {
    setIsGeneratingAdvice(true);
    
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget - totalSpent;
    
    const systemPrompt = `You are a financial travel advisor. Analyze the user's travel budget and expenses, then provide personalized recommendations. Return a JSON object with:
    {
      "budgetStatus": "on-track/over-budget/under-budget",
      "recommendations": ["rec1", "rec2", "rec3"],
      "categoryInsights": ["insight1", "insight2"],
      "savingTips": ["tip1", "tip2", "tip3"],
      "warningMessages": ["warning1"],
      "optimizations": ["opt1", "opt2"]
    }`;

    try {
      const expenseBreakdown = expenses.map(e => `${e.category}: $${e.amount} - ${e.description}`).join(', ');
      
      const result = await sendMessage.mutateAsync({
        messages: [{ 
          role: 'user', 
          content: `Analyze my ${tripData?.destination || 'trip'} budget: Total Budget: $${budget}, Spent: $${totalSpent}, Remaining: $${remaining}. Expenses: ${expenseBreakdown}. Trip duration: ${tripData?.duration || 'Not specified'}.`
        }],
        systemPrompt
      });

      const advice = JSON.parse(result.content);
      setAiRecommendations(advice);
      toast.success('AI budget analysis complete!');
    } catch (error) {
      console.error('Failed to generate AI advice:', error);
      toast.error('Failed to generate budget advice');
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget - totalSpent;
  const spentPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <DollarSign className="h-7 w-7 text-green-600 mr-3" />
            Smart Budget Tracker
          </h1>
          <p className="text-gray-600">
            {tripData ? `Manage your ${tripData.destination} budget with AI insights` : 'AI-powered expense tracking'}
          </p>
        </div>
        <Button 
          onClick={generateAIAdvice}
          disabled={isGeneratingAdvice || expenses.length === 0}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {isGeneratingAdvice ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isGeneratingAdvice ? 'Analyzing...' : 'Get AI Advice'}
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-medium">Total Budget</p>
              <p className="text-3xl font-bold text-green-900">${budget.toFixed(2)}</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-700 font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-red-900">${totalSpent.toFixed(2)}</p>
              <p className="text-sm text-red-600">{spentPercentage.toFixed(1)}% of budget</p>
            </div>
            <TrendingUp className="h-12 w-12 text-red-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium">Remaining</p>
              <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                ${remaining.toFixed(2)}
              </p>
              {remaining < 0 && (
                <Badge className="bg-red-100 text-red-800 mt-1">
                  Over Budget
                </Badge>
              )}
            </div>
            <TrendingDown className={`h-12 w-12 ${remaining >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
          </div>
        </Card>
      </div>

      {/* AI Recommendations */}
      {aiRecommendations && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              AI Budget Analysis
            </h3>
            <div className="space-y-3">
              {aiRecommendations.recommendations?.map((rec: string, index: number) => (
                <div key={index} className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-700">💡 {rec}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
              <TrendingDown className="h-5 w-5 mr-2" />
              Money-Saving Tips
            </h3>
            <div className="space-y-3">
              {aiRecommendations.savingTips?.map((tip: string, index: number) => (
                <div key={index} className="p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-700">💰 {tip}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Warning Messages */}
      {aiRecommendations?.warningMessages && aiRecommendations.warningMessages.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-300">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Budget Warnings</h4>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                {aiRecommendations.warningMessages.map((warning: string, index: number) => (
                  <li key={index}>⚠️ {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Add Expense */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Food, Transport"
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={newExpense.amount || ''}
              onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Optional details"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addExpense} className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Spending by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category} className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-medium text-gray-900">{category}</p>
                <p className="text-2xl font-bold text-orange-600">${amount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">
                  {budget > 0 ? ((amount / budget) * 100).toFixed(1) : 0}% of budget
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Expense List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
        {expenses.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No expenses recorded yet</p>
            <p className="text-sm text-gray-400">Add your first expense to get AI budget insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.slice().reverse().map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{expense.category}</Badge>
                    <span className="font-medium text-gray-900">${expense.amount.toFixed(2)}</span>
                    <span className="text-sm text-gray-600">{expense.date}</span>
                  </div>
                  {expense.description && (
                    <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExpense(expense.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BudgetTracker;
