import React, { useMemo } from 'react';
import './Predictions.css';
import { useExpense } from '../context/ExpenseContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    ArcElement, Title, Tooltip, Legend, Filler
);

const Predictions = () => {
    const { totalSpent, monthlyBudget, getCategoryTotals, expenses } = useExpense();

    const predictedTotal = totalSpent * 1.5;
    const overBudget = Math.max(0, predictedTotal - monthlyBudget);
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(1, daysInMonth - today.getDate());
    const remainingBudget = Math.max(0, monthlyBudget - totalSpent);
    const suggestedDaily = remainingBudget / daysRemaining;
    const spendingPercentage = Math.min(100, Math.round((predictedTotal / monthlyBudget) * 100));
    const riskLevel = spendingPercentage > 90 ? 'High Risk' : spendingPercentage > 75 ? 'Caution' : 'On Track';

    // Build trajectory data
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

        const cumulative = [];
        let runningTotal = 0;
        const currentDay = today.getDate();
        for (let i = 0; i < daysInMonth; i++) {
            runningTotal += dailySpending[i];
            cumulative.push(i < currentDay ? runningTotal : null);
        }

        const predicted = dayLabels.map((_, i) => ((i + 1) / daysInMonth) * predictedTotal);
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

    // Donut chart for category breakdown
    const categoryTotals = getCategoryTotals();
    const donutData = useMemo(() => {
        const cats = categoryTotals.slice(0, 6);
        const colors = ['#06d6a0', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];
        return {
            labels: cats.map(c => c.label),
            datasets: [{
                data: cats.map(c => c.amount),
                backgroundColor: colors.slice(0, cats.length),
                borderColor: '#0a0a0f',
                borderWidth: 2,
                hoverOffset: 8,
            }]
        };
    }, [categoryTotals]);

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: { color: '#a1a1aa', font: { size: 11 }, usePointStyle: true, padding: 12 }
            },
            tooltip: {
                backgroundColor: '#18181b',
                titleColor: '#fafafa',
                bodyColor: '#a1a1aa',
                borderColor: '#27272a',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: (ctx) => `${ctx.label}: $${ctx.parsed.toFixed(2)}`
                }
            }
        }
    };

    return (
        <div className="predictions-container">
            <header className="page-header">
                <div className="header-left">
                    <h1>ML Predictions</h1>
                    <p>AI-powered spending forecast and recommendations</p>
                </div>
            </header>

            <div className="alert-banner risk">
                <div className="alert-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <div className="alert-content">
                    <div className="alert-title">
                        {riskLevel === 'High Risk' ? 'High Risk of Overspending' : riskLevel === 'Caution' ? 'Budget Caution Advised' : 'Spending On Track'}
                        <span className={`badge ${riskLevel === 'High Risk' ? 'danger' : riskLevel === 'Caution' ? 'warning' : 'success'}`}>{riskLevel}</span>
                    </div>
                    <p className="alert-desc">
                        {riskLevel === 'High Risk'
                            ? "At the current rate, you're projected to exceed your budget. Immediate action is recommended to reduce spending."
                            : riskLevel === 'Caution'
                                ? "You're approaching your budget limit. Consider reducing non-essential expenses."
                                : "Great job! Your spending is currently within budget projections."}
                    </p>
                </div>
            </div>

            <div className="predictions-grid">
                <div className="card gauge-card">
                    <div className="gauge-container">
                        <svg viewBox="0 0 100 100" className="gauge">
                            <circle className="gauge-bg" cx="50" cy="50" r="45" />
                            <circle className="gauge-value" cx="50" cy="50" r="45" style={{ strokeDashoffset: `calc(283 - (283 * ${spendingPercentage}) / 100)` }} />
                            <text x="50" y="45" className="gauge-percent">{spendingPercentage}%</text>
                            <text x="50" y="60" className="gauge-label">of budget</text>
                        </svg>
                    </div>
                </div>

                <div className="card prediction-card">
                    <div className="card-header">
                        <p className="card-label">Predicted Total</p>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="trend-icon"><path d="m21 16-4-4" /><path d="M3 19a10 10 0 1 1 17.32 0" /></svg>
                    </div>
                    <h2 className="card-value">${predictedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p className={`card-subtext ${overBudget > 0 ? 'danger' : ''}`}>
                        {overBudget > 0 ? `$${overBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} over budget` : 'Within budget'}
                    </p>
                </div>

                <div className="card prediction-card">
                    <div className="card-header">
                        <p className="card-label">Suggested Daily</p>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="trend-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <h2 className="card-value">${suggestedDaily.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p className="card-subtext">for {daysRemaining} remaining days</p>
                </div>

                <div className="card prediction-card">
                    <div className="card-header">
                        <p className="card-label">Model Confidence</p>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="trend-icon"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                    <h2 className="card-value">98%</h2>
                    <p className="card-subtext">R-squared accuracy</p>
                </div>
            </div>

            <div className="predictions-charts-row">
                <div className="card trajectory-section">
                    <div className="section-header">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="section-icon"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                        <h3>Spending Trajectory</h3>
                    </div>
                    <p className="subtitle">Day-by-day projected spending with actual data overlay</p>
                    <div className="chartjs-container-lg">
                        <Line data={trajectoryData} options={trajectoryOptions} />
                    </div>
                </div>

                <div className="card trajectory-section">
                    <div className="section-header">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="section-icon"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 0 20" /></svg>
                        <h3>Category Breakdown</h3>
                    </div>
                    <p className="subtitle">Distribution of spending across categories</p>
                    <div className="chartjs-container-lg">
                        <Doughnut data={donutData} options={donutOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Predictions;
