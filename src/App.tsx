import { useState, useMemo } from 'react';
import './App.css';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

const CATEGORIES = {
  expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
};

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'all'>('month');

  const save = (data: Expense[]) => {
    setExpenses(data);
    localStorage.setItem('expenses', JSON.stringify(data));
  };

  const addExpense = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    save([...expenses, {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      category,
      description: description || category,
      date: new Date().toISOString().split('T')[0],
      type,
    }]);
    setAmount('');
    setDescription('');
    setShowForm(false);
  };

  const deleteExpense = (id: string) => save(expenses.filter(e => e.id !== id));

  const filtered = useMemo(() => {
    const now = new Date();
    return expenses.filter(e => {
      const d = new Date(e.date);
      if (dateFilter === 'week') return now.getTime() - d.getTime() < 7 * 86400000;
      if (dateFilter === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (dateFilter === 'year') return d.getFullYear() === now.getFullYear();
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, dateFilter]);

  const totalExpenses = filtered.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const totalIncome = filtered.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(e => e.type === 'expense').forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const exportCsv = () => {
    const rows = ['Date,Type,Category,Description,Amount'];
    filtered.forEach(e => rows.push(`${e.date},${e.type},${e.category},"${e.description}",${e.amount}`));
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'expenses.csv'; a.click();
  };

  return (
    <div className="app">
      <header>
        <h1>Expenses</h1>
        <button className="export-btn" onClick={exportCsv}>Export CSV</button>
      </header>

      <div className="summary-cards">
        <div className="card income-card">
          <span className="card-label">Income</span>
          <span className="card-value">+${totalIncome.toFixed(2)}</span>
        </div>
        <div className="card expense-card">
          <span className="card-label">Expenses</span>
          <span className="card-value">-${totalExpenses.toFixed(2)}</span>
        </div>
        <div className={`card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
          <span className="card-label">Balance</span>
          <span className="card-value">${balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="date-filters">
        {(['week', 'month', 'year', 'all'] as const).map(f => (
          <button key={f} className={dateFilter === f ? 'active' : ''} onClick={() => setDateFilter(f)}>
            {f === 'week' ? '7d' : f === 'month' ? '30d' : f === 'year' ? 'Year' : 'All'}
          </button>
        ))}
      </div>

      {byCategory.length > 0 && (
        <div className="category-breakdown">
          <h3>By Category</h3>
          {byCategory.map(([cat, total]) => (
            <div key={cat} className="cat-row">
              <span>{cat}</span>
              <div className="cat-bar-track">
                <div className="cat-bar" style={{ width: `${(total / totalExpenses) * 100}%` }} />
              </div>
              <span className="cat-amount">${total.toFixed(0)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="transactions">
        <div className="transactions-header">
          <h3>Transactions ({filtered.length})</h3>
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {showForm && (
          <div className="add-form">
            <div className="type-toggle">
              <button className={type === 'expense' ? 'active expense' : ''} onClick={() => { setType('expense'); setCategory('Food'); }}>Expense</button>
              <button className={type === 'income' ? 'active income' : ''} onClick={() => { setType('income'); setCategory('Salary'); }}>Income</button>
            </div>
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES[type].map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="text" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
            <button className="save-btn" onClick={addExpense}>Save</button>
          </div>
        )}

        {filtered.map(e => (
          <div key={e.id} className={`transaction ${e.type}`}>
            <div className="tx-info">
              <span className="tx-desc">{e.description}</span>
              <span className="tx-meta">{e.category} &middot; {e.date}</span>
            </div>
            <span className={`tx-amount ${e.type}`}>
              {e.type === 'income' ? '+' : '-'}${e.amount.toFixed(2)}
            </span>
            <button className="tx-delete" onClick={() => deleteExpense(e.id)}>\u00d7</button>
          </div>
        ))}
      </div>
    </div>
  );
}
