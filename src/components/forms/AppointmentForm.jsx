import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import apiClient from '../../api/client';
import { ENDPOINTS } from '../../api/endpoints';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const schema = yup.object({
  patientId: yup.number().required('Paciente requerido'),
  doctorId: yup.number().required('Médico requerido'),
  clinicId: yup.number().required('Clínica requerida'),
  appointmentDate: yup.date().min(new Date(), 'Fecha debe ser futura').required('Fecha requerida'),
  appointmentTime: yup.string().required('Hora requerida'),
  reason: yup.string().max(500, 'Máximo 500 caracteres'),
});

export default function AppointmentForm({ onSuccess, initialData = null }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {},
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
      const [patientsRes, doctorsRes, clinicsRes] = await Promise.all([
        apiClient.get(ENDPOINTS.PATIENTS),
        apiClient.get(ENDPOINTS.DOCTORS),
        apiClient.get(ENDPOINTS.CLINICS),
      ]);

      setPatients(patientsRes.data.data);
      setDoctors(doctorsRes.data.data);
      setClinics(clinicsRes.data.data);
    } catch (error) {
      toast.error('Error cargando datos');
    }
  };

  const loadAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await apiClient.get(
        ENDPOINTS.AVAILABILITY(selectedDoctor, selectedDate)
      );
      setAvailableSlots(response.data.data.available_slots || []);
    } catch (error) {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await apiClient.put(ENDPOINTS.APPOINTMENT_BY_ID(initialData.id), data);
        toast.success('Turno actualizado exitosamente');
      } else {
        await apiClient.post(ENDPOINTS.APPOINTMENTS, data);
        toast.success('Turno creado exitosamente');
      }
      onSuccess?.();
    } catch (error) {
      // Error manejado por interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="patientId"
          control={control}
          render={({ field }) => (
            <Select
              label="Paciente"
              error={errors.patientId?.message}
              {...field}
              options={patients.map(p => ({
                value: p.id,
                label: `${p.first_name} ${p.last_name} - ${p.email}`
              }))}
              placeholder="Seleccionar paciente..."
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
                label: `Dr. ${d.first_name} ${d.last_name} - ${d.specialty_name}`
              }))}
              placeholder="Seleccionar médico..."
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
              placeholder={loadingSlots ? "Cargando horarios..." : "Seleccionar hora..."}
              disabled={!selectedDoctor || !selectedDate || loadingSlots}
            />
          )}
        />
      </div>

      <Input
        label="Motivo de la Consulta"
        placeholder="Describe el motivo de la consulta..."
        error={errors.reason?.message}
        {...register('reason')}
      />

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={() => onSuccess?.()}>
          Cancelar
        </Button>
        <Button type="submit" loading={isLoading}>
          {initialData ? 'Actualizar' : 'Crear'} Turno
        </Button>
      </div>
    </form>
  );
}