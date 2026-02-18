import { useMemo } from "react";

interface MonthlyChartProps {
  data: Array<{ month: string; income: number; expense: number }>;
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const maxValue = useMemo(() => 
    Math.max(...data.flatMap(d => [d.income, d.expense]), 1)
  , [data]);

  if (data.length === 0) return null;

  const width = data.length * 80;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  return (
    <div className="chart-section">
      <h3>Monthly Overview</h3>
      <div style={{ overflowX: "auto" }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(pct => {
            const y = padding.top + chartHeight * (1 - pct);
            const val = Math.round(maxValue * pct);
            return (
              <g key={pct}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} 
                  stroke="var(--border)" strokeDasharray="4,4" />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" 
                  fill="var(--muted)" fontSize="10">${val}</text>
              </g>
            );
          })}
          
          {/* Bars */}
          {data.map((d, i) => {
            const x = padding.left + i * (chartWidth / data.length);
            const barWidth = chartWidth / data.length / 3;
            const incomeHeight = (d.income / maxValue) * chartHeight;
            const expenseHeight = (d.expense / maxValue) * chartHeight;
            
            return (
              <g key={d.month}>
                {/* Income bar */}
                <rect
                  x={x + barWidth * 0.5}
                  y={padding.top + chartHeight - incomeHeight}
                  width={barWidth}
                  height={incomeHeight}
                  fill="var(--green)"
                  rx="3"
                  opacity="0.8"
                >
                  <title>Income: ${d.income.toFixed(0)}</title>
                </rect>
                
                {/* Expense bar */}
                <rect
                  x={x + barWidth * 1.8}
                  y={padding.top + chartHeight - expenseHeight}
                  width={barWidth}
                  height={expenseHeight}
                  fill="var(--red)"
                  rx="3"
                  opacity="0.8"
                >
                  <title>Expenses: ${d.expense.toFixed(0)}</title>
                </rect>
                
                {/* Month label */}
                <text
                  x={x + barWidth * 1.5}
                  y={height - 8}
                  textAnchor="middle"
                  fill="var(--muted)"
                  fontSize="11"
                >
                  {d.month.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "8px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--muted)" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--green)", display: "inline-block" }} />
          Income
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--muted)" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--red)", display: "inline-block" }} />
          Expenses
        </span>
      </div>
    </div>
  );
}
