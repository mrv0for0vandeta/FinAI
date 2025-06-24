import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Debt } from '../../types';

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (debt: Omit<Debt, 'id' | 'payments' | 'remaining'>) => void;
  debt?: Debt | null;
}

const frequencies = ['monthly', 'semi-monthly', 'bi-weekly', 'weekly', 'daily', 'quarterly', 'yearly', 'custom'];
const debtTypes = ['Personal Loan', 'Credit Card', 'Mortgage', 'Student Loan', 'Medical', 'Other'];

export function LoanModal({ isOpen, onClose, onSave, debt }: DebtModalProps) {
  const [creditor, setCreditor] = useState('');
  const [type, setType] = useState('Personal Loan');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [interestRate, setInterestRate] = useState('');

  useEffect(() => {
    if (debt) {
      setCreditor(debt.creditor);
      setType(debt.type);
      setAmount(debt.amount.toString());
      setDescription(debt.description || '');
      setStartDate(debt.startDate);
      setDueDate(debt.dueDate);
      setFrequency(debt.frequency);
      setInterestRate(debt.interestRate?.toString() || '');
    } else {
      setCreditor('');
      setType('Personal Loan');
      setAmount('');
      setDescription('');
      setStartDate('');
      setDueDate('');
      setFrequency('monthly');
      setInterestRate('');
    }
  }, [debt, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditor || !amount || !startDate || !dueDate || !frequency || !type) return;
    onSave({
      creditor,
      type: type as Debt['type'],
      amount: parseFloat(amount),
      description,
      startDate,
      dueDate,
      frequency: frequency as Debt['frequency'],
      interestRate: interestRate ? parseFloat(interestRate) : undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-green-50 rounded-xl shadow-xl max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-green-900 flex items-center space-x-2">
            <DollarSign className="w-6 h-6 mr-2 text-green-600" />
            <span>{debt ? 'Edit Debt' : 'Add Debt'}</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Creditor</label>
              <input type="text" value={creditor} onChange={e => setCreditor(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                {debtTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input type="number" min="0" step="0.01" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required>
                {frequencies.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">{debt ? 'Update Debt' : 'Add Debt'}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 