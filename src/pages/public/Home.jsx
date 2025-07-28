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
    SparklesIcon,
    AcademicCapIcon,
    DevicePhoneMobileIcon,
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';

// Importar logos de Alta Luna
import altaLunaLogo from '../../assets/logos/Altaluna-logo.png';
import altaLunaLogoWhite from '../../assets/logos/au-blanco.png';
import altaLunaLogoLight from '../../assets/logos/au-blanco.png';
import altaLunaIcono from '../../assets/logos/Altaluna-logo.png';

export default function RevisarHomePage() {
    const navigate = useNavigate();
    const [specialties, setSpecialties] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [connectionError, setConnectionError] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);

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

            console.log('🔄 Cargando datos desde la API...');

            // Cargar datos desde la API real
            const [specialtiesRes, clinicsRes, doctorsRes] = await Promise.all([
                apiClient.get(ENDPOINTS.SPECIALTIES),
                apiClient.get(ENDPOINTS.CLINICS + '?limit=6'),
                apiClient.get(ENDPOINTS.DOCTORS + '?limit=8'),
            ]);

            console.log('✅ Datos cargados exitosamente');

            setSpecialties(specialtiesRes.data.data || []);
            setClinics(clinicsRes.data.data || []);
            setDoctors(doctorsRes.data.data || []);

        } catch (error) {
            console.error('💥 ERROR AL CONECTAR CON LA API:', error);
            setConnectionError(true);

            // Solo usar datos de fallback si hay error de conexión
            if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
                console.log('🔄 Usando datos de fallback...');
                setSpecialties([
                    { id: 1, name: 'Cardiología', description: 'Especialistas en salud cardiovascular' },
                    { id: 2, name: 'Dermatología', description: 'Cuidado integral de la piel' },
                    { id: 3, name: 'Neurología', description: 'Diagnóstico y tratamiento neurológico' },
                    { id: 4, name: 'Pediatría', description: 'Atención médica especializada para niños' },
                    { id: 5, name: 'Ginecología', description: 'Salud femenina integral' },
                    { id: 6, name: 'Traumatología', description: 'Especialistas en lesiones y fracturas' }
                ]);

                setClinics([
                    { id: 1, name: 'Centro Médico Norte', address: 'Av. Corrientes 1234, CABA', phone: '+54 11 4567-8900', city: 'Buenos Aires' },
                    { id: 2, name: 'Clínica San Luis', address: 'San Martín 567, San Luis', phone: '+54 266 444-5678', city: 'San Luis' },
                    { id: 3, name: 'Hospital Central', address: 'Belgrano 890, Mendoza', phone: '+54 261 333-4567', city: 'Mendoza' }
                ]);

                setDoctors([
                    { id: 1, first_name: 'María', last_name: 'González', specialty_name: 'Cardiología', clinic_name: 'Centro Médico Norte' },
                    { id: 2, first_name: 'Carlos', last_name: 'Rodríguez', specialty_name: 'Dermatología', clinic_name: 'Clínica San Luis' },
                    { id: 3, first_name: 'Ana', last_name: 'Martínez', specialty_name: 'Pediatría', clinic_name: 'Hospital Central' },
                    { id: 4, first_name: 'Diego', last_name: 'López', specialty_name: 'Neurología', clinic_name: 'Centro Neurológico' }
                ]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-900">Conectando a la API...</p>
                    <p className="text-gray-600">Cargando datos del sistema</p>
                </div>
            </div>
        );
    }

    if (connectionError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center max-w-2xl mx-auto p-8">
                    <div className="text-6xl mb-6">🚨</div>
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Error de Conexión</h1>
                    <p className="text-gray-700 mb-6">No se pudo conectar con el servidor backend.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        🔄 Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header Moderno */}
            <header className="relative bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <HeartSolid className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-3">
                                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                    Revis.ar
                                </span>
                                <div className="flex items-center mt-1">
                                    <span className="text-xs text-gray-500 mr-2">by</span>
                                    <img
                                        src={altaLunaLogo}
                                        alt="Alta Luna"
                                        className="h-6 opacity-70 hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Navigation Desktop */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#especialidades" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                Especialidades
                            </a>
                            <a href="#clinicas" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                Clínicas
                            </a>
                            <a href="#medicos" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                                Médicos
                            </a>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="hidden sm:block text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 rounded-lg"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => navigate('/book-appointment')}
                                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <SparklesIcon className="h-4 w-4 mr-2 inline" />
                                Reservar Turno
                            </button>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                {mobileMenuOpen ? (
                                    <XMarkIcon className="h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-100">
                            <div className="space-y-2">
                                <a href="#especialidades" className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                                    Especialidades
                                </a>
                                <a href="#clinicas" className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                                    Clínicas
                                </a>
                                <a href="#medicos" className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                                    Médicos
                                </a>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Iniciar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20 lg:py-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-300 rounded-full animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Tu salud es nuestra
                            <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                prioridad
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                            Reserva turnos médicos de forma fácil y rápida. Encuentra especialistas,
                            consulta disponibilidad y gestiona tus citas desde cualquier lugar en Argentina.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                            <button
                                onClick={() => navigate('/book-appointment')}
                                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 flex items-center"
                            >
                                <CalendarDaysIcon className="h-6 w-6 mr-2" />
                                Reservar Turno Ahora
                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </button>

                            <button
                                onClick={() => document.getElementById('especialidades').scrollIntoView({ behavior: 'smooth' })}
                                className="text-emerald-600 hover:text-emerald-700 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-all duration-200 flex items-center"
                            >
                                Ver Especialidades
                                <ChevronDownIcon className="ml-2 h-5 w-5" />
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transform transition-all duration-700 ${statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                <div className="text-3xl font-bold text-emerald-600 mb-2">+10,000</div>
                                <div className="text-gray-600 font-medium">Pacientes Atendidos</div>
                            </div>
                            <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transform transition-all duration-700 ${statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                                <div className="text-3xl font-bold text-blue-600 mb-2">+{doctors.length * 10}</div>
                                <div className="text-gray-600 font-medium">Médicos Especialistas</div>
                            </div>
                            <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 transform transition-all duration-700 ${statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
                                <div className="text-3xl font-bold text-purple-600 mb-2">{clinics.length}</div>
                                <div className="text-gray-600 font-medium">Clínicas Asociadas</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            ¿Por qué elegir <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Revis.ar</span>?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            La plataforma más confiable para gestionar tu salud en Argentina
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ClockIcon,
                                title: "Disponibilidad 24/7",
                                description: "Reserva turnos en cualquier momento del día desde nuestra plataforma online segura.",
                                color: "from-blue-400 to-blue-600",
                                delay: "0s"
                            },
                            {
                                icon: ShieldCheckIcon,
                                title: "Seguro y Confiable",
                                description: "Tus datos están protegidos con los más altos estándares de seguridad médica.",
                                color: "from-emerald-400 to-emerald-600",
                                delay: "0.2s"
                            },
                            {
                                icon: AcademicCapIcon,
                                title: "Especialistas Calificados",
                                description: "Accede a una red de médicos especialistas certificados y de primera calidad.",
                                color: "from-purple-400 to-purple-600",
                                delay: "0.4s"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`group text-center transform transition-all duration-700 hover:scale-105`}
                                style={{ animationDelay: feature.delay }}
                            >
                                <div className={`relative h-20 w-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:rotate-6`}>
                                    <feature.icon className="h-10 w-10 text-white" />
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Specialties Section */}
            <section id="especialidades" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Especialidades <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Médicas</span>
                        </h2>
                        <p className="text-xl text-gray-600">Encuentra el especialista que necesitas</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {specialties.map((specialty, index) => (
                            <div
                                key={specialty.id}
                                className={`group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2`}
                                onClick={() => navigate(`/book-appointment?specialty=${specialty.id}`)}
                            >
                                <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                                    {specialty.icon || '🏥'}
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                        {specialty.name}
                                    </h3>
                                    <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {specialty.description || 'Especialidad médica de alta calidad'}
                                </p>

                                <div className="pt-4 border-t border-gray-100">
                                    <span className="text-xs text-emerald-600 font-medium uppercase tracking-wider">
                                        Consultar Disponibilidad →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => navigate('/book-appointment')}
                            className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                        >
                            Ver Todas las Especialidades
                        </button>
                    </div>
                </div>
            </section>

            {/* Doctors Section */}
            <section id="medicos" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Nuestros <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Médicos</span>
                        </h2>
                        <p className="text-xl text-gray-600">Profesionales de excelencia para tu cuidado</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {doctors.slice(0, 4).map((doctor, index) => (
                            <div
                                key={doctor.id}
                                className={`group bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4`}
                            >
                                {/* Avatar */}
                                <div className="relative mx-auto mb-6">
                                    <div className="h-20 w-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                                        <span className="text-white font-bold text-xl">
                                            {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                                        </span>
                                    </div>
                                    {/* Verification Badge */}
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-lg">
                                        <CheckCircleIcon className="h-4 w-4 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                    Dr. {doctor.first_name} {doctor.last_name}
                                </h3>

                                <p className="text-emerald-600 font-medium text-sm mb-1">{doctor.specialty_name}</p>
                                <p className="text-gray-500 text-sm mb-4">{doctor.clinic_name}</p>

                                {/* Rating */}
                                <div className="flex items-center justify-center space-x-4 mb-4">
                                    <div className="flex items-center">
                                        <StarSolid className="h-4 w-4 text-yellow-400" />
                                        <span className="text-sm font-medium text-gray-700 ml-1">4.8</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        10+ años exp.
                                    </div>
                                </div>

                                {/* Badge */}
                                <div className="mb-4">
                                    <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">
                                        Especialista Certificado
                                    </span>
                                </div>

                                {/* Hover Button */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={() => navigate(`/book-appointment?doctor=${doctor.id}`)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Ver Disponibilidad
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clinics Section */}
            <section id="clinicas" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Nuestras <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Clínicas</span>
                        </h2>
                        <p className="text-xl text-gray-600">Ubicaciones convenientes en todo el país</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {clinics.slice(0, 3).map((clinic, index) => (
                            <div
                                key={clinic.id}
                                className={`group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                        {clinic.name}
                                    </h3>
                                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                                        <StarSolid className="h-4 w-4 text-yellow-400" />
                                        <span className="text-sm font-medium text-yellow-800 ml-1">4.8</span>
                                    </div>
                                </div>

                                <div className="space-y-4 text-sm text-gray-600 mb-6">
                                    <div className="flex items-center">
                                        <MapPinIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                        <span>{clinic.address}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <PhoneIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        <span>{clinic.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <DevicePhoneMobileIcon className="h-5 w-5 mr-3 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                        <span>Turnos Online 24/7</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                                        ✓ Parking Gratuito
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        ✓ WiFi Gratis
                                    </span>
                                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                        ✓ Accesible
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate(`/book-appointment?clinic=${clinic.id}`)}
                                    className="w-full border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 group-hover:scale-105 flex items-center justify-center"
                                >
                                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                                    Ver Turnos Disponibles
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-700 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            ¿Listo para cuidar tu
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                                salud?
                            </span>
                        </h2>

                        <p className="text-xl md:text-2xl text-blue-100 mb-10">
                            Reserva tu turno en menos de 3 minutos y comienza tu camino hacia el bienestar
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <button
                                onClick={() => navigate('/book-appointment')}
                                className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center"
                            >
                                <SparklesIcon className="h-6 w-6 mr-2" />
                                Reservar Turno Ahora
                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </button>

                            <button
                                onClick={() => navigate('/login')}
                                className="text-white hover:text-gray-200 font-semibold px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-200 hover:bg-white/10"
                            >
                                Ya tengo cuenta
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
                            <div className="flex items-center">
                                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                                <span className="text-sm">100% Seguro</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircleIcon className="h-5 w-5 mr-2" />
                                <span className="text-sm">Médicos Certificados</span>
                            </div>
                            <div className="flex items-center">
                                <StarSolid className="h-5 w-5 mr-2" />
                                <span className="text-sm">+10k Pacientes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="flex items-center mb-6">
                                <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <HeartSolid className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-3">
                                    <span className="text-2xl font-bold">Revis.ar</span>
                                    <div className="flex items-center mt-1">
                                        <span className="text-xs text-gray-400 mr-2">by</span>
                                        <img
                                            src={altaLunaLogoWhite}
                                            alt="Alta Luna"
                                            className="h-12 opacity-70 hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Conectando pacientes con profesionales de la salud de manera fácil, rápida y segura en toda Argentina.
                            </p>

                            {/* Alta Luna Link */}
                            <a
                                href="https://altaluna.ar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors group"
                            >
                               
                                <span>Desarrollado por Alta Luna</span>
                                <ArrowRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        {/* Servicios */}
                        <div>
                            <h3 className="font-semibold mb-6 text-lg">Servicios</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                {['Reserva de Turnos', 'Especialidades Médicas', 'Teleconsulta', 'Estudios Médicos', 'Medicina Preventiva', 'Emergencias'].map((service) => (
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
                                {['Centro de Ayuda', 'Contacto', 'Términos de Uso', 'Política de Privacidad', 'Preguntas Frecuentes', 'Chat en Vivo'].map((support) => (
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
                                    <PhoneIcon className="h-5 w-5 mr-3 text-emerald-400" />
                                    <div>
                                        <p className="text-white font-medium">0800-REVISAR</p>
                                        <p className="text-xs">Lun-Vie 8:00-20:00</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <EnvelopeIcon className="h-5 w-5 mr-3 text-blue-400" />
                                    <div>
                                        <p className="text-white font-medium">info@revis.ar</p>
                                        <p className="text-xs">Respuesta en 24hs</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <MapPinIcon className="h-5 w-5 mr-3 text-purple-400" />
                                    <div>
                                        <p className="text-white font-medium">Cordoba, Argentina</p>
                                        <p className="text-xs">Cobertura Nacional</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 mt-12 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-gray-400">
                                &copy; 2024 Revis.ar by Alta Luna. Todos los derechos reservados.
                            </p>
                            <div className="flex items-center space-x-6 mt-4 md:mt-0">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src={altaLunaLogoLight}
                                        alt="Alta Luna"
                                        className="h-10 opacity-60"
                                    />
                                    <span className="text-xs text-gray-500">Powered by Alta Luna</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}