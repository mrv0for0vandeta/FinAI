export interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  budget: number;
  color: string;
  trend: 'up' | 'down';
}

export interface SavingsGoal {
  id: string;
  name: string;
  description: string;
  current: number;
  target: number;
  targetDate: string;
  category: string;
  monthlyContribution: number;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  isRecurring?: boolean;
  recurrence?: 'daily' | 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  recurrenceIntervalDays?: number; // for custom recurrence
  recurrenceEndDate?: string; // ISO date string
  nextRecurrenceDate?: string; // ISO date string
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  type: 'info' | 'warning' | 'success';
  category: string;
  actionable: boolean;
  dismissed?: boolean;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

// Generic Debt interface for all types of debts (loans, credit cards, mortgages, etc.)
export interface Debt {
  id: string;
  amount: number;
  creditor: string; // lender, bank, card issuer, etc.
  type: 'Personal Loan' | 'Credit Card' | 'Mortgage' | 'Student Loan' | 'Medical' | 'Other';
  description?: string;
  startDate: string;
  dueDate: string;
  payments: DebtPayment[];
  frequency: 'monthly' | 'semi-monthly' | 'bi-weekly' | 'weekly' | 'daily' | 'quarterly' | 'yearly' | 'custom';
  interestRate?: number;
  remaining: number;
}

export interface DebtPayment {
  id: string;
  amount: number;
  date: string;
}