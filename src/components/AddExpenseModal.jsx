import React, { useState } from 'react';
import './AddExpenseModal.css';
import { useExpense } from '../context/ExpenseContext';

const AddExpenseModal = ({ isOpen, onClose }) => {
    const { addExpense } = useExpense();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Food & Dining',
        date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const amount = parseFloat(formData.amount);
        if (formData.description && amount > 0) {
            addExpense({
                ...formData,
                amount
            });
            onClose();
            // Reset form
            setFormData({
                description: '',
                amount: '',
                category: 'Food & Dining',
                date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Expense</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="e.g. Morning Coffee"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount ($)</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option>Food & Dining</option>
                            <option>Shopping</option>
                            <option>Transport</option>
                            <option>Entertainment</option>
                            <option>Health</option>
                            <option>Utilities</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="text"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            placeholder="MM/DD/YYYY"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Expense</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
