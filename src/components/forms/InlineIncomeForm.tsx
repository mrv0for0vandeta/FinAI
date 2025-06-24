import React, { useState } from 'react';
import { DollarSign, Check, X } from 'lucide-react';

type FrequencyType = 'monthly' | 'weekly' | 'daily' | 'bi-weekly' | 'semi-monthly' | 'quarterly' | 'yearly' | 'custom';
type CustomFrequency = { type: 'custom'; days: number };

interface InlineIncomeFormProps {
  currentIncome: number;
  onSave: (income: number, frequency: FrequencyType | CustomFrequency, recurringOptions?: {
    isRecurring?: boolean;
    recurrence?: FrequencyType | 'custom';
    recurrenceIntervalDays?: number;
    recurrenceEndDate?: string;
    nextRecurrenceDate?: string;
  }) => void;
  onCancel: () => void;
  currentFrequency?: FrequencyType | CustomFrequency;
}

export function InlineIncomeForm({ currentIncome, onSave, onCancel, currentFrequency = 'monthly' }: InlineIncomeFormProps) {
  const [income, setIncome] = useState(currentIncome.toString());
  const [isValid, setIsValid] = useState(true);
  const [frequency, setFrequency] = useState<FrequencyType>(typeof currentFrequency === 'string' ? currentFrequency : 'custom');
  const [customDays, setCustomDays] = useState(
    typeof currentFrequency === 'object' && currentFrequency.type === 'custom' ? String(currentFrequency.days) : ''
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericIncome = parseFloat(income);
    
    if (isNaN(numericIncome) || numericIncome < 0) {
      setIsValid(false);
      return;
    }
    
    setIsValid(true);
    if (frequency === 'custom' && customDays) {
      onSave(numericIncome, { type: 'custom', days: parseInt(customDays, 10) }, isRecurring ? {
        isRecurring: true,
        recurrence: 'custom',
        recurrenceIntervalDays: parseInt(customDays, 10),
        recurrenceEndDate: recurrenceEndDate || undefined,
        nextRecurrenceDate: new Date().toISOString().split('T')[0]
      } : undefined);
    } else {
      onSave(numericIncome, frequency, isRecurring ? {
        isRecurring: true,
        recurrence: frequency,
        recurrenceEndDate: recurrenceEndDate || undefined,
        nextRecurrenceDate: new Date().toISOString().split('T')[0]
      } : undefined);
    }
  };

  const handleIncomeChange = (value: string) => {
    setIncome(value);
    setIsValid(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Income Amount (after taxes)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            step="0.01"
            min="0"
            value={income}
            onChange={(e) => handleIncomeChange(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              !isValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="5000.00"
            required
          />
        </div>
        {!isValid && (
          <p className="text-red-600 text-sm mt-1">Please enter a valid income amount</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Income Frequency</label>
        <select
          value={frequency}
          onChange={e => setFrequency(e.target.value as any)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="monthly">Monthly</option>
          <option value="semi-monthly">Semi-Monthly (twice a month)</option>
          <option value="bi-weekly">Bi-Weekly (every 2 weeks)</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
          <option value="custom">Custom</option>
        </select>
        {frequency === 'custom' && (
          <input
            type="number"
            min="1"
            value={customDays}
            onChange={e => setCustomDays(e.target.value)}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter number of days between payments"
            required
          />
        )}
      </div>

      <div>
        <label className="flex items-center space-x-2 mb-2">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={e => setIsRecurring(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Recurring</span>
        </label>
        {isRecurring && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">End Date (optional)</label>
            <input
              type="date"
              value={recurrenceEndDate}
              onChange={e => setRecurrenceEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Why we need this:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Calculate your savings rate percentage</li>
          <li>• Provide personalized budget recommendations</li>
          <li>• Track your financial progress over time</li>
          <li>• Generate AI-powered insights for optimization</li>
        </ul>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Check className="w-4 h-4" />
          <span>Save Income</span>
        </button>
        {currentIncome > 0 && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        )}
      </div>
    </form>
  );
}