/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ActiveMatchRoom from './pages/ActiveMatchRoom';
import Support from './pages/Support';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/inicio" element={<Home />} />
            
            {/* Root redirects */}
            <Route path="/" element={<Navigate to="/inicio" replace />} />

            {/* Auth Routes — only for unauthenticated users */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            
            {/* Legal — accessible to everyone */}
            <Route path="/terminos" element={<Terms />} />
            <Route path="/privacidad" element={<Privacy />} />

            {/* Protected Routes — require authentication */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            <Route path="/match/:id" element={<ProtectedRoute><ActiveMatchRoom /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
