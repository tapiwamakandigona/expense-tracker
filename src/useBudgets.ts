import { useState, useEffect, useMemo } from "react";

interface Budget {
  id: string;
  category: string;
  limit: number;
  period: "monthly" | "weekly";
}

interface BudgetStatus {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  overBudget: boolean;
}

export function useBudgets(
  expenses: Array<{ amount: number; category: string; type: string; date: string }>
) {
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  const addBudget = (category: string, limit: number, period: "monthly" | "weekly" = "monthly") => {
    setBudgets(prev => [...prev, { id: crypto.randomUUID(), category, limit, period }]);
  };

  const removeBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const statuses = useMemo((): BudgetStatus[] => {
    const now = new Date();
    
    return budgets.map(budget => {
      const periodExpenses = expenses.filter(e => {
        if (e.type !== "expense") return false;
        if (e.category !== budget.category) return false;
        const d = new Date(e.date);
        if (budget.period === "monthly") {
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }
        // Weekly
        const weekAgo = new Date(now.getTime() - 7 * 86400000);
        return d >= weekAgo;
      });

      const spent = periodExpenses.reduce((s, e) => s + e.amount, 0);
      const remaining = Math.max(0, budget.limit - spent);
      const percentage = Math.min(100, (spent / budget.limit) * 100);

      return { budget, spent, remaining, percentage, overBudget: spent > budget.limit };
    });
  }, [budgets, expenses]);

  return { budgets, statuses, addBudget, removeBudget };
}
