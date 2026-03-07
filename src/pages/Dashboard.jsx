import React, { useState, useMemo } from 'react';
import './Dashboard.css';
import { useExpense } from '../context/ExpenseContext';
import AddExpenseModal from '../components/AddExpenseModal';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const Dashboard = () => {
    const { totalSpent, monthlyBudget, getCategoryTotals, expenses } = useExpense();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categoryTotals = getCategoryTotals();
    const recentExpenses = expenses.slice(0, 3);
    const spendingPercentage = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));
    const predictedTotal = totalSpent * 1.5;

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(1, daysInMonth - today.getDate());
    const remainingBudget = Math.max(0, monthlyBudget - totalSpent);
    const dailyLimit = remainingBudget / daysRemaining;

    // Build trajectory data from real expenses
    const trajectoryData = useMemo(() => {
        const dayLabels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);
        const dailySpending = new Array(daysInMonth).fill(0);

        expenses.forEach(exp => {
            const parts = exp.date.split('/');
            const day = parseInt(parts[1], 10);
            if (day >= 1 && day <= daysInMonth) {
                dailySpending[day - 1] += exp.amount;
            }
        });

        // Cumulative actual spending
        const cumulative = [];
        let runningTotal = 0;
        const currentDay = today.getDate();
        for (let i = 0; i < daysInMonth; i++) {
            runningTotal += dailySpending[i];
            cumulative.push(i < currentDay ? runningTotal : null);
        }

        // Predicted line (linear projection from current total to end of month)
        const predicted = dayLabels.map((_, i) => ((i + 1) / daysInMonth) * predictedTotal);

        // Budget line
        const budgetLine = dayLabels.map(() => monthlyBudget);

        return {
            labels: dayLabels,
            datasets: [
                {
                    label: 'Actual Spending',
                    data: cumulative,
                    borderColor: '#06d6a0',
                    backgroundColor: 'rgba(6, 214, 160, 0.1)',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#06d6a0',
                    tension: 0.4,
                    fill: true,
                    spanGaps: false,
                },
                {
                    label: 'Predicted',
                    data: predicted,
                    borderColor: 'rgba(113, 113, 122, 0.5)',
                    borderWidth: 1.5,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    tension: 0.1,
                    fill: false,
                },
                {
                    label: 'Budget Limit',
                    data: budgetLine,
                    borderColor: '#ef4444',
                    borderWidth: 1.5,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    fill: false,
                }
            ]
        };
    }, [expenses, daysInMonth, predictedTotal, monthlyBudget, today]);

    const trajectoryOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: { color: '#a1a1aa', font: { size: 11 }, usePointStyle: true, padding: 16 }
            },
            tooltip: {
                backgroundColor: '#18181b',
                titleColor: '#fafafa',
                bodyColor: '#a1a1aa',
                borderColor: '#27272a',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y?.toFixed(2) ?? 'N/A'}`
                }
            }
        },
        scales: {
            x: { ticks: { color: '#71717a', maxTicksLimit: 8, font: { size: 10 } }, grid: { color: '#1f1f23' } },
            y: { ticks: { color: '#71717a', callback: (v) => `$${v}`, font: { size: 10 } }, grid: { color: '#1f1f23' } }
        }
    };

    // Category bar chart data
    const categoryChartData = useMemo(() => {
        const cats = categoryTotals.slice(0, 6);
        const colors = ['#06d6a0', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];
        return {
            labels: cats.map(c => c.label),
            datasets: [{
                label: 'Spending',
                data: cats.map(c => c.amount),
                backgroundColor: colors.slice(0, cats.length),
                borderRadius: 6,
                barThickness: 24,
            }]
        };
    }, [categoryTotals]);

    const categoryChartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#18181b',
                titleColor: '#fafafa',
                bodyColor: '#a1a1aa',
                borderColor: '#27272a',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: (ctx) => `$${ctx.parsed.x.toFixed(2)}`
                }
            }
        },
        scales: {
            x: { ticks: { color: '#71717a', callback: (v) => `$${v}`, font: { size: 10 } }, grid: { color: '#1f1f23' } },
            y: { ticks: { color: '#a1a1aa', font: { size: 11 } }, grid: { display: false } }
        }
    };

    return (
        <div className="dashboard-container">
            <header className="page-header">
                <div className="header-left">
                    <h1>Budget Dashboard</h1>
                    <p>Track your spending and AI predictions</p>
                </div>
                <button className="add-expense-btn" onClick={() => setIsModalOpen(true)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    Add Expense
                </button>
            </header>

            <div className="dashboard-grid">
                {/* Gauge Section */}
                <div className="card gauge-card">
                    <div className="gauge-container">
                        <svg viewBox="0 0 100 100" className="gauge">
                            <circle className="gauge-bg" cx="50" cy="50" r="45" />
                            <circle className="gauge-value" cx="50" cy="50" r="45" style={{ strokeDashoffset: `calc(283 - (283 * ${spendingPercentage}) / 100)` }} />
                            <text x="50" y="45" className="gauge-percent">{spendingPercentage}%</text>
                            <text x="50" y="60" className="gauge-label">of budget</text>
                        </svg>
                    </div>
                    <div className="gauge-info">
                        <p className="info-label">Predicted vs Budget</p>
                        <span className={`badge ${spendingPercentage > 90 ? 'danger' : spendingPercentage > 75 ? 'warning' : 'success'}`}>
                            {spendingPercentage > 90 ? 'High Risk' : spendingPercentage > 75 ? 'Caution' : 'On Track'}
                        </span>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="summary-stats">
                    <div className="card stat-card">
                        <div className="stat-content">
                            <p className="stat-label">Monthly Budget</p>
                            <h2 className="stat-value">${monthlyBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                        </div>
                        <div className="stat-icon budget-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                        </div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-content">
                            <p className="stat-label">Current Spending</p>
                            <h2 className="stat-value">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                        </div>
                        <div className="stat-icon spending-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-content">
                            <p className="stat-label">Predicted Total</p>
                            <h2 className="stat-value">${predictedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                            <p className="stat-subtext">98% confidence</p>
                        </div>
                        <div className="stat-icon prediction-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 20-4-4h-3l2-2h3l2-2h-3l2-2h-3l2-2" /></svg>
                        </div>
                    </div>

                    <div className="card stat-card">
                        <div className="stat-content">
                            <p className="stat-label">Daily Limit</p>
                            <h2 className="stat-value">${dailyLimit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                            <p className="stat-subtext">{daysRemaining} days remaining</p>
                        </div>
                        <div className="stat-icon daily-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        </div>
                    </div>
                </div>

                {/* Interactive Charts */}
                <div className="card chart-card trajectory-chart">
                    <h3>Spending Trajectory</h3>
                    <p className="chart-subtitle">Actual vs predicted spending this month</p>
                    <div className="chartjs-container">
                        <Line data={trajectoryData} options={trajectoryOptions} />
                    </div>
                </div>

                <div className="card chart-card category-chart">
                    <h3>Top Spending Categories</h3>
                    <p className="chart-subtitle">Highest spending areas this month</p>
                    <div className="chartjs-container">
                        <Bar data={categoryChartData} options={categoryChartOptions} />
                    </div>
                </div>

                {/* Recent Expenses */}
                <div className="card full-width">
                    <h3>Recent Expenses</h3>
                    <div className="table-container">
                        <table className="recent-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentExpenses.map((exp) => (
                                    <tr key={exp.id}>
                                        <td>{exp.date}</td>
                                        <td>{exp.description}</td>
                                        <td><span className="category-pill">{exp.category}</span></td>
                                        <td className="amount">${exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AddExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
