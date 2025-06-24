import React from 'react';
import { Calendar, Target, TrendingUp, Edit3, Plus } from 'lucide-react';

interface GoalCardProps {
  id: string;
  name: string;
  description: string;
  current: number;
  target: number;
  targetDate: string;
  category: string;
  monthlyContribution: number;
  color: string;
  onEdit: () => void;
  onAddMoney: () => void;
}

export function GoalCard({
  name,
  description,
  current,
  target,
  targetDate,
  category,
  monthlyContribution,
  color,
  onEdit,
  onAddMoney
}: GoalCardProps) {
  const progress = (current / target) * 100;
  const remaining = target - current;
  const monthsToTarget = Math.ceil(remaining / monthlyContribution);

  const colorClasses = {
    blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700' },
    green: { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700' },
    orange: { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700' },
  };

  const { bg, light, text } = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className={`h-1 ${bg}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-gray-400" />
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${light} ${text}`}>
                {category}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <button
            onClick={onEdit}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Edit3 className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              ${current.toLocaleString()} saved
            </span>
            <span className="text-sm font-medium text-gray-900">
              ${target.toLocaleString()} goal
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${bg}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{progress.toFixed(1)}% complete</span>
            <span>${remaining.toLocaleString()} remaining</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-1 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Target: {targetDate}</span>
          </div>
          <div className="flex items-center space-x-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>{monthsToTarget} months</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={onEdit}
            className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Edit Goal
          </button>
          <button 
            onClick={onAddMoney}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Money</span>
          </button>
        </div>
      </div>
    </div>
  );
}