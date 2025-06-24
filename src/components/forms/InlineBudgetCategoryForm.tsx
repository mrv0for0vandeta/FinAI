import React, { useState } from 'react';
import { Tag, DollarSign, Palette, Check, X } from 'lucide-react';
import { BudgetCategory } from '../../types';

interface InlineBudgetCategoryFormProps {
  onAddCategory: (category: Omit<BudgetCategory, 'id'>) => void;
  onCancel: () => void;
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

export function InlineBudgetCategoryForm({ onAddCategory, onCancel }: InlineBudgetCategoryFormProps) {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [color, setColor] = useState('blue');
  const [errors, setErrors] = useState<{ name?: string; budget?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; budget?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (!budget || isNaN(parseFloat(budget)) || parseFloat(budget) <= 0) {
      newErrors.budget = 'Please enter a valid budget amount';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddCategory({
      name: name.trim(),
      spent: 0,
      budget: parseFloat(budget),
      color,
      trend: 'down'
    });

    // Reset form
    setName('');
    setBudget('');
    setColor('blue');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., Housing, Food, Transportation"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Monthly Budget
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
              if (errors.budget) setErrors({ ...errors, budget: undefined });
            }}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.budget ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="500.00"
          />
          {errors.budget && (
            <p className="text-red-600 text-sm mt-1">{errors.budget}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Palette className="w-4 h-4 inline mr-1" />
          Color Theme
        </label>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categoryColors.map((colorOption) => (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => setColor(colorOption.value)}
              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                color === colorOption.value 
                  ? 'border-gray-900 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 ${colorOption.class} rounded-full mx-auto mb-1`} />
              <p className="text-xs text-gray-600">{colorOption.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Budget Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Start with realistic amounts based on your past spending</li>
          <li>• You can always adjust budgets later as you track expenses</li>
          <li>• Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
        </ul>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Create Category</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  );
}