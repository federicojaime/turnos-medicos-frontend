import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import StatCard from '../../components/admin/StatCard';
import RecentAppointments from '../../components/admin/RecentAppointments';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Llamar a múltiples endpoints en paralelo
      const [statsRes, appointmentsRes, clinicsRes] = await Promise.all([
        apiClient.get(ENDPOINTS.APPOINTMENT_STATS + '?period=month'),
        apiClient.get(ENDPOINTS.APPOINTMENTS + '?limit=5&orderBy=created_at&orderDir=DESC'),
        apiClient.get(ENDPOINTS.CLINICS + '?limit=5'),
      ]);

      // Procesar estadísticas
      if (statsRes.data.success) {
        setStats(statsRes.data.data.summary);
      }

      // Procesar turnos recientes
      if (appointmentsRes.data.success) {
        setRecentAppointments(appointmentsRes.data.data);
      }

      // Procesar clínicas
      if (clinicsRes.data.success) {
        setClinics(clinicsRes.data.data);
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Error cargando los datos del dashboard');
      
      // Si es error 401, redirigir al login
      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }
      
      // Datos de fallback para desarrollo
      setStats({
        today: 12,
        upcoming: 25,
        total_appointments: 156,
        completed: 120,
        cancelled: 11,
        scheduled: 15,
        confirmed: 10
      });
      
      setRecentAppointments([
        {
          id: 1,
          patient_name: 'María García',
          doctor_name: 'Juan Pérez',
          specialty_name: 'Cardiología',
          appointment_date: '2024-03-15',
          appointment_time: '14:30',
          status: 'scheduled'
        },
        {
          id: 2,
          patient_name: 'Carlos López',
          doctor_name: 'Ana Martínez',
          specialty_name: 'Dermatología',
          appointment_date: '2024-03-14',
          appointment_time: '10:00',
          status: 'confirmed'
        }
      ]);
      
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">Resumen general del sistema</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={() => navigate('/admin/appointments/new')}
            size="sm"
          >
            Nuevo Turno
          </Button>
          <Button 
            variant="outline"
            onClick={() => loadDashboardData()}
            size="sm"
          >
            Actualizar
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Turnos Hoy"
          value={stats?.today || 0}
          icon={CalendarDaysIcon}
          color="blue"
          trend={{ direction: 'up', value: '+12%' }}
        />
        <StatCard
          title="Próximos Turnos"
          value={stats?.upcoming || 0}
          icon={UserGroupIcon}
          color="green"
        />
        <StatCard
          title="Total Turnos"
          value={stats?.total_appointments || 0}
          icon={UserIcon}
          color="purple"
        />
        <StatCard
          title="Clínicas Activas"
          value={clinics?.length || 0}
          icon={BuildingOfficeIcon}
          color="orange"
        />
      </div>

      {/* Recent Appointments y Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAppointments appointments={recentAppointments} />
        
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas Rápidas</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Turnos Completados</span>
              <span className="text-sm font-semibold text-green-600">{stats?.completed || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Turnos Cancelados</span>
              <span className="text-sm font-semibold text-red-600">{stats?.cancelled || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Turnos Programados</span>
              <span className="text-sm font-semibold text-blue-600">{stats?.scheduled || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Turnos Confirmados</span>
              <span className="text-sm font-semibold text-yellow-600">{stats?.confirmed || 0}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Acciones Rápidas</h4>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/admin/appointments')}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Ver Todos los Turnos
              </Button>
              <Button 
                onClick={() => navigate('/admin/patients')}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Gestionar Pacientes
              </Button>
              <Button 
                onClick={() => navigate('/admin/doctors')}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Gestionar Médicos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}