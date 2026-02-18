import { useState, useEffect, useCallback } from "react";

interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "expense" | "income";
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "yearly";
  nextDate: string;
  active: boolean;
}

export function useRecurringExpenses(
  addExpense: (amount: number, category: string, description: string, type: "expense" | "income") => void
) {
  const [recurring, setRecurring] = useState<RecurringExpense[]>(() => {
    const saved = localStorage.getItem("recurring-expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("recurring-expenses", JSON.stringify(recurring));
  }, [recurring]);

  const addRecurring = useCallback((
    description: string,
    amount: number,
    category: string,
    type: "expense" | "income",
    frequency: RecurringExpense["frequency"]
  ) => {
    setRecurring(prev => [...prev, {
      id: crypto.randomUUID(),
      description,
      amount,
      category,
      type,
      frequency,
      nextDate: new Date().toISOString().split("T")[0],
      active: true,
    }]);
  }, []);

  const removeRecurring = useCallback((id: string) => {
    setRecurring(prev => prev.filter(r => r.id !== id));
  }, []);

  const toggleActive = useCallback((id: string) => {
    setRecurring(prev => prev.map(r =>
      r.id === id ? { ...r, active: !r.active } : r
    ));
  }, []);

  const processRecurring = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    
    setRecurring(prev => prev.map(r => {
      if (!r.active || r.nextDate > today) return r;
      
      addExpense(r.amount, r.category, r.description, r.type);
      
      const next = new Date(r.nextDate);
      switch (r.frequency) {
        case "daily": next.setDate(next.getDate() + 1); break;
        case "weekly": next.setDate(next.getDate() + 7); break;
        case "biweekly": next.setDate(next.getDate() + 14); break;
        case "monthly": next.setMonth(next.getMonth() + 1); break;
        case "yearly": next.setFullYear(next.getFullYear() + 1); break;
      }
      
      return { ...r, nextDate: next.toISOString().split("T")[0] };
    }));
  }, [addExpense]);

  return { recurring, addRecurring, removeRecurring, toggleActive, processRecurring };
}
