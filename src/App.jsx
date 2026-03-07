// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Predictions from './pages/Predictions';
import Feedback from './pages/Feedback';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ExpenseProvider>
          <div className="App">
            <Routes>
              {/* Public routes - no sidebar, no login required */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes - with sidebar, login required */}
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="app-shell">
                    <Sidebar />
                    <main className="main-content">
                      <Dashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="app-shell">
                    <Sidebar />
                    <main className="main-content">
                      <Dashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/expenses" element={
                <ProtectedRoute>
                  <div className="app-shell">
                    <Sidebar />
                    <main className="main-content">
                      <Expenses />
                    </main>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/predictions" element={
                <ProtectedRoute>
                  <div className="app-shell">
                    <Sidebar />
                    <main className="main-content">
                      <Predictions />
                    </main>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/feedback" element={
                <ProtectedRoute>
                  <div className="app-shell">
                    <Sidebar />
                    <main className="main-content">
                      <Feedback />
                    </main>
                  </div>
                </ProtectedRoute>
              } />

              {/* Catch all - redirect to login */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </ExpenseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;