import React, { useState } from 'react';
import { BudgetCategory } from './BudgetCategory';
import { AddExpenseModal } from './modals/AddExpenseModal';
import { EditBudgetModal } from './modals/EditBudgetModal';
import { InlineBudgetCategoryForm } from './forms/InlineBudgetCategoryForm';
import { FinancialReportModal } from './modals/FinancialReportModal';
import { Plus, BarChart3, PiggyBank, Trash2 } from 'lucide-react';
import { BudgetCategory as BudgetCategoryType, SavingsGoal } from '../types';

interface BudgetProps {
  budgetCategories: BudgetCategoryType[];
  savingsGoals: SavingsGoal[];
  totalBudget: number;
  totalSpent: number;
  monthlyIncome: number;
  savingsRate: number;
  updateBudgetCategory: (id: string, updates: Partial<BudgetCategoryType>) => void;
  addBudgetCategory: (category: Omit<BudgetCategoryType, 'id'>) => void;
  addTransaction: (transaction: any) => void;
  deleteBudgetCategory: (id: string) => void;
  transactions?: any[];
}

export function Budget({ 
  budgetCategories, 
  savingsGoals,
  totalBudget, 
  totalSpent, 
  monthlyIncome,
  savingsRate,
  updateBudgetCategory,
  addBudgetCategory,
  addTransaction,
  deleteBudgetCategory,
  transactions = []
}: BudgetProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategoryType | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const remaining = totalBudget - totalSpent;
  const overBudgetCategories = budgetCategories.filter(cat => cat.spent > cat.budget);

  const handleEditCategory = (category: BudgetCategoryType) => {
    setSelectedCategory(category);
    setShowEditBudget(true);
  };

  const categoryNames = budgetCategories.map(cat => cat.name);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      tx.category?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  // If no budget categories exist, show getting started view
  if (budgetCategories.length === 0) {
    return (
      <div className="space-y-6">
        {/* Empty State Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl p-8 text-white text-center">
          <PiggyBank className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Create Your First Budget</h2>
          <p className="text-teal-100">Start by creating budget categories to track your spending</p>
        </div>

        {/* Inline Category Creation Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add Budget Category</h2>
              <p className="text-gray-600">Create your first budget category to start tracking expenses</p>
            </div>
          </div>

          <InlineBudgetCategoryForm
            onAddCategory={addBudgetCategory}
            onCancel={() => setShowAddCategory(false)}
          />
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">How to Set Up Your Budget</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Create Categories</h4>
                <p className="text-sm text-gray-600">Add categories like Housing, Food, Transportation, Entertainment, etc.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Set Budget Limits</h4>
                <p className="text-sm text-gray-600">Assign monthly spending limits for each category based on your income.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Track Expenses</h4>
                <p className="text-sm text-gray-600">Add your daily expenses to see how much you're spending in each category.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Get AI Insights</h4>
                <p className="text-sm text-gray-600">Receive personalized recommendations to optimize your spending.</p>
              </div>
            </div>
          </div>

          {/* Popular Budget Categories */}
          <div className="mb-8">
            <h4 className="font-medium text-gray-900 mb-4">Popular Budget Categories</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Housing', color: 'blue' },
                { name: 'Food & Dining', color: 'green' },
                { name: 'Transportation', color: 'yellow' },
                { name: 'Entertainment', color: 'purple' },
                { name: 'Shopping', color: 'pink' },
                { name: 'Healthcare', color: 'indigo' },
                { name: 'Utilities', color: 'orange' },
                { name: 'Insurance', color: 'teal' }
              ].map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    addBudgetCategory({
                      name: category.name,
                      spent: 0,
                      budget: 500, // Default budget
                      color: category.color,
                      trend: 'down'
                    });
                  }}
                  className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div className={`w-3 h-3 bg-${category.color}-500 rounded-full mb-2`} />
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Overview Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">${remaining.toLocaleString()} remaining</h2>
            <p className="text-teal-100">of ${totalBudget.toLocaleString()} monthly budget</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold">${totalSpent.toLocaleString()} spent</h3>
            <p className="text-teal-100">{totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% used</p>
          </div>
        </div>
        <div className="mt-4 w-full bg-teal-400 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }}
          />
        </div>
      </div>

      {/* Budget Alert */}
      {overBudgetCategories.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-400 rounded-full" />
            <p className="text-orange-800 text-sm">
              You've exceeded your budget in {overBudgetCategories.length} categor{overBudgetCategories.length === 1 ? 'y' : 'ies'}: {overBudgetCategories.map(cat => cat.name).join(', ')}. 
              Consider adjusting your spending or budget limits.
            </p>
          </div>
        </div>
      )}

      {/* Add New Category Inline Form */}
      {showAddCategory && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Plus className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Add New Budget Category</h3>
          </div>
          <InlineBudgetCategoryForm
            onAddCategory={(category) => {
              addBudgetCategory(category);
              setShowAddCategory(false);
            }}
            onCancel={() => setShowAddCategory(false)}
          />
        </div>
      )}

      {/* Transaction Search/Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="p-2 border rounded-lg">
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="p-2 border rounded-lg">
          <option value="all">All Categories</option>
          {budgetCategories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Filtered Transactions List */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h4 className="font-semibold mb-2">Transactions</h4>
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredTransactions.map(tx => (
              <li key={tx.id} className="py-2 flex justify-between items-center">
                <span>{tx.date} - {tx.category} - {tx.description} - ${tx.amount} ({tx.type})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Budget Categories */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Budget Categories</h3>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddCategory(true)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
            <button 
              onClick={() => setShowAddExpense(true)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {budgetCategories.map((category) => (
            <div key={category.id} className="flex items-center group">
              <div className="flex-1">
                <BudgetCategory 
                  {...category} 
                  onEdit={() => handleEditCategory(category)}
                />
              </div>
              <button
                className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition"
                title="Delete Category"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this budget category?')) {
                    deleteBudgetCategory(category.id);
                  }
                }}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button 
          onClick={() => setShowAddExpense(true)}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
        <button 
          onClick={() => setShowReport(true)}
          className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onAddExpense={addTransaction}
        categories={categoryNames}
      />

      <EditBudgetModal
        isOpen={showEditBudget}
        onClose={() => setShowEditBudget(false)}
        category={selectedCategory}
        onUpdateBudget={updateBudgetCategory}
      />

      <FinancialReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        budgetCategories={budgetCategories}
        savingsGoals={savingsGoals}
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        monthlyIncome={monthlyIncome}
        savingsRate={savingsRate}
      />
    </div>
  );
}