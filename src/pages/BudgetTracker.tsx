
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, DollarSign, Plus, TrendingUp, AlertCircle, Utensils, ShoppingBag, Car, Hotel } from "lucide-react";
import { toast } from "sonner";

const BudgetTracker = () => {
  const navigate = useNavigate();
  const [newExpense, setNewExpense] = useState({ amount: "", category: "food", description: "" });
  
  const totalBudget = 5000;
  const totalSpent = 2340;
  const dailyAverage = totalSpent / 3; // Assuming day 3 of trip

  const expenses = [
    { id: 1, amount: 850, category: "flights", description: "Emirates Flight", date: "Oct 10" },
    { id: 2, amount: 450, category: "hotel", description: "Four Seasons Resort", date: "Oct 10" },
    { id: 3, amount: 120, category: "food", description: "Dinner at Atlantis", date: "Oct 11" },
    { id: 4, amount: 80, category: "transport", description: "Uber rides", date: "Oct 11" },
    { id: 5, amount: 200, category: "shopping", description: "Dubai Mall", date: "Oct 12" },
    { id: 6, amount: 150, category: "activities", description: "Burj Khalifa tickets", date: "Oct 12" }
  ];

  const categories = [
    { name: "food", icon: Utensils, color: "bg-green-500", total: 320 },
    { name: "transport", icon: Car, color: "bg-blue-500", total: 280 },
    { name: "shopping", icon: ShoppingBag, color: "bg-purple-500", total: 450 },
    { name: "hotel", icon: Hotel, color: "bg-orange-500", total: 1050 },
    { name: "activities", icon: TrendingUp, color: "bg-red-500", total: 240 }
  ];

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Expense added successfully!");
    setNewExpense({ amount: "", category: "food", description: "" });
  };

  const budgetPercentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4 hover:bg-green-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Tracker</h1>
            <p className="text-gray-600">Keep track of your travel expenses</p>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-green-600">${totalBudget}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-blue-600">${totalSpent}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full ${budgetPercentage > 80 ? 'bg-red-100' : 'bg-yellow-100'}`}>
                <AlertCircle className={`h-6 w-6 ${budgetPercentage > 80 ? 'text-red-600' : 'text-yellow-600'}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className={`text-2xl font-bold ${budgetPercentage > 80 ? 'text-red-600' : 'text-yellow-600'}`}>
                  ${totalBudget - totalSpent}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card className="p-6 mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Budget Progress</h3>
            <Badge variant={budgetPercentage > 80 ? "destructive" : "secondary"}>
              {budgetPercentage.toFixed(1)}% used
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                budgetPercentage > 80 ? 'bg-red-500' : budgetPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Daily average: ${dailyAverage.toFixed(0)}
          </p>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add New Expense */}
          <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Expense</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  >
                    <option value="food">Food & Drinks</option>
                    <option value="transport">Transport</option>
                    <option value="shopping">Shopping</option>
                    <option value="hotel">Accommodation</option>
                    <option value="activities">Activities</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Input
                  placeholder="What did you spend on?"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={addExpense}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </Card>

          {/* Category Breakdown */}
          <Card className="p-6 border-0 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 ${category.color} text-white rounded-full`}>
                      <category.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-gray-900 capitalize">{category.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">${category.total}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Expenses */}
        <Card className="p-6 mt-8 border-0 bg-white/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {expenses.slice(-5).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{expense.description}</h4>
                  <p className="text-sm text-gray-600 capitalize">{expense.category} • {expense.date}</p>
                </div>
                <span className="font-bold text-gray-900">${expense.amount}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Budget Alert */}
        {budgetPercentage > 80 && (
          <Card className="p-6 mt-8 border-0 bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
              <h3 className="text-xl font-bold">Budget Alert!</h3>
              <p className="text-red-100">
                You've used {budgetPercentage.toFixed(1)}% of your budget. Consider reducing expenses for the remaining days.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BudgetTracker;
