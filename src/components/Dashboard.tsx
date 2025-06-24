import React, { useState, useMemo } from 'react';
import { MetricsCard } from './MetricsCard';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { ExpenseBreakdownChart } from './ExpenseBreakdownChart';
import { SavingsProgress } from './SavingsProgress';
import { AIRecommendation } from './AIRecommendation';
import { InlineIncomeForm } from './forms/InlineIncomeForm';
import { TrendingUp, DollarSign, TrendingDown, Target, PiggyBank, CheckCircle, Plus, Edit, Trash2, CreditCard } from 'lucide-react';
import { BudgetCategory, SavingsGoal, AIInsight, MonthlyData, Debt, DebtPayment } from '../types';
import { LoanModal } from './modals/LoanModal';
import { LoanPaymentModal } from './modals/LoanPaymentModal';
import { AddBudgetCategoryModal } from './modals/AddBudgetCategoryModal';
import { AddGoalModal } from './modals/AddGoalModal';

type FrequencyType = 'monthly' | 'weekly' | 'daily' | 'bi-weekly' | 'semi-monthly' | 'quarterly' | 'yearly' | 'custom';
type CustomFrequency = { type: 'custom'; days: number };

interface DashboardProps {
  budgetCategories: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  insights: AIInsight[];
  monthlyTrends: MonthlyData[];
  totalBudget: number;
  totalSpent: number;
  totalSavingsCurrent: number;
  monthlyIncome: number;
  savingsRate: number;
  dismissInsight: (id: string) => void;
  updateMonthlyIncome: (income: number) => void;
  setIncomeFrequency: (frequency: FrequencyType | CustomFrequency) => void;
  incomeFrequency: FrequencyType | CustomFrequency;
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id' | 'payments' | 'remaining'>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  deleteDebt: (id: string) => void;
  addDebtPayment: (debtId: string, payment: Omit<DebtPayment, 'id'>) => void;
  addBudgetCategory: (category: Omit<BudgetCategory, 'id'>) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  setActiveTab: (tab: 'dashboard' | 'budget' | 'savings' | 'insights' | 'debts') => void;
}

function generateBudgetSuggestions({ budgetCategories, savingsGoals, debts, monthlyIncome, totalSpent, savingsRate }: {
  budgetCategories: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  debts: Debt[];
  monthlyIncome: number;
  totalSpent: number;
  savingsRate: number;
}) {
  const suggestions: string[] = [];
  // Suggest reducing spending in over-budget categories
  budgetCategories.forEach(cat => {
    if (cat.spent > cat.budget) {
      suggestions.push(`You are over budget in ${cat.name}. Consider reducing spending or increasing your budget for this category.`);
    } else if (cat.spent > 0.9 * cat.budget) {
      suggestions.push(`You are close to your budget limit in ${cat.name}. Monitor your spending to avoid going over.`);
    }
  });
  // Suggest increasing savings if possible
  if (savingsRate < 10 && monthlyIncome > 0) {
    suggestions.push(`Your savings rate is below 10%. Try to save at least 10% of your income each month.`);
  } else if (savingsRate > 20) {
    suggestions.push(`Great job! Your savings rate is above 20%. Keep it up!`);
  }
  // Suggest setting or increasing savings goals
  if (savingsGoals.length === 0) {
    suggestions.push(`Set a savings goal to start working toward something important to you.`);
  } else {
    savingsGoals.forEach(goal => {
      if (goal.current < 0.5 * goal.target) {
        suggestions.push(`You are less than halfway to your savings goal '${goal.name}'. Consider increasing your monthly contribution.`);
      }
    });
  }
  // Suggest debt payoff strategies
  if (debts.length > 0) {
    const totalDebt = debts.reduce((sum, d) => sum + d.remaining, 0);
    if (totalDebt > 0.5 * monthlyIncome) {
      suggestions.push(`Your total debt is more than half your monthly income. Consider using the snowball or avalanche method to pay it down faster.`);
    }
    debts.forEach(debt => {
      if (debt.interestRate && debt.interestRate > 10) {
        suggestions.push(`Your debt to ${debt.creditor} has a high interest rate (${debt.interestRate}%). Prioritize paying it off.`);
      }
    });
  }
  // Suggest reviewing subscriptions if spending is high
  const shoppingCat = budgetCategories.find(cat => cat.name.toLowerCase().includes('shopping'));
  if (shoppingCat && shoppingCat.spent > 0.2 * monthlyIncome) {
    suggestions.push(`You spent over 20% of your income on shopping. Review your subscriptions and discretionary purchases.`);
  }
  // Default suggestion if none found
  if (suggestions.length === 0) {
    suggestions.push('Your budget looks healthy! Keep tracking your spending and saving for your goals.');
  }
  return suggestions;
}

