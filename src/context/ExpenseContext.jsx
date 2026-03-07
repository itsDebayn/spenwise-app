import React, { createContext, useState, useContext } from 'react';

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([
        { id: 1, date: '2/28/2026', description: 'Grocery Store', category: 'Food & Dining', amount: 26.13 },
        { id: 2, date: '2/19/2026', description: 'Dinner Out', category: 'Food & Dining', amount: 13.62 },
        { id: 3, date: '2/19/2026', description: 'Clothing Store', category: 'Shopping', amount: 83.45 },
        { id: 4, date: '2/18/2026', description: 'Bus Pass', category: 'Transport', amount: 51.67 },
        { id: 5, date: '2/18/2026', description: 'Books', category: 'Entertainment', amount: 31.83 },
        { id: 6, date: '2/16/2026', description: 'Streaming Service', category: 'Entertainment', amount: 39.80 },
        { id: 7, date: '2/15/2026', description: 'Electric Bill', category: 'Utilities', amount: 76.12 },
    ]);

    const addExpense = (expense) => {
        setExpenses((prev) => [
            { id: Date.now(), ...expense },
            ...prev,
        ]);
    };

    const deleteExpense = (id) => {
        setExpenses((prev) => prev.filter(exp => exp.id !== id));
    };

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const monthlyBudget = 3000;

    // Derived stats for charts
    const getCategoryTotals = () => {
        const totals = {};
        expenses.forEach(exp => {
            if (!totals[exp.category]) totals[exp.category] = 0;
            totals[exp.category] += exp.amount;
        });
        return Object.entries(totals)
            .map(([label, amount]) => ({ label, amount, max: 800 }))
            .sort((a, b) => b.amount - a.amount);
    };

    return (
        <ExpenseContext.Provider value={{
            expenses,
            addExpense,
            deleteExpense,
            totalSpent,
            monthlyBudget,
            getCategoryTotals
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
