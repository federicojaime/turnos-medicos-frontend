// ====== src/pages/public/Home.jsx COMPLETO - CONEXIÓN FORZADA A BD ======
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
  HeartIcon,
  ShieldCheckIcon,
  ClockIcon as ClockSolid,
  SparklesIcon,
  AcademicCapIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AnimatedButton from '../../components/ui/AnimatedButton';
import GradientText from '../../components/ui/GradientText';
import ParticleBackground from '../../components/ui/ParticleBackground';
import { AnimatedStatsCard } from '../../components/ui/AnimatedCard';

export default function Home() {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // Stats animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    try {
      setIsLoading(true);
      setConnectionError(false);
      
      console.log('🔄 Intentando conectar a la base de datos...');
      console.log('🌐 URL API:', import.meta.env.VITE_API_URL || 'http://localhost:3000');

      // FORZAR CONEXIÓN A LA BASE DE DATOS
      const [specialtiesRes, clinicsRes, doctorsRes] = await Promise.all([
        apiClient.get(ENDPOINTS.SPECIALTIES),
        apiClient.get(ENDPOINTS.CLINICS + '?limit=6'),
        apiClient.get(ENDPOINTS.DOCTORS + '?limit=8'),
      ]);

      console.log('✅ Datos cargados desde la base de datos:');
      console.log('📋 Especialidades:', specialtiesRes.data);
      console.log('🏥 Clínicas:', clinicsRes.data);
      console.log('👨‍⚕️ Médicos:', doctorsRes.data);

      setSpecialties(specialtiesRes.data.data || []);
      setClinics(clinicsRes.data.data || []);
      setDoctors(doctorsRes.data.data || []);

    } catch (error) {
      console.error('💥 ERROR AL CONECTAR CON LA BASE DE DATOS:', error);
      setConnectionError(true);
      
      // MOSTRAR ERROR VISUAL AL USUARIO
      alert(`🚨 ERROR DE CONEXIÓN A LA BASE DE DATOS!\n\n${error.message}\n\nAsegúrate de que el backend esté corriendo.`);
      
      // NO USAR DATOS DE FALLBACK - FORZAR RECONEXIÓN
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-xl font-semibold text-gray-900">Conectando a la base de datos...</p>
          <p className="text-gray-600">Cargando datos reales del servidor</p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className="text-6xl mb-6">🚨</div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error de Conexión a la Base de Datos</h1>
          <p className="text-gray-700 mb-6">No se pudo establecer conexión con el servidor backend.</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold mb-2">Para solucionar:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Asegúrate de que el backend esté corriendo</li>
              <li>Verifica que esté en: http://localhost:3000</li>
              <li>Ejecuta: <code className="bg-gray-200 px-1 rounded">npm run dev</code> en el backend</li>
              <li>Revisa la configuración de CORS</li>
            </ol>
          </div>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
            🔄 Reintentar Conexión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header/Navbar Mejorado */}
      <header className="relative bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center group">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <HeartSolid className="h-6 w-6 text-white animate-heartbeat" />
              </div>
              <GradientText as="span" className="ml-3 text-2xl font-bold" gradient="primary">
                TurnosMed
              </GradientText>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100 rounded-lg"
              >
                Iniciar Sesión
              </button>
              <AnimatedButton 
                onClick={() => navigate('/book-appointment')}
                animation="bounce"
                className="shadow-lg hover:shadow-xl"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Reservar Turno
              </AnimatedButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Mejorado */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 overflow-hidden">
        <ParticleBackground particleCount={30} />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 slide-up">
              Tu salud es lo más
              <GradientText as="div" className="text-6xl md:text-8xl" gradient="medical">
                importante
              </GradientText>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto slide-up" style={{ animationDelay: '0.2s' }}>
              Reserva turnos médicos de forma 
              <span className="font-semibold text-blue-600"> fácil y rápida</span>. 
              Encuentra especialistas, consulta disponibilidad y gestiona tus citas desde cualquier lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-up" style={{ animationDelay: '0.4s' }}>
              <AnimatedButton 
                size="lg" 
                className="px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
                onClick={() => navigate('/book-appointment')}
                animation="pulse"
              >
                <CalendarDaysIcon className="h-6 w-6 mr-2" />
                Reservar Turno Ahora
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </AnimatedButton>
              
              <button 
                onClick={() => document.getElementById('specialties').scrollIntoView({ behavior: 'smooth' })}
                className="text-blue-600 hover:text-blue-500 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                Ver Especialidades
              </button>
            </div>

            {/* Stats animadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <AnimatedStatsCard
                title="Pacientes Atendidos"
                value="10,000+"
                icon={UserGroupIcon}
                color="blue"
                animationDelay={600}
              />
              <AnimatedStatsCard
                title="Médicos Especialistas"
                value="500+"
                icon={AcademicCapIcon}
                color="green"
                animationDelay={800}
              />
              <AnimatedStatsCard
                title="Satisfacción"
                value="98%"
                icon={StarIcon}
                color="purple"
                animationDelay={1000}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Mejoradas */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <GradientText as="h2" className="text-4xl md:text-5xl mb-4" gradient="primary">
              ¿Por qué elegir TurnosMed?
            </GradientText>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Innovamos en atención médica con tecnología de vanguardia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ClockSolid,
                title: "Disponibilidad 24/7",
                description: "Reserva turnos en cualquier momento del día desde nuestra plataforma online.",
                color: "from-blue-400 to-blue-600",
                delay: "0s"
              },
              {
                icon: ShieldCheckIcon,
                title: "Seguro y Confiable", 
                description: "Tus datos están protegidos con los más altos estándares de seguridad.",
                color: "from-green-400 to-green-600",
                delay: "0.2s"
              },
              {
                icon: UserGroupIcon,
                title: "Especialistas Calificados",
                description: "Accede a una red de médicos especialistas de primera calidad.",
                color: "from-purple-400 to-purple-600",
                delay: "0.4s"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group text-center slide-up"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`relative h-20 w-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                  <feature.icon className="h-10 w-10 text-white" />
                  <div className="absolute inset-0 bg-white opacity-20 rounded-2xl group-hover:animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Mejoradas */}
      <section id="specialties" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <GradientText as="h2" className="text-4xl md:text-5xl mb-4" gradient="medical">
              Especialidades Médicas
            </GradientText>
            <p className="text-xl text-gray-600">Encuentra el especialista que necesitas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialties.map((specialty, index) => (
              <div
                key={specialty.id}
                className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/book-appointment?specialty=${specialty.id}`)}
              >
                <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                  {specialty.icon || '🏥'}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {specialty.name}
                  </h3>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">{specialty.description || 'Especialidad médica de alta calidad'}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-blue-600 font-medium uppercase tracking-wider">
                    Consultar Disponibilidad →
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <AnimatedButton 
              variant="outline"
              onClick={() => navigate('/book-appointment')}
              className="border-2 border-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Ver Todas las Especialidades
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Doctors Preview Mejorado */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <GradientText as="h2" className="text-4xl md:text-5xl mb-4" gradient="primary">
              Nuestros Médicos
            </GradientText>
            <p className="text-xl text-gray-600">Profesionales de confianza para tu cuidado</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.slice(0, 4).map((doctor, index) => (
              <div 
                key={doctor.id} 
                className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Avatar mejorado */}
                <div className="relative mx-auto mb-6">
                  <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-white font-bold text-xl">
                      {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                    </span>
                  </div>
                  {/* Badge de verificación */}
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 shadow-lg">
                    <CheckCircleIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Dr. {doctor.first_name} {doctor.last_name}
                </h3>
                
                <p className="text-blue-600 font-medium text-sm mb-1">{doctor.specialty_name}</p>
                <p className="text-gray-500 text-sm mb-4">{doctor.clinic_name}</p>
                
                {/* Rating y experiencia */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700 ml-1">{doctor.rating || '4.8'}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {doctor.experience || '10'} años exp.
                  </div>
                </div>
                
                {/* Especialidades destacadas */}
                <div className="space-y-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    Especialista Certificado
                  </span>
                </div>
                
                {/* Hover effect */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                    Ver Disponibilidad
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinics Mejoradas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <GradientText as="h2" className="text-4xl md:text-5xl mb-4" gradient="sunset">
              Nuestras Clínicas
            </GradientText>
            <p className="text-xl text-gray-600">Ubicaciones convenientes para tu atención</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clinics.slice(0, 3).map((clinic, index) => (
              <div 
                key={clinic.id} 
                className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Header con rating */}
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {clinic.name}
                  </h3>
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-yellow-800 ml-1">{clinic.rating || '4.8'}</span>
                  </div>
                </div>
                
                <div className="space-y-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-green-500 transition-colors" />
                    <span>{clinic.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <DevicePhoneMobileIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-purple-500 transition-colors" />
                    <span>Turnos Online 24/7</span>
                  </div>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    ✓ Parking Gratuito
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    ✓ WiFi Gratis
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    ✓ Accesible
                  </span>
                </div>
                
                <AnimatedButton 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                  onClick={() => navigate(`/book-appointment?clinic=${clinic.id}`)}
                  animation="pulse"
                >
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  Ver Turnos Disponibles
                </AnimatedButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Mejorada */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
          <ParticleBackground particleCount={40} />
        </div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white opacity-10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 slide-up">
              ¿Listo para cuidar tu
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                salud?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-10 slide-up" style={{ animationDelay: '0.2s' }}>
              Reserva tu turno en menos de 3 minutos y comienza tu camino hacia el bienestar
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-up" style={{ animationDelay: '0.4s' }}>
              <AnimatedButton 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
                onClick={() => navigate('/book-appointment')}
                animation="heartbeat"
              >
                <SparklesIcon className="h-6 w-6 mr-2" />
                Reservar Turno Ahora
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </AnimatedButton>
              
              <button 
                onClick={() => navigate('/login')}
                className="text-white hover:text-gray-200 font-medium px-8 py-4 rounded-lg border-2 border-white/30 hover:border-white/50 transition-all duration-200 hover:bg-white/10"
              >
                Ya tengo cuenta
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">100% Seguro</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">Médicos Certificados</span>
              </div>
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 mr-2 fill-current" />
                <span className="text-sm">+10k Pacientes Satisfechos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Mejorado */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <HeartSolid className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-bold">TurnosMed</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Conectando pacientes con profesionales de la salud de manera fácil, rápida y segura.
              </p>
              
              {/* Social links */}
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <button key={social} className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <span className="text-xs font-bold">{social[0]}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Servicios */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Servicios</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {['Reserva de Turnos', 'Especialidades', 'Teleconsulta', 'Estudios Médicos', 'Urgencias', 'Medicina Preventiva'].map((service) => (
                  <li key={service}>
                    <a href="#" className="hover:text-white transition-colors duration-200 flex items-center">
                      <ArrowRightIcon className="h-3 w-3 mr-2 opacity-50" />
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Soporte */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Soporte</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {['Centro de Ayuda', 'Contacto', 'Términos de Uso', 'Política de Privacidad', 'FAQ', 'Chat en Vivo'].map((support) => (
                  <li key={support}>
                    <a href="#" className="hover:text-white transition-colors duration-200 flex items-center">
                      <ArrowRightIcon className="h-3 w-3 mr-2 opacity-50" />
                      {support}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contacto */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Contacto</h3>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 mr-3 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">0800-TURNOS</p>
                    <p className="text-xs">Lun-Vie 8:00-20:00</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-3 text-green-400" />
                  <div>
                    <p className="text-white font-medium">info@turnosmed.com</p>
                    <p className="text-xs">Respuesta en 24hs</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-3 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Buenos Aires, Argentina</p>
                    <p className="text-xs">Cobertura Nacional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                &copy; 2024 TurnosMed. Todos los derechos reservados.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-xs text-gray-500">Powered by</span>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded"></div>
                  <span className="text-sm font-medium">React & Tailwind</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}