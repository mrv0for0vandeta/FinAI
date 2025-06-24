import React, { useState } from 'react';
import { X, Tag, DollarSign, Palette } from 'lucide-react';
import { BudgetCategory } from '../../types';

interface AddBudgetCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: Omit<BudgetCategory, 'id'>) => void;
}

const categoryColors = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
  { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Teal', value: 'teal', class: 'bg-teal-500' }
];

export function AddBudgetCategoryModal({ isOpen, onClose, onAddCategory }: AddBudgetCategoryModalProps) {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [color, setColor] = useState('blue');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !budget) return;

    onAddCategory({
      name,
      spent: 0,
      budget: parseFloat(budget),
      color,
      trend: 'down'
    });

    // Reset form
    setName('');
    setBudget('');
    setColor('blue');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-green-50 rounded-xl shadow-xl max-w-xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-green-900">Add Budget Category</h2>
          </div>
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Housing, Food, Transportation"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              Color Theme
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categoryColors.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setColor(colorOption.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    color === colorOption.value 
                      ? 'border-green-900 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 ${colorOption.class} rounded-full mx-auto`} />
                  <p className="text-xs text-gray-600 mt-1">{colorOption.name}</p>
                </button>
              ))}
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
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}