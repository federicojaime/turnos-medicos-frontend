import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon, ShieldCheckIcon, ClockIcon as ClockSolid } from '@heroicons/react/24/solid';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Home() {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar datos públicos (sin autenticación)
      const [specialtiesRes, clinicsRes, doctorsRes] = await Promise.all([
        apiClient.get(ENDPOINTS.SPECIALTIES).catch(() => ({ data: { data: [] } })),
        apiClient.get(ENDPOINTS.CLINICS + '?limit=6').catch(() => ({ data: { data: [] } })),
        apiClient.get(ENDPOINTS.DOCTORS + '?limit=8').catch(() => ({ data: { data: [] } })),
      ]);

      if (specialtiesRes.data?.data) setSpecialties(specialtiesRes.data.data);
      if (clinicsRes.data?.data) setClinics(clinicsRes.data.data);
      if (doctorsRes.data?.data) setDoctors(doctorsRes.data.data);

    } catch (error) {
      console.error('Error loading public data:', error);
      
      // Datos de ejemplo si falla la API
      setSpecialties([
        { id: 1, name: 'Cardiología', description: 'Cuidado del corazón' },
        { id: 2, name: 'Dermatología', description: 'Cuidado de la piel' },
        { id: 3, name: 'Pediatría', description: 'Cuidado infantil' },
        { id: 4, name: 'Ginecología', description: 'Salud femenina' },
        { id: 5, name: 'Traumatología', description: 'Huesos y articulaciones' },
        { id: 6, name: 'Neurología', description: 'Sistema nervioso' },
      ]);

      setClinics([
        { id: 1, name: 'Clínica Central', address: 'Av. Corrientes 1234, CABA', phone: '+54114567890', city: 'Buenos Aires' },
        { id: 2, name: 'Hospital Norte', address: 'Av. Cabildo 567, CABA', phone: '+54114567891', city: 'Buenos Aires' },
        { id: 3, name: 'Centro Médico Sur', address: 'Av. Rivadavia 890, CABA', phone: '+54114567892', city: 'Buenos Aires' },
      ]);

      setDoctors([
        { id: 1, first_name: 'María', last_name: 'González', specialty_name: 'Cardiología', clinic_name: 'Clínica Central' },
        { id: 2, first_name: 'Carlos', last_name: 'Rodríguez', specialty_name: 'Dermatología', clinic_name: 'Hospital Norte' },
        { id: 3, first_name: 'Ana', last_name: 'Martínez', specialty_name: 'Pediatría', clinic_name: 'Centro Médico Sur' },
        { id: 4, first_name: 'Juan', last_name: 'López', specialty_name: 'Traumatología', clinic_name: 'Clínica Central' },
      ]);

    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <HeartIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">TurnosMed</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Iniciar Sesión
              </button>
              <Button onClick={() => navigate('/book-appointment')}>
                Reservar Turno
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Tu salud es lo más
              <span className="text-blue-600 block">importante</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Reserva turnos médicos de forma fácil y rápida. Encuentra especialistas, 
              consulta disponibilidad y gestiona tus citas desde cualquier lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="px-8 py-3"
                onClick={() => navigate('/book-appointment')}
              >
                Reservar Turno Ahora
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
              <button 
                onClick={() => document.getElementById('specialties').scrollIntoView({ behavior: 'smooth' })}
                className="text-blue-600 hover:text-blue-500 font-medium px-6 py-3"
              >
                Ver Especialidades
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockSolid className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Disponibilidad 24/7</h3>
              <p className="text-gray-600">Reserva turnos en cualquier momento del día desde nuestra plataforma online.</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seguro y Confiable</h3>
              <p className="text-gray-600">Tus datos están protegidos con los más altos estándares de seguridad.</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Especialistas Calificados</h3>
              <p className="text-gray-600">Accede a una red de médicos especialistas de primera calidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section id="specialties" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Especialidades Médicas</h2>
            <p className="text-lg text-gray-600">Encuentra el especialista que necesitas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => (
              <div
                key={specialty.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/book-appointment?specialty=${specialty.id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {specialty.name}
                  </h3>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-gray-600 text-sm">{specialty.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="outline"
              onClick={() => navigate('/book-appointment')}
            >
              Ver Todas las Especialidades
            </Button>
          </div>
        </div>
      </section>

      {/* Doctors Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Médicos</h2>
            <p className="text-lg text-gray-600">Profesionales de confianza para tu cuidado</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.slice(0, 4).map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-semibold text-lg">
                    {doctor.first_name[0]}{doctor.last_name[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Dr. {doctor.first_name} {doctor.last_name}
                </h3>
                <p className="text-blue-600 font-medium text-sm mb-1">{doctor.specialty_name}</p>
                <p className="text-gray-500 text-sm">{doctor.clinic_name}</p>
                
                <div className="flex justify-center mt-3">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Clínicas</h2>
            <p className="text-lg text-gray-600">Ubicaciones convenientes para tu atención</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clinics.slice(0, 3).map((clinic) => (
              <div key={clinic.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{clinic.name}</h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{clinic.phone}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={() => navigate(`/book-appointment?clinic=${clinic.id}`)}
                >
                  Ver Turnos Disponibles
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para cuidar tu salud?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Reserva tu turno en menos de 3 minutos
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3"
            onClick={() => navigate('/book-appointment')}
          >
            Reservar Turno Ahora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <HeartIcon className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-lg font-bold">TurnosMed</span>
              </div>
              <p className="text-gray-400 text-sm">
                Conectando pacientes con profesionales de la salud de manera fácil y segura.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Reserva de Turnos</a></li>
                <li><a href="#" className="hover:text-white">Especialidades</a></li>
                <li><a href="#" className="hover:text-white">Teleconsulta</a></li>
                <li><a href="#" className="hover:text-white">Estudios Médicos</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
                <li><a href="#" className="hover:text-white">Términos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidad</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span>0800-TURNOS</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  <span>info@turnosmed.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 TurnosMed. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}