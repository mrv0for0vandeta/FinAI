import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Budget } from './components/Budget';
import { SavingsGoals } from './components/SavingsGoals';
import { AIInsights } from './components/AIInsights';
import { useFinancialData } from './hooks/useFinancialData';
import { DebtsWindow } from './components/DebtsWindow';

type ActiveTab = 'dashboard' | 'budget' | 'savings' | 'insights' | 'debts';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('debts');
  const {
    budgetCategories,
    savingsGoals,
    transactions,
    insights,
    monthlyTrends,
    totalBudget,
    totalSpent,
    totalSavingsTarget,
    totalSavingsCurrent,
    monthlyIncome,
    savingsRate,
    updateBudgetCategory,
    addBudgetCategory,
    deleteBudgetCategory,
    updateSavingsGoal,
    addSavingsGoal,
    deleteSavingsGoal,
    addMoneyToGoal,
    addTransaction,
    updateMonthlyIncome,
    dismissInsight,
    debts,
    addDebt,
    updateDebt,
    deleteDebt,
    addDebtPayment,
    incomeFrequency,
    setIncomeFrequency
  } = useFinancialData();

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  // Currency state
  const currencyOptions = [
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'MAD', symbol: 'د.م.', label: 'Moroccan Dirham' },
    { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
    { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', label: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
    { code: 'CHF', symbol: 'Fr.', label: 'Swiss Franc' },
  ];
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currency') || 'USD';
    }
    return 'USD';
  });

  // Currency formatting utility
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading FinAI Planner...</p>
        </div>
      </div>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard
          budgetCategories={budgetCategories}
          savingsGoals={savingsGoals}
          insights={insights}
          monthlyTrends={monthlyTrends}
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          totalSavingsCurrent={totalSavingsCurrent}
          monthlyIncome={monthlyIncome}
          savingsRate={savingsRate}
          dismissInsight={dismissInsight}
          updateMonthlyIncome={updateMonthlyIncome}
          debts={debts}
          addDebt={addDebt}
          updateDebt={updateDebt}
          deleteDebt={deleteDebt}
          addDebtPayment={addDebtPayment}
          incomeFrequency={incomeFrequency}
          setIncomeFrequency={setIncomeFrequency}
          addBudgetCategory={addBudgetCategory}
          addSavingsGoal={addSavingsGoal}
          setActiveTab={setActiveTab}
        />;
      case 'budget':
        return <Budget
          budgetCategories={budgetCategories}
          savingsGoals={savingsGoals}
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          monthlyIncome={monthlyIncome}
          savingsRate={savingsRate}
          updateBudgetCategory={updateBudgetCategory}
          addBudgetCategory={addBudgetCategory}
          addTransaction={addTransaction}
          deleteBudgetCategory={deleteBudgetCategory}
        />;
      case 'savings':
        return <SavingsGoals
          savingsGoals={savingsGoals}
          totalSavingsTarget={totalSavingsTarget}
          totalSavingsCurrent={totalSavingsCurrent}
          addSavingsGoal={addSavingsGoal}
          updateSavingsGoal={updateSavingsGoal}
          addMoneyToGoal={addMoneyToGoal}
          deleteSavingsGoal={deleteSavingsGoal}
        />;
      case 'insights':
        return <AIInsights
          insights={insights}
          totalSpent={totalSpent}
          totalBudget={totalBudget}
          savingsRate={savingsRate}
          dismissInsight={dismissInsight}
        />;
      case 'debts':
        return <DebtsWindow
          debts={debts}
          addDebt={addDebt}
          updateDebt={updateDebt}
          deleteDebt={deleteDebt}
          addDebtPayment={addDebtPayment}
        />;
      default:
        return <Dashboard
          budgetCategories={budgetCategories}
          savingsGoals={savingsGoals}
          insights={insights}
          monthlyTrends={monthlyTrends}
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          totalSavingsCurrent={totalSavingsCurrent}
          monthlyIncome={monthlyIncome}
          savingsRate={savingsRate}
          dismissInsight={dismissInsight}
          updateMonthlyIncome={updateMonthlyIncome}
          debts={debts}
          addDebt={addDebt}
          updateDebt={updateDebt}
          deleteDebt={deleteDebt}
          addDebtPayment={addDebtPayment}
          incomeFrequency={incomeFrequency}
          setIncomeFrequency={setIncomeFrequency}
          addBudgetCategory={addBudgetCategory}
          addSavingsGoal={addSavingsGoal}
          setActiveTab={setActiveTab}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-y-scroll">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        extraTabs={[{ key: 'debts', label: 'Debts' }]}
        rightContent={
          <div className="flex items-center space-x-2">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="px-2 py-1 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              title="Select currency"
            >
              {currencyOptions.map(opt => (
                <option key={opt.code} value={opt.code}>{opt.symbol} {opt.code}</option>
              ))}
            </select>
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="ml-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              title="Toggle dark mode"
            >
              {darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        }
        currency={currency}
        formatCurrency={formatCurrency}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;