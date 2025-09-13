import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import CreateApplication from './pages/CreateApplication'
import Payment from './pages/Payment'
import DocumentUpload from './pages/DocumentUpload'
import MyApplication from './pages/MyApplication'
import VehicleDetails from './pages/VehicleDetails'
import StatusPage from './pages/Status'
import AdminDashboard from './pages/AdminDashboard'
import ApplicationDetails from './pages/ApplicationDetails'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import EditApplication from './pages/EditApplication'
import Transactions from './pages/Transactions'
import Landing from './pages/Landing'
import DeliveryManagement from './pages/DeliveryManagement'

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative z-10">
        {!isLandingPage && <Navbar />}
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/landing" element={<Landing />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<CreateApplication />} />
              <Route path="/create" element={<CreateApplication />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/payment/:id" element={<Payment />} />
              <Route path="/upload-documents/:id" element={<DocumentUpload />} />
              <Route path="/vehicle-details/:id" element={<VehicleDetails />} />
              <Route path="/status/:id" element={<StatusPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-application" element={<MyApplication />} />
              <Route path="/delivery" element={<DeliveryManagement />} />
              <Route path="/application/edit/:id" element={<EditApplication />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/details/:id" element={<ApplicationDetails />} />
            </Route>
          </Routes>
        </div>
      </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App