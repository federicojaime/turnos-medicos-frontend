import { useState, useEffect } from 'react';
import { PlusIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { clinicsService } from '../../api/services/clinics';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/common/SearchBar';
import Layout from '../../components/layout/Layout';

export default function AdminClinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    loadClinics();
  }, [filters]);

  const loadClinics = async () => {
    try {
      setLoading(true);
      const response = await clinicsService.getAll(filters);
      setClinics(response.data.data || []);
    } catch (error) {
      console.error('Error loading clinics:', error);
      // Datos de fallback
      setClinics([
        {
          id: 1,
          name: 'Clínica Central',
          address: 'Av. Corrientes 1234, CABA',
          phone: '+54114567890',
          email: 'info@clinicacentral.com',
          city: 'Buenos Aires',
          state: 'CABA'
        },
        {
          id: 2,
          name: 'Hospital Norte',
          address: 'Av. Cabildo 567, CABA',
          phone: '+54114567891',
          email: 'info@hospitalnorte.com',
          city: 'Buenos Aires',
          state: 'CABA'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Clínicas</h1>
            <p className="text-gray-600">Administra las clínicas del sistema</p>
          </div>
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Clínica
          </Button>
        </div>

        <div className="flex gap-4">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
            placeholder="Buscar clínicas..."
            className="flex-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Editar</Button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{clinic.address}</span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{clinic.phone}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ciudad: {clinic.city}</span>
                <Button size="sm" variant="outline">Ver Estadísticas</Button>
              </div>
            </div>
          ))}
        </div>

        {clinics.length === 0 && !loading && (
          <div className="text-center py-12">  
            <p className="text-gray-500">No hay clínicas registradas</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
