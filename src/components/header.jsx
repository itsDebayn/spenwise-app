import React from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

const Header = () => {
    return (
        <header className="main-header">
            <div className="logo-container">
                <span className="logo-text">Spend<span className="highlight">Wise</span></span>
            </div>
            <nav className="nav-links">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Dashboard</NavLink>
                <NavLink to="/expenses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Expenses</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>Profile</NavLink>
            </nav>
            <div className="user-profile">
                <div className="avatar">JD</div>
            </div>
        </header>
    );
};

export default Header;