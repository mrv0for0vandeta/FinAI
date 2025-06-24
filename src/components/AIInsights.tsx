import React from 'react';
import { InsightCard } from './InsightCard';
import { PredictionCard } from './PredictionCard';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Settings, X, Lightbulb } from 'lucide-react';
import { AIInsight } from '../types';

interface AIInsightsProps {
  insights: AIInsight[];
  totalSpent: number;
  totalBudget: number;
  savingsRate: number;
  dismissInsight: (id: string) => void;
}

export function AIInsights({ 
  insights, 
  totalSpent, 
  totalBudget, 
  savingsRate, 
  dismissInsight 
}: AIInsightsProps) {
  const budgetAdherence = totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 0;

  // If no insights yet, show getting started guide
  if (insights.length === 0) {
    return (
      <div className="space-y-6">
        {/* AI Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Insights Coming Soon</h2>
              <p className="text-purple-100">Add expenses and track spending to get personalized insights</p>
            </div>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <Lightbulb className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">How AI Insights Work</h3>
            <p className="text-gray-600">Our AI analyzes your spending patterns to provide personalized recommendations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Track Your Spending</h4>
                <p className="text-sm text-gray-600">Add your daily expenses across different budget categories to build spending patterns.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">AI Analysis</h4>
                <p className="text-sm text-gray-600">Our AI analyzes your spending habits, budget adherence, and savings progress.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Get Insights</h4>
                <p className="text-sm text-gray-600">Receive personalized recommendations to optimize your spending and reach your goals faster.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Take Action</h4>
                <p className="text-sm text-gray-600">Implement AI suggestions to improve your financial health and achieve your savings goals.</p>
              </div>
            </div>
          </div>

          {/* Sample Insights Preview */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Example AI Insights You'll Receive:</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-gray-700">"You've exceeded your Entertainment budget by 15% this month"</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">"Great job! You're saving 25% more than last month"</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Brain className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">"Consider reducing dining out to reach your vacation goal 2 months earlier"</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span>Current Financial Overview</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Budget', value: `$${totalBudget.toLocaleString()}`, status: totalBudget > 0 ? 'Set' : 'Not Set' },
              { label: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, status: totalSpent > 0 ? 'Tracking' : 'No Data' },
              { label: 'Savings Rate', value: `${savingsRate.toFixed(0)}%`, status: savingsRate > 20 ? 'Excellent' : savingsRate > 10 ? 'Good' : 'Needs Work' },
              { label: 'Budget Adherence', value: `${Math.max(budgetAdherence, 0).toFixed(0)}%`, status: budgetAdherence > 80 ? 'Excellent' : budgetAdherence > 60 ? 'Good' : 'Needs Work' }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className={`text-sm ${
                  item.status === 'Excellent' ? 'text-green-600' :
                  item.status === 'Good' ? 'text-blue-600' :
                  item.status === 'Set' || item.status === 'Tracking' ? 'text-green-600' :
                  'text-orange-600'
                }`}>{item.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Regular insights view for users with data
  const predictions = [
    {
      title: 'Next Month',
      description: 'Based on current trends, you\'ll likely save $2,100 next month if you stick to your budget',
      confidence: 82,
      timeframe: 'next-month'
    },
    {
      title: 'Next Quarter',
      description: 'Your emergency fund will reach 95% of your target if you continue at your current pace',
      confidence: 88,
      timeframe: 'next-quarter'
    },
    {
      title: 'End of Year',
      description: 'You\'re projected to save $22,400 this year, exceeding your goal by $2,300',
      confidence: 75,
      timeframe: 'end-of-year'
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Budget & Savings Analysis</h2>
            <p className="text-purple-100">Personalized insights that could help you save over $500 this year</p>
          </div>
        </div>
      </div>

      {/* Personalized Insights Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>Personalized Budget & Savings Insights</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div key={insight.id} className="relative">
              <InsightCard {...insight} />
              <button
                onClick={() => dismissInsight(insight.id)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Spending & Savings Trends */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span>Spending & Savings Trends</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Spending Behavior', value: '88%', status: 'Stable' },
            { label: 'Savings Progress', value: `${savingsRate.toFixed(0)}%`, status: savingsRate > 25 ? 'Excellent' : 'Good' },
            { label: 'Budget Adherence', value: `${Math.max(budgetAdherence, 0).toFixed(0)}%`, status: budgetAdherence > 80 ? 'Excellent' : budgetAdherence > 60 ? 'Good' : 'Needs Work' },
            { label: 'Goal Progress', value: '82%', status: 'On Track' }
          ].map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className={`text-sm ${
                item.status === 'Excellent' ? 'text-green-600' :
                item.status === 'Good' ? 'text-blue-600' :
                item.status === 'On Track' ? 'text-green-600' :
                'text-orange-600'
              }`}>{item.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Predictions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <span>AI Predictions</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {predictions.map((prediction, index) => (
            <PredictionCard key={index} {...prediction} />
          ))}
        </div>
      </div>

      {/* AI Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-500" />
          <span>AI Preferences</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Insight Frequency</h4>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Daily Budget Updates</option>
              <option>Weekly Financial Tips</option>
              <option>Monthly Deep Analysis</option>
            </select>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Savings Goals Priority</h4>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Balance All Goals</option>
              <option>Focus on Emergency Fund</option>
              <option>Prioritize Short-term Goals</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Notifications</h4>
          <div className="space-y-3">
            {[
              'Budget overspending alerts',
              'Savings goal milestones',
              'Weekly spending summaries',
              'Monthly optimization tips'
            ].map((item, index) => (
              <label key={index} className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Save Preferences
          </button>
          <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}