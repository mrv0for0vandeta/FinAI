import React, { useState } from 'react';
import { GoalCard } from './GoalCard';
import { AddMoneyModal } from './modals/AddMoneyModal';
import { InlineSavingsGoalForm } from './forms/InlineSavingsGoalForm';
import { Plus, Target, Trash2 } from 'lucide-react';
import { SavingsGoal } from '../types';

interface SavingsGoalsProps {
  savingsGoals: SavingsGoal[];
  totalSavingsTarget: number;
  totalSavingsCurrent: number;
  addSavingsGoal: (goal: any) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  addMoneyToGoal: (goalId: string, amount: number) => void;
  deleteSavingsGoal: (id: string) => void;
}

export function SavingsGoals({
  savingsGoals,
  totalSavingsTarget,
  totalSavingsCurrent,
  addSavingsGoal,
  updateSavingsGoal,
  addMoneyToGoal,
  deleteSavingsGoal
}: SavingsGoalsProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const overallProgress = totalSavingsTarget > 0 ? (totalSavingsCurrent / totalSavingsTarget) * 100 : 0;

  const handleAddMoney = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setShowAddMoney(true);
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
  };

  return (
    <div className="space-y-6">
      {/* Goals Overview Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">${totalSavingsCurrent.toLocaleString()}</h2>
            <p className="text-purple-100">Total Saved Across All Goals</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold">{overallProgress.toFixed(1)}%</h3>
            <p className="text-purple-100">Overall Progress</p>
          </div>
        </div>
        <div className="mt-4 w-full bg-purple-400 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Goal Optimization Tip */}
      {savingsGoals.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <p className="text-blue-800 text-sm">
              {savingsGoals.some(goal => (goal.current / goal.target) > 0.8) 
                ? "You're close to reaching some goals! Consider increasing contributions to finish them faster."
                : "Stay consistent with your contributions to reach your goals on time."}
            </p>
          </div>
        </div>
      )}

      {/* Add New Goal Inline Form */}
      {showAddGoal ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Create New Savings Goal</h3>
          </div>
          <InlineSavingsGoalForm
            onAddGoal={(goal) => {
              addSavingsGoal(goal);
              setShowAddGoal(false);
            }}
            onCancel={() => setShowAddGoal(false)}
          />
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
             onClick={() => setShowAddGoal(true)}>
          <div className="max-w-sm mx-auto">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Goal</h3>
            <p className="text-gray-500 text-sm mb-4">
              Set a new financial target and let AI help you achieve it
            </p>
            <button 
              onClick={() => setShowAddGoal(true)}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Create Goal
            </button>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {savingsGoals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savingsGoals.map((goal) => (
            editingGoal && editingGoal.id === goal.id ? (
              <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <InlineSavingsGoalForm
                  initialGoal={editingGoal}
                  onAddGoal={(updates) => {
                    updateSavingsGoal(goal.id, updates);
                    setEditingGoal(null);
                  }}
                  onCancel={() => setEditingGoal(null)}
                  isEditMode
                />
              </div>
            ) : (
              <div key={goal.id} className="flex items-center group">
                <div className="flex-1">
            <GoalCard 
              {...goal} 
              onEdit={() => handleEditGoal(goal)}
              onAddMoney={() => handleAddMoney(goal)}
            />
                </div>
                <button
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition"
                  title="Delete Goal"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this savings goal?')) {
                      deleteSavingsGoal(goal.id);
                    }
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )
          ))}
        </div>
      )}

      {/* Monthly Contributions Summary */}
      {savingsGoals.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Contributions Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {savingsGoals.map((goal) => (
              <div key={goal.id} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{goal.name}</p>
                <p className="text-lg font-bold text-blue-600">${goal.monthlyContribution}</p>
                <p className="text-xs text-gray-500">per month</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Monthly Savings:</span>
              <span className="text-xl font-bold text-green-600">
                ${savingsGoals.reduce((sum, goal) => sum + goal.monthlyContribution, 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddMoneyModal
        isOpen={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        goal={selectedGoal}
        onAddMoney={addMoneyToGoal}
      />
    </div>
  );
}