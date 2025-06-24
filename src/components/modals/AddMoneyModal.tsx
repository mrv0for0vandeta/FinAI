import React, { useState } from 'react';
import { X, DollarSign, PlusCircle } from 'lucide-react';
import { SavingsGoal } from '../../types';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
  onAddMoney: (goalId: string, amount: number) => void;
}

export function AddMoneyModal({ isOpen, onClose, goal, onAddMoney }: AddMoneyModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !amount) return;

    onAddMoney(goal.id, parseFloat(amount));
    setAmount('');
    onClose();
  };

  if (!isOpen || !goal) return null;

  const remaining = goal.target - goal.current;
  const maxAmount = Math.min(remaining, 10000); // Reasonable max

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Money to Goal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">{goal.name}</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Current:</span>
              <span>${goal.current.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Target:</span>
              <span>${goal.target.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-900">
              <span>Remaining:</span>
              <span>${remaining.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Amount to Add
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={maxAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: ${maxAmount.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[100, 500, 1000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={quickAmount > maxAmount}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Money</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}