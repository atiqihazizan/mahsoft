import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout, PageLayout } from '../layouts'
import SettingsLayout from '../layouts/SettingsLayout.jsx'
import Login from '../pages/Login.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Settings from '../pages/Settings.jsx'
import CompaniesSettings from '../pages/settings/CompaniesSettings.jsx'
import CustomersSettings from '../pages/settings/CustomersSettings.jsx'
import SuppliersSettings from '../pages/settings/SuppliersSettings.jsx'
import UsersSettings from '../pages/settings/UsersSettings.jsx'
import Invoice from '../pages/Invoice.jsx'
import Quote from '../pages/Quote.jsx'
import Receipt from '../pages/Receipt.jsx'
import InvoiceForm from '../pages/InvoiceForm.jsx'
import QuoteForm from '../pages/QuoteForm.jsx'
import ReceiptForm from '../pages/ReceiptForm.jsx'
// import InvoicePrintPreview from '../pages/InvoicePrintPreview.jsx'
// import QuotePrintPreview from '../pages/QuotePrintPreview.jsx'
// import ReceiptPrintPreview from '../pages/ReceiptPrintPreview.jsx'
import ErrorPage from '../pages/ErrorPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const router = createBrowserRouter([
  { 
    path: '/login', 
    element: <Login />,
    errorElement: <ErrorPage />
  },
  { 
    path: '/', 
    element: <Navigate to="/dashboard" replace />,
    errorElement: <ErrorPage />
  },
  // Dashboard dengan MainLayout
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { path: '/dashboard', element: <Dashboard /> }
    ],
  },
  // Settings dengan SettingsLayout
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <CompaniesSettings /> },
      { path: 'companies', element: <CompaniesSettings /> },
      { path: 'customers', element: <CustomersSettings /> },
      { path: 'suppliers', element: <SuppliersSettings /> },
      { path: 'users', element: <UsersSettings /> }
    ],
  },
  // Semua modul dengan PageLayout
  {
    element: (
      <ProtectedRoute>
        <PageLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // Invoice routes
      { path: '/invoices', element: <Invoice /> },
      { path: '/invoices/new', element: <InvoiceForm /> },
      { path: '/invoices/:id/edit', element: <InvoiceForm /> },
      // Quote routes
      { path: '/quotes', element: <Quote /> },
      { path: '/quotes/new', element: <QuoteForm /> },
      { path: '/quotes/:id/edit', element: <QuoteForm /> },
      // Receipt routes
      { path: '/receipts', element: <Receipt /> },
      { path: '/receipts/new', element: <ReceiptForm /> },
      { path: '/receipts/:id/edit', element: <ReceiptForm /> },
      // Print routes
      // { path: '/invoice-print/:id', element: <InvoicePrintPreview /> },
      // { path: '/quote-print/:id', element: <QuotePrintPreview /> },
      // { path: '/receipt-print/:id', element: <ReceiptPrintPreview /> },
    ],
  },
  // Catch-all route for 404 errors
  {
    path: '*',
    element: <ErrorPage />,
    errorElement: <ErrorPage />
  }
])

export default router
