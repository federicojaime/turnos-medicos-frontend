import { CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function AppointmentCard({ appointment, onCancel, showActions = true }) {
  const getStatusVariant = (status) => {
    const variants = {
      scheduled: 'scheduled',
      confirmed: 'confirmed', 
      completed: 'completed',
      cancelled: 'cancelled',
    };
    return variants[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      scheduled: 'Programado',
      confirmed: 'Confirmado',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return texts[status] || status;
  };

  return (
    <Card hover={true} className="transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900">
              Dr. {appointment.doctor_name}
            </h4>
            <Badge variant={getStatusVariant(appointment.status)}>
              {getStatusText(appointment.status)}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{appointment.specialty_name}</p>
          
          <div className="space-y-1 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>
                {format(new Date(appointment.appointment_date), 'EEEE, d MMMM yyyy', { locale: es })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4" />
              <span>{appointment.appointment_time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPinIcon className="h-4 w-4" />
              <span>{appointment.clinic_name}</span>
            </div>
          </div>
          
          {appointment.reason && (
            <p className="text-sm text-gray-600 mt-2">
              <strong>Motivo:</strong> {appointment.reason}
            </p>
          )}
        </div>
        
        {showActions && appointment.status === 'scheduled' && (
          <div className="ml-4">
            <Button
              size="sm"
              variant="danger"
              onClick={() => onCancel?.(appointment.id)}
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}