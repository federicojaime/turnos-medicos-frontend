import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    CalendarDaysIcon,
    ClockIcon,
    MapPinIcon,
    UserIcon,
    CheckCircleIcon,
    ArrowLeftIcon,
    ChevronRightIcon,
    HeartIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { doctorsService } from '../../api/services/doctors';
import { clinicsService } from '../../api/services/clinics';
import { appointmentsService } from '../../api/services/appointments';
import { patientsService } from '../../api/services/patients';
import useAuthStore from '../../store/authStore';

export default function BookAppointment() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated } = useAuthStore();

    // States
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '');
    const [selectedDoctor, setSelectedDoctor] = useState(searchParams.get('doctor') || '');
    const [selectedClinic, setSelectedClinic] = useState(searchParams.get('clinic') || '');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [patientInfo, setPatientInfo] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        reason: ''
    });

    // Data
    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('hoy'); // Empezar con HOY

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (!loading) { // Solo cargar slots después de que se carguen los datos iniciales
            loadAvailableSlots();
        }
    }, [selectedSpecialty, selectedDoctor, selectedClinic, dateFilter, loading]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            console.log('🔄 Cargando datos iniciales...');

            const [specialtiesRes, doctorsRes, clinicsRes] = await Promise.all([
                doctorsService.getSpecialties(),
                doctorsService.getAll(),
                clinicsService.getAll(),
            ]);

            const specialtiesData = specialtiesRes.data.data || [];
            const doctorsData = doctorsRes.data.data || [];
            const clinicsData = clinicsRes.data.data || [];

            console.log('✅ Datos cargados:', {
                especialidades: specialtiesData.length,
                medicos: doctorsData.length,
                clinicas: clinicsData.length
            });

            setSpecialties(specialtiesData);
            setDoctors(doctorsData);
            setClinics(clinicsData);

        } catch (error) {
            console.error('❌ Error loading initial data:', error);

            // Fallback data más realista
            console.log('📦 Usando datos de fallback...');

            setSpecialties([
                { id: 1, name: 'Cardiología', description: 'Especialistas en salud cardiovascular' },
                { id: 2, name: 'Dermatología', description: 'Cuidado integral de la piel' },
                { id: 3, name: 'Neurología', description: 'Diagnóstico y tratamiento neurológico' },
                { id: 4, name: 'Pediatría', description: 'Atención médica especializada para niños' },
                { id: 5, name: 'Ginecología', description: 'Salud femenina integral' },
                { id: 6, name: 'Traumatología', description: 'Especialistas en lesiones y fracturas' }
            ]);

            setDoctors([
                { id: 1, first_name: 'María', last_name: 'González', specialty_name: 'Cardiología', clinic_name: 'Centro Médico Norte', specialty_id: 1, clinic_id: 1 },
                { id: 2, first_name: 'Carlos', last_name: 'Rodríguez', specialty_name: 'Dermatología', clinic_name: 'Clínica San Luis', specialty_id: 2, clinic_id: 2 },
                { id: 3, first_name: 'Ana', last_name: 'Martínez', specialty_name: 'Pediatría', clinic_name: 'Hospital Central', specialty_id: 4, clinic_id: 3 },
                { id: 4, first_name: 'Diego', last_name: 'López', specialty_name: 'Neurología', clinic_name: 'Centro Neurológico', specialty_id: 3, clinic_id: 1 },
                { id: 5, first_name: 'Laura', last_name: 'Fernández', specialty_name: 'Ginecología', clinic_name: 'Clínica Femenina', specialty_id: 5, clinic_id: 2 },
                { id: 6, first_name: 'Roberto', last_name: 'Silva', specialty_name: 'Traumatología', clinic_name: 'Hospital Deportivo', specialty_id: 6, clinic_id: 3 }
            ]);

            setClinics([
                { id: 1, name: 'Centro Médico Norte', address: 'Av. Corrientes 1234, CABA', city: 'Buenos Aires', phone: '+54 11 4567-8900' },
                { id: 2, name: 'Clínica San Luis', address: 'San Martín 567, San Luis', city: 'San Luis', phone: '+54 266 444-5678' },
                { id: 3, name: 'Hospital Central', address: 'Belgrano 890, Mendoza', city: 'Mendoza', phone: '+54 261 333-4567' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableSlots = () => {
        console.log('🔄 Generando slots disponibles...');

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day

        const slots = [];

        // Generar slots desde HOY hasta 14 días en el futuro
        for (let day = 0; day < 14; day++) {
            const date = new Date(today);
            date.setDate(today.getDate() + day);

            // Saltar domingos
            if (date.getDay() === 0) continue;

            // Horarios disponibles
            const timeSlots = day === 0
                ? ['14:00', '15:00', '16:00', '17:00', '18:00'] // HOY solo tarde
                : ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00']; // Otros días completo

            timeSlots.forEach(time => {
                // Solo mostrar turnos futuros si es HOY
                if (day === 0) {
                    const now = new Date();
                    const slotDateTime = new Date(date);
                    const [hours, minutes] = time.split(':');
                    slotDateTime.setHours(parseInt(hours), parseInt(minutes));

                    // Saltar si el horario ya pasó
                    if (slotDateTime <= now) return;
                }

                // 70% chance de estar disponible
                if (Math.random() > 0.3) {
                    // Seleccionar doctor basado en filtros
                    let doctorData;
                    if (selectedDoctor) {
                        doctorData = doctors.find(d => d.id == selectedDoctor);
                    } else if (selectedSpecialty) {
                        const specialtyDoctors = doctors.filter(d => d.specialty_id == selectedSpecialty);
                        doctorData = specialtyDoctors[Math.floor(Math.random() * specialtyDoctors.length)];
                    } else {
                        doctorData = doctors[Math.floor(Math.random() * doctors.length)];
                    }

                    if (!doctorData) return;

                    // Seleccionar clínica basada en filtros
                    let clinicData;
                    if (selectedClinic) {
                        clinicData = clinics.find(c => c.id == selectedClinic);
                    } else if (doctorData.clinic_id) {
                        clinicData = clinics.find(c => c.id === doctorData.clinic_id);
                    } else {
                        clinicData = clinics[Math.floor(Math.random() * clinics.length)];
                    }

                    if (!clinicData) return;

                    slots.push({
                        id: `${doctorData.id}-${date.toISOString().split('T')[0]}-${time}`,
                        doctorId: doctorData.id,
                        doctorName: `Dr. ${doctorData.first_name} ${doctorData.last_name}`,
                        specialty: doctorData.specialty_name,
                        clinicId: clinicData.id,
                        clinicName: clinicData.name,
                        clinicAddress: clinicData.address,
                        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
                        time: time, // HH:MM format
                        dateFormatted: date.toLocaleDateString('es-AR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        available: true,
                        price: Math.floor(Math.random() * 4000) + 3000, // 3000-7000
                        rating: (4.5 + Math.random() * 0.5).toFixed(1), // 4.5-5.0
                        isToday: day === 0
                    });
                }
            });
        }

        // Ordenar por fecha y hora
        slots.sort((a, b) => {
            const dateCompare = new Date(a.date) - new Date(b.date);
            if (dateCompare !== 0) return dateCompare;
            return a.time.localeCompare(b.time);
        });

        console.log(`✅ Generados ${slots.length} slots disponibles`);
        setAvailableSlots(slots);
    };

    const filteredSlots = availableSlots.filter(slot => {
        // Filtro de búsqueda
        const matchesSearch =
            slot.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            slot.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            slot.clinicName.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro de fecha
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const slotDate = new Date(slot.date);
        const daysDiff = Math.ceil((slotDate - today) / (1000 * 60 * 60 * 24));

        let matchesDate = true;
        if (dateFilter === 'hoy') {
            matchesDate = daysDiff === 0;
        } else if (dateFilter === 'manana') {
            matchesDate = daysDiff === 1;
        } else if (dateFilter === 'proximos-3-dias') {
            matchesDate = daysDiff <= 3 && daysDiff >= 0;
        } else if (dateFilter === 'proximos-7-dias') {
            matchesDate = daysDiff <= 7 && daysDiff >= 0;
        } else if (dateFilter === 'proximos-14-dias') {
            matchesDate = daysDiff <= 14 && daysDiff >= 0;
        }

        return matchesSearch && matchesDate;
    });

    const handleSlotSelect = (slot) => {
        console.log('✅ Slot seleccionado:', slot);
        setSelectedSlot(slot);
        setCurrentStep(2);
    };

    const createOrGetPatient = async () => {
        try {
            // Si el usuario está autenticado y es paciente, usar su ID
            if (isAuthenticated && user?.role === 'patient' && user?.patientId) {
                console.log('👤 Usando paciente autenticado:', user.patientId);
                return user.patientId;
            }

            // Si no está autenticado, crear un paciente temporal
            const patientData = {
                firstName: patientInfo.firstName.trim(),
                lastName: patientInfo.lastName.trim(),
                email: patientInfo.email.trim(),
                phone: patientInfo.phone.trim(),
                birthDate: null,
                gender: null,
                emergencyContactName: null,
                emergencyContactPhone: null,
                insuranceProvider: null,
                insuranceNumber: null
            };

            console.log('📤 Creando paciente temporal:', patientData);

            const response = await patientsService.create(patientData);
            const patientId = response.data.data.id;

            console.log('✅ Paciente creado con ID:', patientId);
            return patientId;

        } catch (error) {
            console.error('❌ Error creating/getting patient:', error);
            throw new Error('Error al procesar datos del paciente: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            // Validaciones previas
            if (!selectedSlot) {
                toast.error('No hay turno seleccionado');
                return;
            }

            if (!patientInfo.firstName.trim() || !patientInfo.lastName.trim() ||
                !patientInfo.email.trim() || !patientInfo.phone.trim()) {
                toast.error('Por favor completa todos los campos obligatorios');
                return;
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(patientInfo.email.trim())) {
                toast.error('Por favor ingresa un email válido');
                return;
            }

            console.log('🔄 Iniciando proceso de reserva...');

            // Paso 1: Crear o obtener paciente
            const patientId = await createOrGetPatient();

            // Paso 2: Crear el turno con formato correcto
            const appointmentData = {
                patientId: parseInt(patientId),
                doctorId: parseInt(selectedSlot.doctorId),
                clinicId: parseInt(selectedSlot.clinicId),
                appointmentDate: selectedSlot.date, // YYYY-MM-DD
                appointmentTime: selectedSlot.time, // HH:MM
                reason: patientInfo.reason.trim() || 'Consulta médica',
                duration: 30
            };

            console.log('📤 Creando turno con datos:', appointmentData);

            // Validar formato de fecha y hora
            if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentData.appointmentDate)) {
                throw new Error('Formato de fecha inválido: ' + appointmentData.appointmentDate);
            }

            if (!/^\d{2}:\d{2}$/.test(appointmentData.appointmentTime)) {
                throw new Error('Formato de hora inválido: ' + appointmentData.appointmentTime);
            }

            const response = await appointmentsService.create(appointmentData);
            console.log('✅ Turno creado exitosamente:', response.data);

            toast.success(`¡Turno reservado para el ${selectedSlot.dateFormatted} a las ${selectedSlot.time}!`);

            // Limpiar formulario
            setCurrentStep(1);
            setSelectedSlot(null);
            setPatientInfo({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phone: user?.phone || '',
                reason: ''
            });

            // Redirigir según el tipo de usuario
            setTimeout(() => {
                if (isAuthenticated && user?.role === 'patient') {
                    navigate('/patient/appointments');
                } else {
                    navigate('/');
                }
            }, 2000);

        } catch (error) {
            console.error('❌ Error completo:', error);
            console.error('📋 Response status:', error.response?.status);
            console.error('📋 Response data:', error.response?.data);

            // Determinar mensaje de error específico
            let errorMessage = 'Error al reservar el turno. Por favor intenta nuevamente.';

            if (error.response?.status === 400) {
                if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
                    const validationErrors = error.response.data.errors.map(err => err.message || err.msg).join(', ');
                    errorMessage = `Datos inválidos: ${validationErrors}`;
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.response?.status === 409) {
                errorMessage = 'El horario ya no está disponible. Por favor elige otro turno.';
                loadAvailableSlots(); // Recargar slots
            } else if (error.response?.status === 404) {
                errorMessage = 'Médico o clínica no encontrada. Por favor intenta nuevamente.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-900">Cargando turnos disponibles...</p>
                    <p className="text-gray-600 mt-2">Buscando los mejores horarios para ti</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => currentStep === 1 ? navigate('/') : setCurrentStep(1)}
                                className="mr-4 p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </button>

                            <div className="flex items-center">
                                <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <HeartSolid className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-3">
                                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                        Revis.ar
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Paso {currentStep} de 2
                            </div>
                            <div className="flex space-x-2">
                                <div className={`w-8 h-2 rounded-full transition-all duration-300 ${currentStep >= 1 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                                <div className={`w-8 h-2 rounded-full transition-all duration-300 ${currentStep >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentStep === 1 ? (
                    // Step 1: Select Appointment Slot
                    <div>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Elige tu <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">turno perfecto</span>
                            </h1>
                            <p className="text-xl text-gray-600">
                                {dateFilter === 'hoy' ? '🌟 Turnos disponibles para HOY' : 'Turnos disponibles listos para reservar'}
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar médico, especialidad o clínica..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    />
                                </div>

                                {/* Date Filter */}
                                <div className="relative">
                                    <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <select
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none transition-colors"
                                    >
                                        <option value="hoy">🌟 Hoy</option>
                                        <option value="manana">Mañana</option>
                                        <option value="proximos-3-dias">Próximos 3 días</option>
                                        <option value="proximos-7-dias">Próximos 7 días</option>
                                        <option value="proximos-14-dias">Próximas 2 semanas</option>
                                    </select>
                                </div>

                                {/* Results Count */}
                                <div className="flex items-center justify-center bg-emerald-50 rounded-xl px-4 py-3">
                                    <span className="text-emerald-700 font-medium">
                                        🎯 {filteredSlots.length} turnos disponibles
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Available Slots Grid */}
                        {filteredSlots.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        onClick={() => handleSlotSelect(slot)}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group relative overflow-hidden"
                                    >
                                        {/* HOY Badge */}
                                        {slot.isToday && (
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                HOY
                                            </div>
                                        )}

                                        {/* Gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                        <div className="relative z-10">
                                            {/* Doctor Info */}
                                            <div className="flex items-center mb-4">
                                                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-white font-bold text-sm">
                                                        {slot.doctorName.split(' ')[1]?.[0]}{slot.doctorName.split(' ')[2]?.[0]}
                                                    </span>
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                        {slot.doctorName}
                                                    </h3>
                                                    <p className="text-sm text-emerald-600 font-medium">{slot.specialty}</p>
                                                </div>
                                                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                                                    <StarSolid className="h-3 w-3 text-yellow-400" />
                                                    <span className="text-xs font-medium text-yellow-800 ml-1">{slot.rating}</span>
                                                </div>
                                            </div>

                                            {/* Date & Time - Prominente */}
                                            <div className={`rounded-xl p-4 mb-4 transition-all duration-300 ${slot.isToday
                                                    ? 'bg-gradient-to-r from-orange-50 to-red-50 group-hover:from-orange-100 group-hover:to-red-100'
                                                    : 'bg-gradient-to-r from-emerald-50 to-blue-50 group-hover:from-emerald-100 group-hover:to-blue-100'
                                                }`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <CalendarDaysIcon className={`h-5 w-5 mr-2 ${slot.isToday ? 'text-orange-600' : 'text-emerald-600'}`} />
                                                        <span className="text-sm font-medium text-gray-900 capitalize">
                                                            {slot.isToday ? 'Hoy' : slot.dateFormatted.split(',')[0]}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-600">
                                                        {slot.date}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <ClockIcon className={`h-6 w-6 mr-2 ${slot.isToday ? 'text-red-600' : 'text-blue-600'}`} />
                                                        <span className={`text-2xl font-bold ${slot.isToday ? 'text-red-600' : 'text-blue-600'}`}>
                                                            {slot.time}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-emerald-600">
                                                            ${slot.price.toLocaleString()}
                                                        </div>
                                                        <div className="text-xs text-gray-500">consulta</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Clinic Info */}
                                            <div className="flex items-start text-sm text-gray-600 mb-4">
                                                <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{slot.clinicName}</p>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{slot.clinicAddress}</p>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <button className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center group-hover:scale-105 transform shadow-lg ${slot.isToday
                                                    ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
                                                    : 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white'
                                                }`}>
                                                {slot.isToday ? '🚀 Reservar HOY' : 'Reservar este turno'}
                                                <ChevronRightIcon className="ml-2 h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
                                    <CalendarDaysIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        {dateFilter === 'hoy' ? 'No hay turnos disponibles para hoy' : 'No hay turnos disponibles'}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {dateFilter === 'hoy'
                                            ? 'Prueba buscando para mañana o los próximos días'
                                            : 'Intenta cambiar los filtros o buscar en otras fechas'
                                        }
                                    </p>
                                    <div className="space-y-3">
                                        {dateFilter === 'hoy' && (
                                            <button
                                                onClick={() => setDateFilter('manana')}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                                            >
                                                Ver turnos para mañana
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setDateFilter('proximos-7-dias');
                                            }}
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition-colors"
                                        >
                                            Limpiar filtros
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Step 2: Patient Information
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Confirma tu <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">reserva</span>
                            </h1>
                            <p className="text-xl text-gray-600">Solo faltan tus datos para completar la reserva</p>
                        </div>

                        {/* Selected Slot Summary */}
                        {selectedSlot && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900">Resumen del Turno</h3>
                                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${selectedSlot.isToday
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                        {selectedSlot.isToday ? '🌟 TURNO PARA HOY' : '✓ Seleccionado'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                                                <span className="text-white font-bold text-lg">
                                                    {selectedSlot.doctorName.split(' ')[1]?.[0]}{selectedSlot.doctorName.split(' ')[2]?.[0]}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-lg">{selectedSlot.doctorName}</p>
                                                <p className="text-emerald-600 font-medium">{selectedSlot.specialty}</p>
                                                <div className="flex items-center mt-1">
                                                    <StarSolid className="h-4 w-4 text-yellow-400 mr-1" />
                                                    <span className="text-sm text-gray-600">{selectedSlot.rating} • Especialista Certificado</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`rounded-xl p-4 ${selectedSlot.isToday ? 'bg-orange-50' : 'bg-gray-50'
                                            }`}>
                                            <div className="flex items-center mb-2">
                                                <CalendarDaysIcon className="h-5 w-5 text-gray-500 mr-2" />
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {selectedSlot.isToday ? 'HOY' : selectedSlot.dateFormatted}
                                                </p>
                                            </div>
                                            <div className="flex items-center">
                                                <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                                                <p className={`font-bold text-xl ${selectedSlot.isToday ? 'text-orange-600' : 'text-blue-600'
                                                    }`}>
                                                    {selectedSlot.time} hs
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <MapPinIcon className="h-5 w-5 text-gray-500 mr-2 mt-1" />
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedSlot.clinicName}</p>
                                                <p className="text-sm text-gray-600">{selectedSlot.clinicAddress}</p>
                                            </div>
                                        </div>

                                        <div className="bg-emerald-50 rounded-xl p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-emerald-700 font-medium">Costo de la consulta</p>
                                                    <p className="text-xs text-emerald-600">Pago en la clínica</p>
                                                </div>
                                                <p className="text-3xl font-bold text-emerald-600">
                                                    ${selectedSlot.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Patient Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Datos del Paciente</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={patientInfo.firstName}
                                        onChange={(e) => setPatientInfo({ ...patientInfo, firstName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="Tu nombre"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Apellido <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={patientInfo.lastName}
                                        onChange={(e) => setPatientInfo({ ...patientInfo, lastName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="Tu apellido"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={patientInfo.email}
                                        onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="tu@email.com"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Te enviaremos la confirmación aquí</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={patientInfo.phone}
                                        onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="+54 11 1234-5678"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Para recordatorios de la cita</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Motivo de la consulta (opcional)
                                </label>
                                <textarea
                                    value={patientInfo.reason}
                                    onChange={(e) => setPatientInfo({ ...patientInfo, reason: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    placeholder="Describe brevemente el motivo de tu consulta (opcional)..."
                                />
                            </div>

                            {/* Alert for TODAY appointments */}
                            {selectedSlot?.isToday && (
                                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <ClockIcon className="h-5 w-5 text-orange-600 mt-0.5" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-sm font-medium text-orange-800">
                                                Turno para HOY - {selectedSlot.time}
                                            </h4>
                                            <p className="text-sm text-orange-700 mt-1">
                                                Confirma tu asistencia lo antes posible. Te recomendamos llegar 15 minutos antes de la cita.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-6 rounded-xl font-medium transition-colors flex items-center justify-center"
                                >
                                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                    Cambiar Turno
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !patientInfo.firstName || !patientInfo.lastName || !patientInfo.email || !patientInfo.phone}
                                    className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg ${selectedSlot?.isToday
                                            ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white'
                                            : 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white'
                                        }`}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                            Confirmando turno...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                                            {selectedSlot?.isToday ? '🚀 Confirmar Turno HOY' : 'Confirmar Reserva'}
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    Al confirmar aceptas nuestros términos y condiciones
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}