import React, { useState } from 'react';
import { Debt } from '../types';
import { LoanModal as DebtModal } from './modals/LoanModal';
import { LoanPaymentModal as DebtPaymentModal } from './modals/LoanPaymentModal';
import { Plus, Edit, Trash2, CreditCard } from 'lucide-react';

interface DebtsWindowProps {
  debts: Debt[];
  addDebt: any;
  updateDebt: any;
  deleteDebt: any;
  addDebtPayment: any;
}

export function DebtsWindow({ debts, addDebt, updateDebt, deleteDebt, addDebtPayment }: DebtsWindowProps) {
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showDebtPaymentModal, setShowDebtPaymentModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [showPayoffPlanner, setShowPayoffPlanner] = useState(false);

  // Debt payoff planner logic
  const snowballOrder = [...debts].sort((a, b) => a.remaining - b.remaining);
  const avalancheOrder = [...debts].sort((a, b) => (b.interestRate || 0) - (a.interestRate || 0));
  const totalDebt = debts.reduce((sum, d) => sum + d.remaining, 0);
  const avgInterest = debts.length ? (debts.reduce((sum, d) => sum + (d.interestRate || 0), 0) / debts.length).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Debts</h3>
          <div className="flex space-x-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              onClick={() => { setSelectedDebt(null); setShowDebtModal(true); }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Debt</span>
            </button>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              onClick={() => setShowPayoffPlanner(true)}
            >
              <span>Debt Payoff Planner</span>
            </button>
          </div>
        </div>
        {debts.length === 0 ? (
          <p className="text-gray-500">No debts tracked yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Creditor</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {debts.map(debt => (
                  <tr key={debt.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2">{debt.creditor}</td>
                    <td className="px-4 py-2 capitalize">{debt.type}</td>
                    <td className="px-4 py-2">${debt.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">${debt.remaining.toLocaleString()}</td>
                    <td className="px-4 py-2">{debt.dueDate}</td>
                    <td className="px-4 py-2 capitalize">{debt.frequency}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" onClick={() => { setSelectedDebt(debt); setShowDebtModal(true); }}><Edit className="w-4 h-4" /></button>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded" onClick={() => { setSelectedDebt(debt); setShowDebtPaymentModal(true); }}><CreditCard className="w-4 h-4" /></button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded" onClick={() => deleteDebt(debt.id)}><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Debt Payoff Planner Modal */}
      {showPayoffPlanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8 relative">
            <button onClick={() => setShowPayoffPlanner(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-500 text-xl">×</span>
            </button>
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Debt Payoff Planner</h2>
            <div className="mb-4">
              <div className="flex space-x-8 mb-4">
                <div>
                  <div className="text-gray-500 text-sm">Total Debt</div>
                  <div className="text-lg font-semibold text-gray-900">${totalDebt.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Average Interest Rate</div>
                  <div className="text-lg font-semibold text-gray-900">{avgInterest}%</div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Snowball Method (Lowest Balance First)</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {snowballOrder.map((debt, i) => (
                    <li key={debt.id} className="text-gray-700">
                      <span className="font-medium">{debt.creditor}</span>: ${debt.remaining.toLocaleString()} @ {debt.interestRate || 0}%
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Avalanche Method (Highest Interest First)</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {avalancheOrder.map((debt, i) => (
                    <li key={debt.id} className="text-gray-700">
                      <span className="font-medium">{debt.creditor}</span>: ${debt.remaining.toLocaleString()} @ {debt.interestRate || 0}%
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-purple-900 mb-2">How to Use</h4>
              <ul className="text-sm text-purple-800 list-disc list-inside space-y-1">
                <li>Snowball: Pay off the smallest balance first for quick wins and motivation.</li>
                <li>Avalanche: Pay off the highest interest rate first to save the most money.</li>
                <li>Make extra payments whenever possible to accelerate your progress.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <DebtModal
        isOpen={showDebtModal}
        onClose={() => setShowDebtModal(false)}
        onSave={(debt) => {
          if (selectedDebt) updateDebt(selectedDebt.id, debt);
          else addDebt(debt);
          setShowDebtModal(false);
        }}
        debt={selectedDebt}
      />
      <DebtPaymentModal
        isOpen={showDebtPaymentModal}
        onClose={() => setShowDebtPaymentModal(false)}
        onSave={(payment) => {
          if (selectedDebt) addDebtPayment(selectedDebt.id, payment);
          setShowDebtPaymentModal(false);
        }}
        debt={selectedDebt}
      />
    </div>
  );
} 