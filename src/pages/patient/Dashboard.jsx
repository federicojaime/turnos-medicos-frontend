import { useState, useEffect } from 'react';
import { CalendarDaysIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import StatCard from '../../components/admin/StatCard';
import AppointmentCard from '../../components/patient/AppointmentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';

export default function PatientDashboard() {
  // Datos de usuario hardcodeados por ahora
  const user = {
    firstName: 'Juan',
    lastName: 'Pérez',
    patientId: 1
  };

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Si tenemos patientId, intentar cargar datos reales
      if (user?.patientId) {
        const [upcomingRes, historyRes] = await Promise.all([
          apiClient.get(ENDPOINTS.PATIENT_UPCOMING(user.patientId)),
          apiClient.get(ENDPOINTS.PATIENT_HISTORY(user.patientId)),
        ]);

        if (upcomingRes.data.success) {
          setUpcomingAppointments(upcomingRes.data.data);
        }

        if (historyRes.data.success) {
          const history = historyRes.data.data.appointments;
          setStats({
            total: history.length,
            completed: history.filter(a => a.status === 'completed').length,
            upcoming: upcomingRes.data.data.length,
          });
        }
      }

    } catch (error) {
      console.error('Error loading patient data:', error);
      setError('Error cargando datos del paciente');
      
      // Datos de fallback
      setUpcomingAppointments([
        {
          id: 1,
          doctor_name: 'Dr. María González',
          specialty_name: 'Cardiología',
          appointment_date: '2024-03-15',
          appointment_time: '14:30',
          clinic_name: 'Clínica Central',
          status: 'scheduled',
          reason: 'Control médico rutinario'
        },
        {
          id: 2,
          doctor_name: 'Dr. Carlos Rodríguez',
          specialty_name: 'Dermatología',
          appointment_date: '2024-03-20',
          appointment_time: '10:00',
          clinic_name: 'Clínica Norte',
          status: 'confirmed',
          reason: 'Revisión de lunares'
        }
      ]);
      
      setStats({
        total: 12,
        completed: 8,
        upcoming: 2,
      });

    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('¿Estás seguro de que quieres cancelar este turno?')) {
      return;
    }

    try {
      await apiClient.put(ENDPOINTS.APPOINTMENT_CANCEL(appointmentId), {
        cancellationReason: 'Cancelado por el paciente'
      });
      
      // Recargar datos
      loadPatientData();
      
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('Error al cancelar el turno');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando panel del paciente..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.firstName}
        </h1>
        <p className="text-gray-600">Gestiona tus turnos médicos</p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">{error} - Mostrando datos de ejemplo</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Próximos Turnos"
          value={stats.upcoming || 0}
          icon={CalendarDaysIcon}
          color="blue"
        />
        <StatCard
          title="Turnos Completados"
          value={stats.completed || 0}
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="Total de Turnos"
          value={stats.total || 0}
          icon={ClockIcon}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Próximos Turnos</h3>
            <Button size="sm">Nuevo Turno</Button>
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment}
                  onCancel={handleCancelAppointment}
                />
              ))}
              {upcomingAppointments.length > 3 && (
                <div className="text-center">
                  <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                    Ver todos los turnos
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No tienes turnos programados</p>
              <Button size="sm" className="mt-2">Reservar Turno</Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Button className="w-full">Reservar Nuevo Turno</Button>
            <Button variant="secondary" className="w-full">Ver Mis Turnos</Button>
            <Button variant="outline" className="w-full">Historial Médico</Button>
            <Button variant="outline" className="w-full">Mi Perfil</Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Información Rápida</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Próxima cita</span>
                <span className="font-medium text-blue-600">
                  {upcomingAppointments.length > 0 ? upcomingAppointments[0].appointment_date : 'Sin citas'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Médico de cabecera</span>
                <span className="font-medium text-green-600">Dr. González</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Obra Social</span>
                <span className="font-medium text-purple-600">OSDE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}