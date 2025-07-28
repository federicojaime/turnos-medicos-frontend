import { useState, useEffect } from 'react';
import { UserGroupIcon, ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { appointmentsService } from '../../api/services/appointments';
import { patientsService } from '../../api/services/patients';
import Layout from '../../components/layout/Layout';
import SearchBar from '../../components/common/SearchBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);

  useEffect(() => {
    loadPatients();
  }, [searchTerm]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      // TODO: Filtrar por doctorId del usuario autenticado
      const response = await appointmentsService.getAll({
        doctorId: 1, // TODO: Get from auth store
        groupBy: 'patient',
        search: searchTerm
      });
      
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
      // Datos de fallback
      setPatients([
        {
          id: 1,
          patient_name: 'María García',
          patient_email: 'maria@email.com',
          patient_phone: '+54911234567',
          last_appointment: '2024-03-10',
          total_appointments: 5,
          last_diagnosis: 'Control cardiológico normal'
        },
        {
          id: 2,
          patient_name: 'Carlos López',
          patient_email: 'carlos@email.com',
          patient_phone: '+54911234568',
          last_appointment: '2024-03-08',
          total_appointments: 3,
          last_diagnosis: 'Seguimiento tratamiento'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientHistory = async (patientId) => {
    try {
      const response = await patientsService.getHistory(patientId);
      setPatientHistory(response.data.data.appointments || []);
      setSelectedPatient(patientId);
    } catch (error) {
      console.error('Error loading patient history:', error);
      setPatientHistory([
        {
          id: 1,
          appointment_date: '2024-03-10',
          appointment_time: '14:30',
          diagnosis: 'Control cardiológico normal',
          notes: 'Paciente en buen estado general. Continuar medicación actual.'
        },
        {
          id: 2,
          appointment_date: '2024-02-15',
          appointment_time: '15:00',
          diagnosis: 'Hipertensión controlada',
          notes: 'Presión arterial estable. Mantener dieta y ejercicio.'
        }
      ]);
      setSelectedPatient(patientId);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Cargando pacientes..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Pacientes</h1>
          <p className="text-gray-600">Gestiona la información de tus pacientes</p>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar pacientes por nombre o email..."
          className="max-w-md"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Pacientes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Pacientes ({patients.length})
            </h3>
            
            {patients.map((patient) => (
              <div 
                key={patient.id} 
                className={`card cursor-pointer transition-all ${
                  selectedPatient === patient.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => loadPatientHistory(patient.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {patient.patient_name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {patient.patient_email}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-3 w-3 mr-1" />
                        Última cita: {patient.last_appointment}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {patient.total_appointments} citas
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver Historial
                  </Button>
                </div>
              </div>
            ))}

            {patients.length === 0 && (
              <div className="text-center py-8">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No tienes pacientes asignados</p>
              </div>
            )}
          </div>

          {/* Historial del Paciente Seleccionado */}
          <div className="card">
            {selectedPatient ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Historial Médico
                </h3>
                
                <div className="space-y-4">
                  {patientHistory.map((appointment) => (
                    <div key={appointment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.appointment_date} - {appointment.appointment_time}
                        </div>
                      </div>
                      
                      {appointment.diagnosis && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Diagnóstico:
                          </span>
                          <p className="text-sm text-gray-900 mt-1">
                            {appointment.diagnosis}
                          </p>
                        </div>
                      )}
                      
                      {appointment.notes && (
                        <div>
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                            Notas:
                          </span>
                          <p className="text-sm text-gray-700 mt-1">
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Selecciona un paciente para ver su historial</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
