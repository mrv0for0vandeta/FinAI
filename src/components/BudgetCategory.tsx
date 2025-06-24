import React from 'react';
import { TrendingUp, TrendingDown, Edit3 } from 'lucide-react';

interface BudgetCategoryProps {
  name: string;
  spent: number;
  budget: number;
  color: string;
  trend: 'up' | 'down';
  onEdit: () => void;
}

export function BudgetCategory({ name, spent, budget, color, trend, onEdit }: BudgetCategoryProps) {
  const percentage = (spent / budget) * 100;
  const isOverBudget = spent > budget;
  const remaining = budget - spent;

  const colorClasses = {
    blue: { bg: 'bg-blue-500', light: 'bg-blue-100' },
    green: { bg: 'bg-green-500', light: 'bg-green-100' },
    yellow: { bg: 'bg-yellow-500', light: 'bg-yellow-100' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-100' },
    pink: { bg: 'bg-pink-500', light: 'bg-pink-100' },
    indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-100' },
    orange: { bg: 'bg-orange-500', light: 'bg-orange-100' },
  };

  const { bg, light } = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${bg}`} />
          <h4 className="font-medium text-gray-900">{name}</h4>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              ${spent.toLocaleString()} / ${budget.toLocaleString()}
            </p>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-red-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-green-500" />
              )}
              <span>vs last month</span>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded-lg transition-all"
          >
            <Edit3 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-red-500' : bg
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{percentage.toFixed(1)}% used</span>
        <span>
          {isOverBudget ? (
            <span className="text-red-600 font-medium">
              ${Math.abs(remaining).toLocaleString()} over budget
            </span>
          ) : (
            <span className="text-green-600">
              ${remaining.toLocaleString()} remaining
            </span>
          )}
        </span>
      </div>
    </div>
  );
}