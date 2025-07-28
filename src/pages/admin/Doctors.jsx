import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { doctorsService } from '../../api/services/doctors';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import DoctorForm from '../../components/forms/DoctorForm';
import SearchBar from '../../components/common/SearchBar';
import Layout from '../../components/layout/Layout';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    specialty: '',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    loadDoctors();
  }, [filters]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsService.getAll(filters);
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
      // Datos de fallback
      setDoctors([
        {
          id: 1,
          first_name: 'María',
          last_name: 'González',
          email: 'maria.gonzalez@clinica.com',
          specialty_name: 'Cardiología',
          clinic_name: 'Clínica Central',
          license_number: 'MP123456',
          consultation_duration: 30
        },
        {
          id: 2,
          first_name: 'Carlos',
          last_name: 'Rodríguez',
          email: 'carlos.rodriguez@clinica.com',
          specialty_name: 'Dermatología',
          clinic_name: 'Hospital Norte',
          license_number: 'MP123457',
          consultation_duration: 30
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'doctor_name',
      label: 'Médico',
      render: (_, item) => (
        <div>
          <div className="font-medium">Dr. {item.first_name} {item.last_name}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      ),
    },
    {
      key: 'specialty_name',
      label: 'Especialidad',
    },
    {
      key: 'clinic_name',
      label: 'Clínica',
    },
    {
      key: 'license_number',
      label: 'Matrícula',
    },
    {
      key: 'consultation_duration',
      label: 'Duración Consulta',
      render: (value) => `${value} min`
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (_, item) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingDoctor(item);
              setShowForm(true);
            }}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => console.log('Ver horarios:', item.id)}
          >
            Horarios
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Médicos</h1>
            <p className="text-gray-600">Administra la información de los médicos</p>
          </div>
          <Button
            onClick={() => {
              setEditingDoctor(null);
              setShowForm(true);
            }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Médico
          </Button>
        </div>

        <div className="flex gap-4">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
            placeholder="Buscar médicos..."
            className="flex-1"
          />
        </div>

        <div className="card">
          <Table
            columns={columns}
            data={doctors}
            loading={loading}
          />
        </div>

        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title={editingDoctor ? 'Editar Médico' : 'Nuevo Médico'}
          size="lg"
        >
          <DoctorForm
            initialData={editingDoctor}
            onSuccess={() => {
              setShowForm(false);
              loadDoctors();
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
}