export function Dashboard({
  budgetCategories,
  savingsGoals,
  insights,
  monthlyTrends,
  totalBudget,
  totalSpent,
  totalSavingsCurrent,
  monthlyIncome,
  savingsRate,
  dismissInsight,
  updateMonthlyIncome,
  setIncomeFrequency,
  incomeFrequency,
  debts,
  addDebt,
  updateDebt,
  deleteDebt,
  addDebtPayment,
  addBudgetCategory,
  addSavingsGoal,
  setActiveTab
}: DashboardProps) {
  // Move all hooks to the top
  const [showIncomeForm, setShowIncomeForm] = useState(monthlyIncome === 0);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showDebtPaymentModal, setShowDebtPaymentModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  const today = new Date();
  const last31Days = useMemo(() => {
    const arr = [];
    for (let i = 30; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push({
        date: d.toISOString().split('T')[0],
        income: 0,
        expenses: 0,
        savings: 0,
      });
    }
    // Fill with real data if available (TODO: map from transactions)
    return arr;
  }, [today]);

  const last12Months = useMemo(() => {
    const arr = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      arr.push({
        month: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
        income: 0,
        expenses: 0,
        savings: 0,
      });
    }
    // Fill with real data if available (TODO: map from monthlyTrends)
    return arr;
  }, [today]);

  const hasData = budgetCategories.length > 0 || savingsGoals.length > 0 || monthlyIncome > 0;

  // Now do the early return
  if (!hasData) {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to FinAI Planner! 🎉</h1>
          <p className="text-blue-100 text-lg">Let's set up your personal financial dashboard</p>
        </div>

        {/* Income Setup Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Set Your Income</h2>
              <p className="text-gray-600">This helps us calculate your savings rate and provide better recommendations</p>
            </div>
          </div>

          <InlineIncomeForm
            currentIncome={monthlyIncome}
            onSave={(income, freq) => {
              updateMonthlyIncome(income);
              setIncomeFrequency(freq);
            }}
            currentFrequency={incomeFrequency}
            onCancel={() => setShowIncomeForm(false)}
          />
        </div>

        {/* Quick Setup Guide */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Next Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Create Budget Categories</h4>
                <p className="text-sm text-gray-600">Go to the Budget tab to add categories like Housing, Food, Transportation.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Set Savings Goals</h4>
                <p className="text-sm text-gray-600">Visit Savings Goals to define what you're saving for with target amounts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular dashboard for users with data
  const metrics = [
    {
      title: 'Total Savings',
      value: `$${totalSavingsCurrent.toLocaleString()}`,
      change: totalSavingsCurrent > 0 ? '+8.2% from last month' : 'Start saving today',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Monthly Income',
      value: `$${monthlyIncome.toLocaleString()}`,
      change: monthlyIncome > 0 ? 'Set and tracked' : 'Not set yet',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      title: 'Monthly Expenses',
      value: `$${totalSpent.toLocaleString()}`,
      change: totalSpent > 0 ? 'Current month' : 'No expenses yet',
      trend: totalSpent > totalBudget ? 'up' as const : 'down' as const,
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      change: savingsRate > 20 ? 'Excellent rate!' : savingsRate > 10 ? 'Good progress' : 'Room to improve',
      trend: 'up' as const,
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  const topSavingsGoals = savingsGoals.slice(0, 3);
  const activeInsight = insights.find(insight => insight.type === 'warning') || insights[0];

  const aiSuggestions = generateBudgetSuggestions({ budgetCategories, savingsGoals, debts, monthlyIncome, totalSpent, savingsRate });

  return (
    <div className="space-y-6">
      {/* Add prominent Edit Income button at the top */}
      <div className="flex justify-end mb-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          onClick={() => setShowIncomeForm(true)}
        >
          <DollarSign className="w-4 h-4" />
          <span>Edit Income</span>
        </button>
      </div>

      {/* Income Update Section */}
      {showIncomeForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Update Income</h3>
          </div>
          <InlineIncomeForm
            currentIncome={monthlyIncome}
            onSave={(income, freq) => {
              updateMonthlyIncome(income);
              setIncomeFrequency(freq);
              setShowIncomeForm(false);
            }}
            currentFrequency={incomeFrequency}
            onCancel={() => setShowIncomeForm(false)}
          />
        </div>
      )}

      {/* AI Recommendation Banner */}
      {activeInsight && (
        <div className="relative">
          <AIRecommendation
            message={activeInsight.description}
            type={activeInsight.type}
          />
          <button
            onClick={() => dismissInsight(activeInsight.id)}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="relative group">
            <MetricsCard {...metric} />
            {metric.title === 'Monthly Income' && (
              <button
                onClick={() => setShowIncomeForm(true)}
                className="absolute top-2 right-2 p-1 bg-white border border-blue-200 rounded-full shadow hover:bg-blue-50 transition-colors"
              >
                <DollarSign className="w-4 h-4 text-blue-600" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgetCategories.length > 0 && (
          <ExpenseBreakdownChart categories={budgetCategories} />
        )}
      </div>

      {/* Budget Categories Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Budget Categories</h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            onClick={() => setActiveTab('budget')}
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
        {budgetCategories.length === 0 ? (
          <p className="text-gray-500">No budget categories yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                </tr>
              </thead>
              <tbody>
                {budgetCategories.map(cat => (
                  <tr key={cat.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2">{cat.name}</td>
                    <td className="px-4 py-2">${cat.budget.toLocaleString()}</td>
                    <td className="px-4 py-2">${cat.spent.toLocaleString()}</td>
                    <td className="px-4 py-2 capitalize">{cat.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Savings Goals Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Savings Goals</h3>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            onClick={() => setActiveTab('savings')}
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>
        {savingsGoals.length === 0 ? (
          <p className="text-gray-500">No savings goals yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                </tr>
              </thead>
              <tbody>
                {savingsGoals.map(goal => (
                  <tr key={goal.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2">{goal.name}</td>
                    <td className="px-4 py-2">${goal.target.toLocaleString()}</td>
                    <td className="px-4 py-2">${goal.current.toLocaleString()}</td>
                  </tr>
            ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Debts Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Debts</h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            onClick={() => setActiveTab('debts')}
          >
            <Plus className="w-4 h-4" />
            <span>Add Debt</span>
          </button>
        </div>
        {debts.length === 0 ? (
          <p className="text-gray-500">No debts tracked yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Creditor</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {debts.map(debt => (
                  <tr key={debt.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2">{debt.creditor}</td>
                    <td className="px-4 py-2 capitalize">{debt.type}</td>
                    <td className="px-4 py-2">${debt.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">${debt.remaining.toLocaleString()}</td>
                    <td className="px-4 py-2">{debt.dueDate}</td>
                    <td className="px-4 py-2 capitalize">{debt.frequency}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" onClick={() => { setSelectedDebt(debt); setShowDebtModal(true); }}><Edit className="w-4 h-4" /></button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded" onClick={() => { setSelectedDebt(debt); setShowDebtPaymentModal(true); }}><CreditCard className="w-4 h-4" /></button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded" onClick={() => deleteDebt(debt.id)}><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Debt Modals */}
      <LoanModal
        isOpen={showDebtModal}
        onClose={() => setShowDebtModal(false)}
        onSave={(debt) => {
          if (selectedDebt) updateDebt(selectedDebt.id, debt);
          else addDebt(debt);
          setShowDebtModal(false);
        }}
        debt={selectedDebt}
      />
      <LoanPaymentModal
        isOpen={showDebtPaymentModal}
        onClose={() => setShowDebtPaymentModal(false)}
        onSave={(payment) => {
          if (selectedDebt) addDebtPayment(selectedDebt.id, payment);
          setShowDebtPaymentModal(false);
        }}
        debt={selectedDebt}
      />

      {/* Add Budget Category Modal */}
      <AddBudgetCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onAddCategory={(category) => {
          addBudgetCategory(category);
          setShowAddCategoryModal(false);
        }}
      />

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={showAddGoalModal}
        onClose={() => setShowAddGoalModal(false)}
        onAddGoal={(goal) => {
          addSavingsGoal(goal);
          setShowAddGoalModal(false);
        }}
      />

      {/* AI Budget Suggestions Section */}
      <div className="mt-6">
        <AIRecommendation
          message={aiSuggestions.map((s) => `• ${s}`).join('\n')}
          type="info"
        />
      </div>
    </div>
  );
}