import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import FormsListPage from './pages/FormsListPage'
import FormBuilderPage from './pages/FormBuilderPage'
import OfficesPage from './pages/OfficesPage'
import SubmissionsListPage from './pages/SubmissionsListPage'
import SubmissionPage from './pages/SubmissionPage'
import DataCrunchPage from './pages/DataCrunchPage'
import ProfilePage from './pages/ProfilePage'
import AdminImportPage from './pages/AdminImportPage'






export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('cave_theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes inside MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DataCrunchPage />} />

            
            {/* Offices */}
            <Route path="/offices" element={<OfficesPage />} /> 
            
            {/* Forms */}
            <Route path="/forms" element={<FormsListPage />} />
            <Route path="/forms/new" element={<FormBuilderPage />} />
            <Route path="/forms/edit/:id" element={<FormBuilderPage />} />
            
            {/* Submissions */}
            <Route path="/submissions" element={<SubmissionsListPage />} />
            <Route path="/submissions/new" element={<SubmissionPage />} />
            
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/import" element={<AdminImportPage />} />



          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
