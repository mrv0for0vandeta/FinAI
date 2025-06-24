import React, { useState } from 'react';
import { Target, DollarSign, Calendar, FileText, Tag, Check, X } from 'lucide-react';

interface InlineSavingsGoalFormProps {
  onAddGoal: (goal: {
    name: string;
    description: string;
    current: number;
    target: number;
    targetDate: string;
    category: string;
    monthlyContribution: number;
    color: string;
  }) => void;
  onCancel: () => void;
  initialGoal?: {
    name: string;
    description: string;
    current: number;
    target: number;
    targetDate: string;
    category: string;
    monthlyContribution: number;
    color: string;
  };
  isEditMode?: boolean;
}

const goalCategories = ['Safety', 'Travel', 'Housing', 'Retirement', 'Education', 'Other'];
const goalColors = ['blue', 'green', 'purple', 'orange', 'pink', 'indigo'];

export function InlineSavingsGoalForm({ onAddGoal, onCancel, initialGoal, isEditMode }: InlineSavingsGoalFormProps) {
  const [name, setName] = useState(initialGoal?.name || '');
  const [description, setDescription] = useState(initialGoal?.description || '');
  const [current, setCurrent] = useState(initialGoal ? initialGoal.current.toString() : '0');
  const [target, setTarget] = useState(initialGoal ? initialGoal.target.toString() : '');
  const [targetDate, setTargetDate] = useState(initialGoal?.targetDate || '');
  const [category, setCategory] = useState(initialGoal?.category || '');
  const [monthlyContribution, setMonthlyContribution] = useState(initialGoal ? initialGoal.monthlyContribution.toString() : '');
  const [color, setColor] = useState(initialGoal?.color || 'blue');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Goal name is required';
    if (!target || isNaN(parseFloat(target)) || parseFloat(target) <= 0) {
      newErrors.target = 'Please enter a valid target amount';
    }
    if (!targetDate) newErrors.targetDate = 'Target date is required';
    if (!category) newErrors.category = 'Please select a category';
    if (!monthlyContribution || isNaN(parseFloat(monthlyContribution)) || parseFloat(monthlyContribution) <= 0) {
      newErrors.monthlyContribution = 'Please enter a valid monthly contribution';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddGoal({
      name: name.trim(),
      description: description.trim(),
      current: parseFloat(current),
      target: parseFloat(target),
      targetDate,
      category,
      monthlyContribution: parseFloat(monthlyContribution),
      color
    });

    // Reset form
    setName('');
    setDescription('');
    setCurrent('0');
    setTarget('');
    setTargetDate('');
    setCategory('');
    setMonthlyContribution('');
    setColor('blue');
    setErrors({});
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="w-4 h-4 inline mr-1" />
            Goal Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError('name');
            }}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., Emergency Fund"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              clearError('category');
            }}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {goalCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your goal..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Current Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            disabled={isEditMode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="w-4 h-4 inline mr-1" />
            Target Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
              clearError('target');
            }}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.target ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="10000.00"
          />
          {errors.target && <p className="text-red-600 text-sm mt-1">{errors.target}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Monthly Contribution
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={monthlyContribution}
            onChange={(e) => {
              setMonthlyContribution(e.target.value);
              clearError('monthlyContribution');
            }}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.monthlyContribution ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="500.00"
          />
          {errors.monthlyContribution && <p className="text-red-600 text-sm mt-1">{errors.monthlyContribution}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Target Date
        </label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => {
            setTargetDate(e.target.value);
            clearError('targetDate');
          }}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.targetDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.targetDate && <p className="text-red-600 text-sm mt-1">{errors.targetDate}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color Theme
        </label>
        <div className="flex space-x-3">
          {goalColors.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              onClick={() => setColor(colorOption)}
              className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                color === colorOption ? 'border-gray-900 shadow-lg' : 'border-gray-300'
              } ${
                colorOption === 'blue' ? 'bg-blue-500' :
                colorOption === 'green' ? 'bg-green-500' :
                colorOption === 'purple' ? 'bg-purple-500' :
                colorOption === 'orange' ? 'bg-orange-500' :
                colorOption === 'pink' ? 'bg-pink-500' :
                'bg-indigo-500'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Savings Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Set realistic monthly contributions based on your budget</li>
          <li>• Emergency funds should cover 3-6 months of expenses</li>
          <li>• Break large goals into smaller milestones for motivation</li>
          <li>• Automate your savings to stay consistent</li>
        </ul>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Create Goal</span>
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