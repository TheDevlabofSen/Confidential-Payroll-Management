import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PayrollProvider } from './context/PayrollContext';
import { MainLayout } from './layouts/MainLayout';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PayrollPage } from './pages/PayrollPage';
import { VerifyPage } from './pages/VerifyPage';
import { CredentialsPage } from './pages/CredentialsPage';
import { HistoryPage } from './pages/HistoryPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  return (
    <PayrollProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="payroll" element={<PayrollPage />} />
            <Route path="verify" element={<VerifyPage />} />
            <Route path="credentials" element={<CredentialsPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PayrollProvider>
  );
}

export default App;
