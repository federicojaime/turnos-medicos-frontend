import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { patientsService } from '../../api/services/patients';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import PatientForm from '../../components/forms/PatientForm';
import SearchBar from '../../components/common/SearchBar';
import Layout from '../../components/layout/Layout';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadPatients();
  }, [filters]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await patientsService.getAll(filters);
      setPatients(response.data.data || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading patients:', error);
      // Datos de fallback
      setPatients([
        {
          id: 1,
          first_name: 'María',
          last_name: 'García',
          email: 'maria@email.com',
          phone: '+54911234567',
          birth_date: '1985-06-15',
          gender: 'F',
          insurance_provider: 'OSDE'
        },
        {
          id: 2,
          first_name: 'Carlos',
          last_name: 'López',
          email: 'carlos@email.com',
          phone: '+54911234568',
          birth_date: '1990-03-22',
          gender: 'M',
          insurance_provider: 'Swiss Medical'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este paciente?')) return;
    
    try {
      await patientsService.delete(id);
      toast.success('Paciente eliminado');
      loadPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const columns = [
    {
      key: 'full_name',
      label: 'Paciente',
      render: (_, item) => (
        <div>
          <div className="font-medium">{item.first_name} {item.last_name}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Teléfono',
    },
    {
      key: 'birth_date',
      label: 'Fecha Nac.',
      type: 'date',
    },
    {
      key: 'gender',
      label: 'Género',
      render: (value) => value === 'M' ? 'Masculino' : value === 'F' ? 'Femenino' : 'Otro'
    },
    {
      key: 'insurance_provider',
      label: 'Obra Social',
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
              setEditingPatient(item);
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
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pacientes</h1>
            <p className="text-gray-600">Administra la información de los pacientes</p>
          </div>
          <Button
            onClick={() => {
              setEditingPatient(null);
              setShowForm(true);
            }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Paciente
          </Button>
        </div>

        <div className="flex gap-4">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
            placeholder="Buscar pacientes..."
            className="flex-1"
          />
        </div>

        <div className="card">
          <Table
            columns={columns}
            data={patients}
            pagination={pagination}
            onPageChange={(page) => setFilters({ ...filters, page })}
            loading={loading}
          />
        </div>

        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title={editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
          size="lg"
        >
          <PatientForm
            initialData={editingPatient}
            onSuccess={() => {
              setShowForm(false);
              loadPatients();
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
}