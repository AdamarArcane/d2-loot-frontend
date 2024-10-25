import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import Dashboard from './components/dashboard';
import { ThemeProvider } from "@/components/theme-provider"
import DashboardLayout from './components/dashboard-layout';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;