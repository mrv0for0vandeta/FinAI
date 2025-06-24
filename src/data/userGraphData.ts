// userGraphData.ts
// This module stores and manages user data for dashboard graphs (daily and monthly)

export interface DailyGraphData {
  date: string; // YYYY-MM-DD
  income: number;
  expenses: number;
  savings: number;
}

export interface MonthlyGraphData {
  month: string; // e.g., 'Jan 24'
  income: number;
  expenses: number;
  savings: number;
}

// In-memory store (replace with persistent storage as needed)
let dailyData: DailyGraphData[] = [];
let monthlyData: MonthlyGraphData[] = [];

export function setDailyGraphData(data: DailyGraphData[]) {
  dailyData = data;
}

export function getDailyGraphData(): DailyGraphData[] {
  return dailyData;
}

export function setMonthlyGraphData(data: MonthlyGraphData[]) {
  monthlyData = data;
}

export function getMonthlyGraphData(): MonthlyGraphData[] {
  return monthlyData;
}

// Example: initialize with empty or demo data
// setDailyGraphData([...]);
// setMonthlyGraphData([...]); 