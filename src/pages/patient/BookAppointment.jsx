import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { doctorsService } from '../../api/services/doctors';
import { clinicsService } from '../../api/services/clinics';
import { appointmentsService } from '../../api/services/appointments';

const schema = yup.object({
  doctorId: yup.number().required('Médico requerido'),
  clinicId: yup.number().required('Clínica requerida'),
  appointmentDate: yup.date().min(new Date(), 'Fecha debe ser futura').required('Fecha requerida'),
  appointmentTime: yup.string().required('Hora requerida'),
  reason: yup.string().max(500, 'Máximo 500 caracteres').required('Motivo requerido'),
});

export default function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedDoctor = watch('doctorId');
  const selectedDate = watch('appointmentDate');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const loadInitialData = async () => {
    try {
      const [specialtiesRes, clinicsRes] = await Promise.all([
        doctorsService.getSpecialties(),
        clinicsService.getAll(),
      ]);

      setSpecialties(specialtiesRes.data.data || []);
      setClinics(clinicsRes.data.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadDoctorsBySpecialty = async (specialtyId) => {
    try {
      const response = await doctorsService.getAll({ specialtyId });
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const response = await appointmentsService.getAvailability(selectedDoctor, selectedDate);
      setAvailableSlots(response.data.data.available_slots || []);
    } catch (error) {
      setAvailableSlots([]);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await appointmentsService.create({
        ...data,
        patientId: 1, // TODO: Get from auth store
      });
      toast.success('Turno reservado exitosamente');
      navigate('/patient/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Reservar Turno</h1>
            <p className="text-gray-600 mt-2">Completa los datos para reservar tu cita médica</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Especialidad"
                options={specialties.map(s => ({ value: s.id, label: s.name }))}
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  if (e.target.value) {
                    loadDoctorsBySpecialty(e.target.value);
                  }
                }}
                placeholder="Seleccionar especialidad..."
              />

              <Controller
                name="doctorId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Médico"
                    error={errors.doctorId?.message}
                    {...field}
                    options={doctors.map(d => ({
                      value: d.id,
                      label: `Dr. ${d.first_name} ${d.last_name}`
                    }))}
                    placeholder="Seleccionar médico..."
                    disabled={!selectedSpecialty}
                  />
                )}
              />

              <Controller
                name="clinicId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Clínica"
                    error={errors.clinicId?.message}
                    {...field}
                    options={clinics.map(c => ({
                      value: c.id,
                      label: `${c.name} - ${c.city}`
                    }))}
                    placeholder="Seleccionar clínica..."
                  />
                )}
              />

              <Input
                label="Fecha del Turno"
                type="date"
                error={errors.appointmentDate?.message}
                min={new Date().toISOString().split('T')[0]}
                {...register('appointmentDate')}
              />

              <Controller
                name="appointmentTime"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Hora del Turno"
                    error={errors.appointmentTime?.message}
                    {...field}
                    options={availableSlots.map(slot => ({
                      value: slot.time,
                      label: slot.time
                    }))}
                    placeholder="Seleccionar hora..."
                    disabled={!selectedDoctor || !selectedDate}
                  />
                )}
              />
            </div>

            <Input
              label="Motivo de la Consulta"
              placeholder="Describe el motivo de tu consulta..."
              error={errors.reason?.message}
              {...register('reason')}
            />

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/patient')}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading}>
                Reservar Turno
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}