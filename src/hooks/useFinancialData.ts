import { useState, useEffect } from 'react';
import { BudgetCategory, SavingsGoal, Transaction, AIInsight, MonthlyData, Debt, DebtPayment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { setMonthlyGraphData, getMonthlyGraphData } from '../data/userGraphData';
import { useNotifications } from '../contexts/NotificationContext';

// Empty initial data - users start with blank slate
const emptyBudgetData: BudgetCategory[] = [];
const emptySavingsGoals: SavingsGoal[] = [];
const emptyInsights: AIInsight[] = [];

// Basic monthly data structure - will be empty until user adds income/expenses
const emptyMonthlyData: MonthlyData[] = [
  { month: 'Jan', income: 0, expenses: 0, savings: 0 },
  { month: 'Feb', income: 0, expenses: 0, savings: 0 },
  { month: 'Mar', income: 0, expenses: 0, savings: 0 },
  { month: 'Apr', income: 0, expenses: 0, savings: 0 },
  { month: 'May', income: 0, expenses: 0, savings: 0 },
  { month: 'Jun', income: 0, expenses: 0, savings: 0 },
];

type FrequencyType = 'monthly' | 'weekly' | 'daily' | 'bi-weekly' | 'semi-monthly' | 'quarterly' | 'yearly' | 'custom';
type CustomFrequency = { type: 'custom'; days: number };

const USE_BACKEND = false; // Set to true to use backend API

// Placeholder async API functions for backend integration
async function apiLoadUserData(userId: string): Promise<any> {
  // TODO: Replace with real API call
  // Example: return fetch(`/api/userdata/${userId}`).then(res => res.json());
  return null;
}
async function apiSaveUserData(userId: string, data: any) {
  // TODO: Replace with real API call
  // Example: return fetch(`/api/userdata/${userId}`, { method: 'POST', body: JSON.stringify(data) });
  return;
}

export function useFinancialData() {
  const { user } = useAuth();
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyData[]>(emptyMonthlyData);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [incomeFrequency, setIncomeFrequency] = useState<FrequencyType | CustomFrequency>('monthly');
  const [debts, setDebts] = useState<Debt[]>([]);
  const { addNotification } = useNotifications();

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setBudgetCategories([]);
      setSavingsGoals([]);
      setTransactions([]);
      setInsights([]);
      setMonthlyTrends(emptyMonthlyData);
      setMonthlyIncome(0);
      setIncomeFrequency('monthly');
      setDebts([]);
    }
  }, [user]);

  // Load savings goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    if (savedGoals) {
      try {
        setSavingsGoals(JSON.parse(savedGoals));
      } catch {}
    }
  }, []);

  const loadUserData = () => {
    if (!user) return;
    if (USE_BACKEND) {
      apiLoadUserData(user.id).then(data => {
        if (data) {
          setBudgetCategories(data.budgetCategories || []);
          setSavingsGoals(data.savingsGoals || []);
          setTransactions(data.transactions || []);
          setInsights(data.insights || []);
          setMonthlyTrends(data.monthlyTrends || emptyMonthlyData);
          setMonthlyIncome(data.monthlyIncome || 0);
          setIncomeFrequency(data.incomeFrequency || 'monthly');
          setDebts(data.debts || []);
        }
      });
      return;
    }

    const userDataKey = `finai_data_${user.id}`;
    const savedData = localStorage.getItem(userDataKey);

    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setBudgetCategories(data.budgetCategories || []);
        setSavingsGoals(data.savingsGoals || []);
        setTransactions(data.transactions || []);
        setInsights(data.insights || []);
        setMonthlyTrends(data.monthlyTrends || emptyMonthlyData);
        setMonthlyIncome(data.monthlyIncome || 0);
        setIncomeFrequency(data.incomeFrequency || 'monthly');
        setDebts(data.debts || []);
      } catch (error) {
        // If data is corrupted, start with empty data
        setBudgetCategories([]);
        setSavingsGoals([]);
        setTransactions([]);
        setInsights([]);
        setMonthlyTrends(emptyMonthlyData);
        setMonthlyIncome(0);
        setIncomeFrequency('monthly');
        setDebts([]);
      }
    } else {
      // First time user, start with empty data
      setBudgetCategories([]);
      setSavingsGoals([]);
      setTransactions([]);
      setInsights([]);
      setMonthlyTrends(emptyMonthlyData);
      setMonthlyIncome(0);
      setIncomeFrequency('monthly');
      setDebts([]);
    }
  };

  const saveUserData = (data: any) => {
    if (!user) return;
    if (USE_BACKEND) {
      apiSaveUserData(user.id, data);
      return;
    }

    const userDataKey = `finai_data_${user.id}`;
    localStorage.setItem(userDataKey, JSON.stringify(data));
  };

  // Calculate derived metrics
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
  const totalSavingsCurrent = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome) * 100 : 0;

  // Budget functions
  const updateBudgetCategory = (id: string, updates: Partial<BudgetCategory>) => {
    const newCategories = budgetCategories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    );
    setBudgetCategories(newCategories);
    
    saveUserData({
      budgetCategories: newCategories,
      savingsGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      incomeFrequency,
      debts
    });
  };

  const addBudgetCategory = (category: Omit<BudgetCategory, 'id'>) => {
    const newCategory: BudgetCategory = {
      ...category,
      id: Date.now().toString()
    };
    const newCategories = [...budgetCategories, newCategory];
    setBudgetCategories(newCategories);
    
    saveUserData({
      budgetCategories: newCategories,
      savingsGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      incomeFrequency,
      debts
    });
  };

  const deleteBudgetCategory = (id: string) => {
    const newCategories = budgetCategories.filter(cat => cat.id !== id);
    setBudgetCategories(newCategories);
    
    saveUserData({
      budgetCategories: newCategories,
      savingsGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      incomeFrequency,
      debts
    });
  };

  // Savings goals functions
  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    const newGoals = savingsGoals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    );
    setSavingsGoals(newGoals);
    
    saveUserData({
      budgetCategories,
      savingsGoals: newGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      incomeFrequency,
      debts
    });
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString()
    };
    const newGoals = [...savingsGoals, newGoal];
    setSavingsGoals(newGoals);
    localStorage.setItem('savingsGoals', JSON.stringify(newGoals));
    
    saveUserData({
      budgetCategories,
      savingsGoals: newGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      incomeFrequency,
      debts
    });

    // Also save to userGraphData for use in the graph
    // Example: add/update the current month in monthly graph data
    const now = new Date();
    const monthKey = now.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    let monthlyData = getMonthlyGraphData();
    const idx = monthlyData.findIndex(m => m.month === monthKey);
    if (idx !== -1) {
      // Update existing month
      monthlyData[idx] = {
        ...monthlyData[idx],
        savings: (monthlyData[idx].savings || 0) + newGoal.current
      };
    } else {
      // Add new month
      monthlyData.push({
        month: monthKey,
        income: 0,
        expenses: 0,
        savings: newGoal.current
      });
    }
    setMonthlyGraphData(monthlyData);
  };

  const deleteSavingsGoal = (id: string) => {
    const newGoals = savingsGoals.filter(goal => goal.id !== id);
    setSavingsGoals(newGoals);
    
    saveUserData({
      budgetCategories,
      savingsGoals: newGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      incomeFrequency,
      debts
    });
  };

  const addMoneyToGoal = (id: string, amount: number) => {
    const newGoals = savingsGoals.map(goal => 
      goal.id === id 
        ? { ...goal, current: Math.min(goal.current + amount, goal.target) }
        : goal
    );
    setSavingsGoals(newGoals);
    
    saveUserData({
      budgetCategories,
      savingsGoals: newGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      incomeFrequency,
      debts
    });
  };

  // Income management
  const updateMonthlyIncome = (income: number) => {
    setMonthlyIncome(income);
    
    // Update current month's income in trends
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
    const newTrends = monthlyTrends.map(trend => 
      trend.month === currentMonth 
        ? { 
            ...trend, 
            income, 
            savings: (income !== 0 && trend.expenses !== 0) ? income - trend.expenses : 0 
          }
        : trend
    );
    setMonthlyTrends(newTrends);
    
    saveUserData({
      budgetCategories,
      savingsGoals,
      transactions,
      insights,
      monthlyTrends: newTrends,
      monthlyIncome: income,
      incomeFrequency,
      debts
    });
  };

  const setIncomeFrequencyAndSave = (freq: FrequencyType | CustomFrequency) => {
    setIncomeFrequency(freq);
    saveUserData({
      budgetCategories,
      savingsGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      incomeFrequency: freq,
      debts
    });
  };

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    const newTransactions = [newTransaction, ...transactions];
    setTransactions(newTransactions);

    // Update budget category if it's an expense
    let newCategories = budgetCategories;
    if (transaction.type === 'expense') {
      const category = budgetCategories.find(cat => 
        cat.name.toLowerCase() === transaction.category.toLowerCase()
      );
      if (category) {
        newCategories = budgetCategories.map(cat =>
          cat.id === category.id
            ? { ...cat, spent: cat.spent + transaction.amount }
            : cat
        );
        setBudgetCategories(newCategories);
      }
    }

    // Update monthly trends
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
    const newTrends = monthlyTrends.map(trend => {
      if (trend.month === currentMonth) {
        const newExpenses = transaction.type === 'expense' 
          ? trend.expenses + transaction.amount 
          : trend.expenses;
        const newIncome = transaction.type === 'income' 
          ? trend.income + transaction.amount 
          : trend.income;
        return {
          ...trend,
          expenses: newExpenses,
          income: newIncome,
          savings: (newIncome !== 0 && newExpenses !== 0) ? newIncome - newExpenses : 0
        };
      }
      return trend;
    });
    setMonthlyTrends(newTrends);

    saveUserData({
      budgetCategories: newCategories,
      savingsGoals,
      transactions: newTransactions,
      insights,
      monthlyTrends: newTrends,
      monthlyIncome,
      incomeFrequency,
      debts
    });

    // Generate AI insights based on spending patterns
    generateAIInsights(newCategories, newTransactions);
  };

  // AI Insights generation
  const generateAIInsights = (categories: BudgetCategory[], transactions: Transaction[]) => {
    const newInsights: AIInsight[] = [];

    // Check for over-budget categories
    categories.forEach(cat => {
      if (cat.spent > cat.budget) {
        newInsights.push({
          id: `budget_${cat.id}_${Date.now()}`,
          title: `${cat.name} Budget Exceeded`,
          description: `You've spent $${(cat.spent - cat.budget).toFixed(2)} over your ${cat.name} budget this month. Consider reducing expenses in this category.`,
          confidence: 95,
          type: 'warning',
          category: 'Budget',
          actionable: true
        });
      }
    });

    // Check for high spending frequency
    const recentTransactions = transactions.slice(0, 10);
    const expensesByCategory = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    Object.entries(expensesByCategory).forEach(([category, count]) => {
      if (count >= 5) {
        newInsights.push({
          id: `frequency_${category}_${Date.now()}`,
          title: `High Spending Frequency in ${category}`,
          description: `You've made ${count} ${category} transactions recently. Consider setting a weekly limit to better control spending.`,
          confidence: 85,
          type: 'info',
          category: 'Optimization',
          actionable: true
        });
      }
    });

    // Positive insights for good savings rate
    if (savingsRate > 20) {
      newInsights.push({
        id: `savings_rate_${Date.now()}`,
        title: 'Excellent Savings Rate!',
        description: `Your savings rate of ${savingsRate.toFixed(1)}% is above the recommended 20%. Keep up the great work!`,
        confidence: 90,
        type: 'success',
        category: 'Goals',
        actionable: false
      });
    }

    if (newInsights.length > 0) {
      const updatedInsights = [...insights, ...newInsights];
      setInsights(updatedInsights);
      
      saveUserData({
        budgetCategories: categories,
        savingsGoals,
        transactions,
        insights: updatedInsights,
        monthlyTrends,
        monthlyIncome,
        incomeFrequency,
        debts
      });
    }
  };

  // Insights functions
  const dismissInsight = (id: string) => {
    const newInsights = insights.map(insight => 
      insight.id === id ? { ...insight, dismissed: true } : insight
    );
    setInsights(newInsights);
    
    saveUserData({
      budgetCategories,
      savingsGoals,
      transactions,
      insights: newInsights,
      monthlyTrends,
      monthlyIncome,
      incomeFrequency,
      debts
    });
  };

  const activeInsights = insights.filter(insight => !insight.dismissed);

  // Debt functions
  const addDebt = (debt: Omit<Debt, 'id' | 'payments' | 'remaining'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      payments: [],
      remaining: debt.amount,
    };
    const newDebts = [...debts, newDebt];
    setDebts(newDebts);
    saveUserData({
      budgetCategories,
      savingsGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      debts: newDebts
    });
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, ...updates } : debt);
    setDebts(newDebts);
    saveUserData({
      budgetCategories,
      savingsGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      debts: newDebts
    });
  };

  const deleteDebt = (id: string) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    setDebts(newDebts);
    saveUserData({
      budgetCategories,
      savingsGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      debts: newDebts
    });
  };

  const addDebtPayment = (debtId: string, payment: Omit<DebtPayment, 'id'>) => {
    const newDebts = debts.map(debt => {
      if (debt.id === debtId) {
        const newPayment: DebtPayment = { ...payment, id: Date.now().toString() };
        const updatedPayments = [...debt.payments, newPayment];
        const newRemaining = debt.remaining - newPayment.amount;
        return { ...debt, payments: updatedPayments, remaining: newRemaining };
      }
      return debt;
    });
    setDebts(newDebts);
    saveUserData({
      budgetCategories,
      savingsGoals,
      transactions,
      insights,
      monthlyTrends,
      monthlyIncome,
      debts: newDebts
    });
  };

  // Recurring transaction logic
  const generateRecurringTransactions = () => {
    const now = new Date();
    let updated = false;
    const newTransactions = transactions.flatMap(tx => {
      if (!tx.isRecurring || !tx.recurrence) return [tx];
      let nextDate = tx.nextRecurrenceDate ? new Date(tx.nextRecurrenceDate) : new Date(tx.date);
      const endDate = tx.recurrenceEndDate ? new Date(tx.recurrenceEndDate) : null;
      const recurrences = [];
      while (nextDate <= now && (!endDate || nextDate <= endDate)) {
        // Only add if not already present
        if (!transactions.some(t => t.date === nextDate.toISOString().split('T')[0] && t.description === tx.description && t.amount === tx.amount)) {
          recurrences.push({ ...tx, id: Date.now().toString() + Math.random(), date: nextDate.toISOString().split('T')[0], isRecurring: false });
          updated = true;
        }
        // Calculate next recurrence
        switch (tx.recurrence) {
          case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
          case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
          case 'bi-weekly': nextDate.setDate(nextDate.getDate() + 14); break;
          case 'semi-monthly': nextDate.setDate(nextDate.getDate() + 15); break;
          case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
          case 'quarterly': nextDate.setMonth(nextDate.getMonth() + 3); break;
          case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
          case 'custom':
            if (tx.recurrenceIntervalDays) nextDate.setDate(nextDate.getDate() + tx.recurrenceIntervalDays);
            else nextDate.setDate(nextDate.getDate() + 1);
            break;
          default: nextDate.setDate(nextDate.getDate() + 1);
        }
      }
      return [tx, ...recurrences];
    });
    if (updated) setTransactions(newTransactions);
  };

  useEffect(() => {
    generateRecurringTransactions();
    // Optionally, set up a timer to run this daily
    // const interval = setInterval(generateRecurringTransactions, 24 * 60 * 60 * 1000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Debt due date reminders (within 7 days)
    debts.forEach(debt => {
      if (debt.dueDate) {
        const due = new Date(debt.dueDate);
        const now = new Date();
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 7) {
          addNotification(`Debt to ${debt.creditor} is due in ${diffDays} day(s).`);
        }
      }
    });
    // Budget category overages
    budgetCategories.forEach(cat => {
      if (cat.spent > cat.budget) {
        addNotification(`You are over budget in ${cat.name} by $${(cat.spent - cat.budget).toFixed(2)}.`);
      }
    });
    // Savings goal deadlines (within 7 days)
    savingsGoals.forEach(goal => {
      if (goal.targetDate) {
        const due = new Date(goal.targetDate);
        const now = new Date();
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 7) {
          addNotification(`Savings goal '${goal.name}' is due in ${diffDays} day(s).`);
        }
      }
    });
  }, [debts, budgetCategories, savingsGoals]);

  return {
    // Data
    budgetCategories,
    savingsGoals,
    transactions,
    insights: activeInsights,
    monthlyTrends,
    debts,
    incomeFrequency,
    
    // Metrics
    totalBudget,
    totalSpent,
    totalSavingsTarget,
    totalSavingsCurrent,
    monthlyIncome,
    savingsRate,
    
    // Actions
    updateBudgetCategory,
    addBudgetCategory,
    deleteBudgetCategory,
    updateSavingsGoal,
    addSavingsGoal,
    deleteSavingsGoal,
    addMoneyToGoal,
    addTransaction,
    updateMonthlyIncome,
    setIncomeFrequency: setIncomeFrequencyAndSave,
    dismissInsight,
    addDebt,
    updateDebt,
    deleteDebt,
    addDebtPayment
  };
}