import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
    const [reviews, setReviews] = useState([
        { id: 1, merchant: 'Gas Station', amount: 12.16, date: '2/2/2026', assigned: 'Transport' },
        { id: 2, merchant: 'Doctor Visit', amount: 72.15, date: '2/3/2026', assigned: 'Health' },
        { id: 3, merchant: 'Doctor Visit', amount: 22.88, date: '2/5/2026', assigned: 'Health' },
        { id: 4, merchant: 'Fast Food', amount: 38.84, date: '2/7/2026', assigned: 'Food & Dining' },
        { id: 5, merchant: 'Bakery', amount: 74.91, date: '2/12/2026', assigned: 'Food & Dining' },
        { id: 6, merchant: 'Bus Pass', amount: 51.01, date: '2/15/2026', assigned: 'Transport' },
        { id: 7, merchant: 'Electric Bill', amount: 76.12, date: '2/15/2026', assigned: 'Utilities' },
    ]);

    const [confirmedCount, setConfirmedCount] = useState(32);
    const [recategorizeId, setRecategorizeId] = useState(null);
    const [newCategory, setNewCategory] = useState('');

    const categories = ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Health', 'Utilities'];

    const handleConfirm = (id) => {
        setReviews(prev => prev.filter(r => r.id !== id));
        setConfirmedCount(prev => prev + 1);
    };

    const handleRecategorize = (id) => {
        setRecategorizeId(recategorizeId === id ? null : id);
        setNewCategory('');
    };

    const handleSaveCategory = (id) => {
        if (newCategory) {
            setReviews(prev => prev.map(r => r.id === id ? { ...r, assigned: newCategory } : r));
            setRecategorizeId(null);
            setNewCategory('');
        }
    };

    const pendingCount = reviews.length;
    const totalReviewed = confirmedCount + pendingCount;
    const accuracy = totalReviewed > 0 ? Math.round((confirmedCount / totalReviewed) * 100) : 0;

    return (
        <div className="feedback-container">
            <header className="page-header">
                <div className="header-left">
                    <h1>ML Feedback</h1>
                    <p>Help improve predictions by confirming or correcting categories</p>
                </div>
            </header>

            <div className="feedback-stats">
                <div className="card stat-card">
                    <div className="stat-info">
                        <p className="stat-label">Pending Review</p>
                        <h2 className="stat-value">{pendingCount}</h2>
                    </div>
                    <div className="stat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-info">
                        <p className="stat-label">Confirmed</p>
                        <h2 className="stat-value">{confirmedCount}</h2>
                    </div>
                    <div className="stat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-info">
                        <p className="stat-label">ML Accuracy</p>
                        <h2 className="stat-value">{accuracy}%</h2>
                    </div>
                    <div className="stat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                    </div>
                </div>
            </div>

            <div className="card list-card">
                <div className="list-header">
                    <h3>Pending Category Reviews</h3>
                    <p className="subtitle">The ML model assigned these categories. Confirm if correct or select the right one.</p>
                </div>

                <div className="review-list">
                    {reviews.length === 0 && (
                        <div className="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            <p>All items reviewed! No pending reviews.</p>
                        </div>
                    )}
                    {reviews.map((rev) => (
                        <div key={rev.id} className="review-item">
                            <div className="review-info">
                                <span className="merchant">{rev.merchant}</span>
                                <span className="amount">${rev.amount.toFixed(2)}</span>
                                <div className="meta">
                                    {rev.date} • ML assigned: <span className="assigned">{rev.assigned}</span>
                                </div>
                            </div>
                            <div className="review-actions">
                                <button className="correct-btn" onClick={() => handleConfirm(rev.id)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                    Correct
                                </button>
                                <button className="recategorize-btn" onClick={() => handleRecategorize(rev.id)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                                    Recategorize
                                </button>
                            </div>
                            {recategorizeId === rev.id && (
                                <div className="recategorize-form">
                                    <select
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        className="category-select"
                                    >
                                        <option value="">Select category...</option>
                                        {categories.filter(c => c !== rev.assigned).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <button
                                        className="save-btn"
                                        onClick={() => handleSaveCategory(rev.id)}
                                        disabled={!newCategory}
                                    >
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
