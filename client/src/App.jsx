import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import WorkoutsPage from './pages/WorkoutsPage.jsx';
import JournalPage from './pages/JournalPage.jsx';
import FinancePage from './pages/FinancePage.jsx';
import LegalTemplatesPage from './pages/LegalTemplatesPage.jsx';
import LegalFaqsPage from './pages/LegalFaqsPage.jsx';
import ClubsPage from './pages/ClubsPage.jsx';
import AiSupportPage from './pages/AiSupportPage.jsx';
import GoalsPage from './pages/GoalsPage.jsx';
import AuthPage from './pages/AuthPage.jsx';

function Layout({ children }) {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', padding: '1.5rem' }}>
      <header>
        <h1>Wellness Buddy</h1>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/workouts">Workouts</Link> |{' '}
          <Link to="/journal">Health Journal</Link> |{' '}
          <Link to="/finance">Finances</Link> |{' '}
          <Link to="/legal/templates">Legal Templates</Link> |{' '}
          <Link to="/legal/faqs">Legal FAQs</Link> |{' '}
          <Link to="/clubs">Clubs</Link> |{' '}
          <Link to="/ai">AI Support</Link> |{' '}
          <Link to="/goals">Goals</Link> |{' '}
          <Link to="/auth">Auth (OTP)</Link>
        </nav>
        <hr />
      </header>
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/legal/templates" element={<LegalTemplatesPage />} />
          <Route path="/legal/faqs" element={<LegalFaqsPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/ai" element={<AiSupportPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
