import { useState, useEffect } from 'react';
import { CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { appointmentsService } from '../../api/services/appointments';
import AppointmentCard from '../../components/patient/AppointmentCard';
import Button from '../../components/ui/Button';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming, past, all

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const params = {
        patientId: 1, // TODO: Get from auth store
        status: filter === 'upcoming' ? 'scheduled,confirmed' : undefined,
        orderBy: 'appointment_date',
        orderDir: 'ASC'
      };
      
      const response = await appointmentsService.getAll(params);
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      // Datos de fallback
      setAppointments([
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
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('¿Estás seguro de que quieres cancelar este turno?')) {
      return;
    }

    try {
      await appointmentsService.cancel(appointmentId, 'Cancelado por el paciente');
      loadAppointments();
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  const filterButtons = [
    { key: 'upcoming', label: 'Próximos', count: appointments.filter(a => ['scheduled', 'confirmed'].includes(a.status)).length },
    { key: 'past', label: 'Pasados', count: appointments.filter(a => ['completed', 'cancelled'].includes(a.status)).length },
    { key: 'all', label: 'Todos', count: appointments.length }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Cargando turnos..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Turnos</h1>
            <p className="text-gray-600">Gestiona tus citas médicas</p>
          </div>
          <Button onClick={() => navigate('/patient/appointments/new')}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Turno
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {filterButtons.map((btn) => (
            <Button
              key={btn.key}
              variant={filter === btn.key ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(btn.key)}
            >
              {btn.label} ({btn.count})
            </Button>
          ))}
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                showActions={['scheduled', 'confirmed'].includes(appointment.status)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'upcoming' ? 'No tienes turnos próximos' : 'No hay turnos'}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'upcoming' 
                ? 'Reserva tu primer turno para comenzar' 
                : 'No se encontraron turnos para este filtro'
              }
            </p>
            <Button onClick={() => navigate('/patient/appointments/new')}>
              Reservar Turno
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}