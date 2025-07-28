import { useState, useEffect } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import StatCard from '../../components/admin/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';

export default function DoctorDashboard() {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener turnos de hoy y estadísticas
      const [todayRes, statsRes] = await Promise.all([
        apiClient.get(ENDPOINTS.TODAY_APPOINTMENTS),
        apiClient.get(ENDPOINTS.APPOINTMENT_STATS + '?period=month'),
      ]);

      if (todayRes.data.success) {
        setTodayAppointments(todayRes.data.data);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.data.summary);
      }

    } catch (error) {
      console.error('Error loading doctor data:', error);
      setError('Error cargando datos');
      
      // Datos de fallback
      setTodayAppointments([
        {
          id: 1,
          patient_name: 'María García',
          appointment_time: '09:00',
          status: 'scheduled',
          reason: 'Control cardiológico',
        },
        {
          id: 2,
          patient_name: 'Carlos López',
          appointment_time: '10:30',
          status: 'confirmed',
          reason: 'Seguimiento tratamiento',
        },
      ]);

      setStats({
        today: 8,
        upcoming: 15,
        completed: 45,
        total_appointments: 68,
      });

    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      if (newStatus === 'completed') {
        await apiClient.put(ENDPOINTS.APPOINTMENT_COMPLETE(appointmentId));
      } else if (newStatus === 'confirmed') {
        await apiClient.put(ENDPOINTS.APPOINTMENT_CONFIRM(appointmentId));
      }
      
      // Recargar datos
      loadDoctorData();
      
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando panel médico..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel Médico</h1>
        <p className="text-gray-600">Gestiona tus turnos y pacientes</p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">{error} - Mostrando datos de ejemplo</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Turnos Hoy"
          value={stats?.today || 0}
          icon={CalendarDaysIcon}
          color="blue"
        />
        <StatCard
          title="Próximos Turnos"
          value={stats?.upcoming || 0}
          icon={ClockIcon}
          color="green"
        />
        <StatCard
          title="Pacientes Atendidos"
          value={stats?.completed || 0}
          icon={UserGroupIcon}
          color="purple"
        />
        <StatCard
          title="Total del Mes"
          value={stats?.total_appointments || 0}
          icon={CheckCircleIcon}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turnos de Hoy */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Turnos de Hoy</h3>
            <Button size="sm" onClick={() => loadDoctorData()}>
              Actualizar
            </Button>
          </div>

          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {appointment.patient_name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.appointment_time} - {appointment.reason}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status === 'scheduled' ? 'Programado' :
                         appointment.status === 'confirmed' ? 'Confirmado' : 'Completado'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {appointment.status === 'scheduled' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        >
                          Confirmar
                        </Button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                        >
                          Completar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No tienes turnos programados para hoy</p>
            </div>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Button className="w-full">Ver Todos mis Turnos</Button>
            <Button variant="secondary" className="w-full">Gestionar Horarios</Button>
            <Button variant="outline" className="w-full">Historial de Pacientes</Button>
            <Button variant="outline" className="w-full">Mi Perfil</Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Estadísticas Rápidas</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tasa de Asistencia</span>
                <span className="font-medium text-green-600">92%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Promedio Diario</span>
                <span className="font-medium text-blue-600">6 turnos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Satisfacción</span>
                <span className="font-medium text-yellow-600">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}