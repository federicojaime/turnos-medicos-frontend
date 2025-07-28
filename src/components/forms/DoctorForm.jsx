import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { doctorsService } from '../../api/services/doctors';
import { clinicsService } from '../../api/services/clinics';

const schema = yup.object({
  firstName: yup.string().required('Nombre requerido'),
  lastName: yup.string().required('Apellido requerido'),
  email: yup.string().email('Email inválido').required('Email requerido'),
  phone: yup.string().required('Teléfono requerido'),
  clinicId: yup.number().required('Clínica requerida'),
  specialtyId: yup.number().required('Especialidad requerida'),
  licenseNumber: yup.string().required('Número de matrícula requerido'),
  consultationDuration: yup.number().min(15, 'Mínimo 15 minutos').max(120, 'Máximo 120 minutos').required('Duración requerida'),
});

export default function DoctorForm({ onSuccess, initialData = null }) {
  const [specialties, setSpecialties] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || { consultationDuration: 30 },
  });

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [specialtiesRes, clinicsRes] = await Promise.all([
        doctorsService.getSpecialties(),
        clinicsService.getAll(),
      ]);

      setSpecialties(specialtiesRes.data.data || []);
      setClinics(clinicsRes.data.data || []);
    } catch (error) {
      console.error('Error loading options:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (initialData) {
        await doctorsService.update(initialData.id, data);
        toast.success('Médico actualizado exitosamente');
      } else {
        await doctorsService.create(data);
        toast.success('Médico creado exitosamente');
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre"
          placeholder="Nombre del médico"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        
        <Input
          label="Apellido"
          placeholder="Apellido del médico"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        
        <Input
          label="Email"
          type="email"
          placeholder="email@ejemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />
        
        <Input
          label="Teléfono"
          placeholder="+54 11 1234-5678"
          error={errors.phone?.message}
          {...register('phone')}
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
                label: c.name
              }))}
              placeholder="Seleccionar clínica..."
            />
          )}
        />
        
        <Controller
          name="specialtyId"
          control={control}
          render={({ field }) => (
            <Select
              label="Especialidad"
              error={errors.specialtyId?.message}
              {...field}
              options={specialties.map(s => ({
                value: s.id,
                label: s.name
              }))}
              placeholder="Seleccionar especialidad..."
            />
          )}
        />
        
        <Input
          label="Número de Matrícula"
          placeholder="MP123456"
          error={errors.licenseNumber?.message}
          {...register('licenseNumber')}
        />
        
        <Input
          label="Duración Consulta (minutos)"
          type="number"
          min="15"
          max="120"
          placeholder="30"
          error={errors.consultationDuration?.message}
          {...register('consultationDuration')}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={() => onSuccess?.()}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? 'Actualizar' : 'Crear'} Médico
        </Button>
      </div>
    </form>
  );
}