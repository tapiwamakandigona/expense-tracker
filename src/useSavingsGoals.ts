import { useState, useEffect, useMemo } from "react";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
  createdAt: number;
}

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem("savings-goals");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("savings-goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = (name: string, targetAmount: number, icon: string = "\u{1F3AF}", deadline?: string) => {
    setGoals(prev => [...prev, {
      id: crypto.randomUUID(),
      name,
      targetAmount,
      currentAmount: 0,
      deadline,
      icon,
      createdAt: Date.now(),
    }]);
  };

  const addToGoal = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(g =>
      g.id === goalId
        ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) }
        : g
    ));
  };

  const removeGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const stats = useMemo(() => {
    const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
    const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
    const completedCount = goals.filter(g => g.currentAmount >= g.targetAmount).length;
    
    return {
      totalTarget,
      totalSaved,
      overallPercentage: totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0,
      completedCount,
      activeCount: goals.length - completedCount,
    };
  }, [goals]);

  return { goals, stats, addGoal, addToGoal, removeGoal };
}
