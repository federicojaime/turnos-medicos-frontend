import { useState, useEffect } from 'react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { appointmentsService } from '../../api/services/appointments';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import AppointmentForm from '../../components/forms/AppointmentForm';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/ui/Badge';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, [filters]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsService.getAll(filters);
      setAppointments(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este turno?')) return;
    
    try {
      await appointmentsService.delete(id);
      toast.success('Turno eliminado');
      loadAppointments();
    } catch (error) {
      // Error manejado por interceptor
    }
  };

  const handleStatusChange = async (id, action) => {
    try {
      switch (action) {
        case 'confirm':
          await appointmentsService.confirm(id);
          toast.success('Turno confirmado');
          break;
        case 'cancel':
          const reason = prompt('Motivo de cancelación:');
          if (reason) {
            await appointmentsService.cancel(id, reason);
            toast.success('Turno cancelado');
          }
          break;
        case 'complete':
          await appointmentsService.complete(id);
          toast.success('Turno completado');
          break;
      }
      loadAppointments();
    } catch (error) {
      // Error manejado por interceptor
    }
  };

  const columns = [
    {
      key: 'patient_name',
      label: 'Paciente',
      render: (value, item) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{item.patient_email}</div>
        </div>
      ),
    },
    {
      key: 'doctor_name',
      label: 'Médico',
      render: (value, item) => (
        <div>
          <div className="font-medium">Dr. {value}</div>
          <div className="text-sm text-gray-500">{item.specialty_name}</div>
        </div>
      ),
    },
    {
      key: 'appointment_date',
      label: 'Fecha',
      type: 'date',
    },
    {
      key: 'appointment_time',
      label: 'Hora',
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'badge',
      variant: (status) => status,
      render: (status) => (
        <Badge variant={status}>
          {status === 'scheduled' && 'Programado'}
          {status === 'confirmed' && 'Confirmado'}
          {status === 'completed' && 'Completado'}
          {status === 'cancelled' && 'Cancelado'}
        </Badge>
      ),
    },
    {
      key: 'clinic_name',
      label: 'Clínica',
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (_, item) => (
        <div className="flex space-x-2">
          {item.status === 'scheduled' && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={() => handleStatusChange(item.id, 'confirm')}
              >
                Confirmar
              </Button>
              <Button
                size="sm"
                variant="warning"
                onClick={() => handleStatusChange(item.id, 'cancel')}
              >
                Cancelar
              </Button>
            </>
          )}
          {item.status === 'confirmed' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => handleStatusChange(item.id, 'complete')}
            >
              Completar
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingAppointment(item);
              setShowForm(true);
            }}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(item.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Turnos</h1>
          <p className="text-gray-600">Administra todos los turnos del sistema</p>
        </div>
        <Button
          onClick={() => {
            setEditingAppointment(null);
            setShowForm(true);
          }}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nuevo Turno
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
            placeholder="Buscar por paciente, médico o clínica..."
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Todos los estados</option>
            <option value="scheduled">Programado</option>
            <option value="confirmed">Confirmado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <Table
          columns={columns}
          data={appointments}
          pagination={pagination}
          onPageChange={(page) => setFilters({ ...filters, page })}
          loading={loading}
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingAppointment ? 'Editar Turno' : 'Nuevo Turno'}
        size="lg"
      >
        <AppointmentForm
          initialData={editingAppointment}
          onSuccess={() => {
            setShowForm(false);
            loadAppointments();
          }}
        />
      </Modal>
    </div>
  );
}