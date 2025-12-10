import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import WorkoutsPage from './pages/WorkoutsPage.jsx';
import JournalPage from './pages/JournalPage.jsx';
import FinancePage from './pages/FinancePage.jsx';
import LegalTemplatesPage from './pages/LegalTemplatesPage.jsx';
import LegalFaqsPage from './pages/LegalFaqsPage.jsx';
import TemplateDetailPage from './pages/TemplateDetailPage.jsx';
import ClubsPage from './pages/ClubsPage.jsx';
import AiSupportPage from './pages/AiSupportPage.jsx';
import GoalsPage from './pages/GoalsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import VerifyOtpPage from './pages/VerifyOtpPage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function Layout({ children }) {
  const { user, logout, loading } = useAuth();

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', padding: '1.5rem' }}>
      <header>
        <h1>Wellness Buddy</h1>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/workouts">Workouts</Link> |{' '}
          <Link to="/journal">Health Journal</Link> |{' '}
          <Link to="/finance">Finances</Link> |{' '}
          <Link to="/legal/templates">Contract Templates</Link> |{' '}
          <Link to="/legal/faq">Legal FAQs</Link> |{' '}
          <Link to="/clubs">Clubs</Link> |{' '}
          <Link to="/ai">AI Support</Link> |{' '}
          <Link to="/goals">Goals</Link> |{' '}
          {!user && <Link to="/login">Login</Link>}
          {user && (
            <>
              {' '}
              | Logged in as {user.email}{' '}
              <button type="button" onClick={logout} disabled={loading}>
                Logout
              </button>
            </>
          )}
        </nav>
        <hr />
      </header>
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/legal/faq" element={<LegalFaqsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />

            {/* Authenticated-only routes */}
            <Route
              path="/workouts"
              element={(
                <ProtectedRoute>
                  <WorkoutsPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/journal"
              element={(
                <ProtectedRoute>
                  <JournalPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/finance"
              element={(
                <ProtectedRoute>
                  <FinancePage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/legal/templates"
              element={(
                <ProtectedRoute>
                  <LegalTemplatesPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/legal/templates/:id"
              element={(
                <ProtectedRoute>
                  <TemplateDetailPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/clubs"
              element={(
                <ProtectedRoute>
                  <ClubsPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/ai"
              element={(
                <ProtectedRoute>
                  <AiSupportPage />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/goals"
              element={(
                <ProtectedRoute>
                  <GoalsPage />
                </ProtectedRoute>
              )}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
