import React, { useState } from 'react';
import { X, DollarSign, Tag } from 'lucide-react';
import { BudgetCategory } from '../../types';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BudgetCategory | null;
  onUpdateBudget: (id: string, updates: Partial<BudgetCategory>) => void;
}

export function EditBudgetModal({ isOpen, onClose, category, onUpdateBudget }: EditBudgetModalProps) {
  const [budget, setBudget] = useState(category?.budget.toString() || '');
  const [name, setName] = useState(category?.name || '');

  React.useEffect(() => {
    if (category) {
      setBudget(category.budget.toString());
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !budget || !name) return;

    onUpdateBudget(category.id, {
      budget: parseFloat(budget),
      name
    });

    onClose();
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Budget Category</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Category name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Monthly Budget
            </label>
            <input
              type="number"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Spent:</span>
              <span className="font-medium">${category.spent}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">New Budget:</span>
              <span className="font-medium">${budget || '0'}</span>
            </div>
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
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Update Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}