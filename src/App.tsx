import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import OrderManagement from './pages/OrderManagement';
import StyleMaster from './pages/StyleMaster';
import BOMManagement from './pages/BOMManagement';
import BudgetManagement from './pages/BudgetManagement';
import PurchaseManagement from './pages/PurchaseManagement';
import InventoryManagement from './pages/InventoryManagement';
import ProductionTracking from './pages/ProductionTracking';
import Reports from './pages/Reports';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/styles" element={<StyleMaster />} />
            <Route path="/bom" element={<BOMManagement />} />
            <Route path="/budget" element={<BudgetManagement />} />
            <Route path="/purchase" element={<PurchaseManagement />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/production" element={<ProductionTracking />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
