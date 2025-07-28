// ====== src/App.jsx ACTUALIZADO ======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminPatients from './pages/admin/Patients';
import AdminDoctors from './pages/admin/Doctors';
import AdminClinics from './pages/admin/Clinics';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatients from './pages/doctor/Patients';
import DoctorSchedule from './pages/doctor/Schedule';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientAppointments from './pages/patient/MyAppointments';
import BookAppointment from './pages/patient/BookAppointment';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { checkAuth, isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Función para redireccionar según rol después del login
  const getDefaultRouteForRole = (role) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'doctor': return '/doctor';
      case 'patient': return '/patient';
      default: return '/';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Inicializando aplicación..." />
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to={getDefaultRouteForRole(user?.role)} replace /> : 
                <Login />
            } 
          />

          {/* Rutas Administrativas */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/appointments" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAppointments />
            </ProtectedRoute>
          } />
          <Route path="/admin/patients" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPatients />
            </ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDoctors />
            </ProtectedRoute>
          } />
          <Route path="/admin/clinics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminClinics />
            </ProtectedRoute>
          } />

          {/* Rutas de Médico */}
          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/patients" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorPatients />
            </ProtectedRoute>
          } />
          <Route path="/doctor/schedule" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorSchedule />
            </ProtectedRoute>
          } />

          {/* Rutas de Paciente */}
          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/appointments" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientAppointments />
            </ProtectedRoute>
          } />
          <Route path="/patient/appointments/new" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookAppointment />
            </ProtectedRoute>
          } />

          {/* Ruta de reserva pública (sin login) */}
          <Route path="/book-appointment" element={<BookAppointment />} />

          {/* Redirección automática basada en rol */}
          <Route path="/dashboard" element={
            isAuthenticated ? 
              <Navigate to={getDefaultRouteForRole(user?.role)} replace /> :
              <Navigate to="/login" replace />
          } />

          {/* Ruta catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;