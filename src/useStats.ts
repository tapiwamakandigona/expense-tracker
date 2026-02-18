import { useMemo } from "react";

interface Expense {
  amount: number;
  category: string;
  type: "expense" | "income";
  date: string;
}

interface Stats {
  avgDailyExpense: number;
  avgDailyIncome: number;
  topCategory: string;
  topCategoryAmount: number;
  daysTracked: number;
  savingsRate: number;
  monthlyTrend: Array<{ month: string; income: number; expense: number }>;
}

export function useStats(expenses: Expense[]): Stats {
  return useMemo(() => {
    if (expenses.length === 0) {
      return {
        avgDailyExpense: 0, avgDailyIncome: 0, topCategory: "-",
        topCategoryAmount: 0, daysTracked: 0, savingsRate: 0, monthlyTrend: [],
      };
    }

    const dates = new Set(expenses.map(e => e.date));
    const days = dates.size || 1;
    
    const totalExpense = expenses.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
    const totalIncome = expenses.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
    
    // Top category
    const catTotals: Record<string, number> = {};
    expenses.filter(e => e.type === "expense").forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
    });
    const topEntry = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
    
    // Monthly trend
    const monthly: Record<string, { income: number; expense: number }> = {};
    expenses.forEach(e => {
      const month = e.date.substring(0, 7);
      if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };
      monthly[month][e.type] += e.amount;
    });
    
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    
    return {
      avgDailyExpense: totalExpense / days,
      avgDailyIncome: totalIncome / days,
      topCategory: topEntry ? topEntry[0] : "-",
      topCategoryAmount: topEntry ? topEntry[1] : 0,
      daysTracked: days,
      savingsRate: Math.round(savingsRate),
      monthlyTrend: Object.entries(monthly)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, data]) => ({ month, ...data })),
    };
  }, [expenses]);
}
