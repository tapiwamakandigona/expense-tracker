<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=Expense%20Tracker&fontSize=50&animation=fadeIn&fontAlignY=38&desc=Sleek%2C%20Local-First%20Finance%20Manager&descAlignY=51&descAlign=62" />
</div>

<h1 align="center">Expense Tracker (React + TypeScript)</h1>

<div align="center">
  <p><strong>A modern, privacy-focused expense tracker with interactive charts, budget categories, and seamless CSV export. Built exclusively with React and TypeScript.</strong></p>
  
  <p>
    <a href="https://tapiwamakandigona.github.io/expense-tracker/"><img src="https://img.shields.io/badge/Live_Demo-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" /></a>
    <img src="https://img.shields.io/github/languages/top/tapiwamakandigona/expense-tracker?style=for-the-badge&color=blue" alt="Top Language" />
    <img src="https://img.shields.io/github/last-commit/tapiwamakandigona/expense-tracker?style=for-the-badge&color=green" alt="Last Commit" />
  </p>
</div>

---

## ⚡ What Makes It Special?

Unlike typical budgeting apps that require you to create an account and hand over banking credentials, this app is **100% Local-First**. Your financial data is securely stored in your browser's local storage and never leaves your device unless you explicitly export it.

Recently upgraded with a **sleek, glassmorphic UI design**, complete with vibrant gradients, fluid micro-animations, and a true dark mode aesthetic.

## 📊 Features

| Feature | Description |
|---------|-------------|
| **Interactive Analytics** | Visual breakdowns of spending via dynamic progress bars and charts |
| **Local-First Privacy** | Zero backend dependencies; `localStorage` persistence |
| **Category Management** | Auto-calculated category rollups for instant budget insights |
| **One-Click Export** | Export your raw transaction history to CSV format anytime |
| **Smart Filtering** | Filter transactions by date range (This Week, This Month, All Time) |
| **Sleek UI** | Glassmorphic cards, gradient text, and fluid micro-transitions |

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Custom Vanilla CSS (Zero Bloat Frameworks)
- **State:** React Hooks + LocalStorage API
- **Build/Dev:** Vite 5
- **CI/CD:** GitHub Actions → GitHub Pages

---

## 🚀 Quick Start

```bash
git clone https://github.com/tapiwamakandigona/expense-tracker.git
cd expense-tracker
npm install
npm run dev
```

The app will be available at `http://localhost:5173/expense-tracker/`.

### To build for production:

```bash
npm run build
```

Output is written to the `dist/` directory.

---

## 📂 Project Structure

```
expense-tracker/
├── src/
│   ├── App.tsx              # Main application component
│   ├── App.css              # Core styles (dark theme)
│   ├── main.tsx             # React entry point
│   ├── MonthlyChart.tsx     # SVG bar-chart component
│   ├── useBudgets.ts        # Budget tracking hook
│   ├── useRecurringExpenses.ts  # Recurring expense hook
│   ├── useSavingsGoals.ts   # Savings goals hook
│   ├── useStats.ts          # Analytics/statistics hook
│   ├── useTheme.ts          # Dark/light theme toggle hook
│   ├── animations.css       # Micro-animation keyframes
│   └── lightTheme.css       # Light theme overrides
├── index.html               # HTML shell
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

<div align="center">
  <b>Built by <a href="https://github.com/tapiwamakandigona">Tapiwa Makandigona</a></b>
  <br/>
  <i>⭐ Star this repo if you care about Local-First applications!</i>
</div>
