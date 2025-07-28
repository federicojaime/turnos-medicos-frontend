import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { GENDER_OPTIONS, BLOOD_TYPES } from '../../utils/constants';
import { patientsService } from '../../api/services/patients';

const schema = yup.object({
  firstName: yup.string().required('Nombre requerido'),
  lastName: yup.string().required('Apellido requerido'),
  email: yup.string().email('Email inválido').required('Email requerido'),
  phone: yup.string().required('Teléfono requerido'),
  birthDate: yup.date().max(new Date(), 'Fecha no puede ser futura'),
  gender: yup.string().oneOf(['M', 'F', 'Other']),
  bloodType: yup.string(),
  emergencyContactName: yup.string(),
  emergencyContactPhone: yup.string(),
  insuranceProvider: yup.string(),
  insuranceNumber: yup.string(),
});

export default function PatientForm({ onSuccess, initialData = null }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data) => {
    try {
      if (initialData) {
        await patientsService.update(initialData.id, data);
        toast.success('Paciente actualizado exitosamente');
      } else {
        await patientsService.create(data);
        toast.success('Paciente creado exitosamente');
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre"
          placeholder="Nombre del paciente"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        
        <Input
          label="Apellido"
          placeholder="Apellido del paciente"
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
        
        <Input
          label="Fecha de Nacimiento"
          type="date"
          error={errors.birthDate?.message}
          {...register('birthDate')}
        />
        
        <Select
          label="Género"
          options={GENDER_OPTIONS}
          error={errors.gender?.message}
          {...register('gender')}
        />
        
        <Select
          label="Tipo de Sangre"
          options={BLOOD_TYPES.map(type => ({ value: type, label: type }))}
          error={errors.bloodType?.message}
          {...register('bloodType')}
        />
        
        <Input
          label="Obra Social"
          placeholder="OSDE, Swiss Medical, etc."
          error={errors.insuranceProvider?.message}
          {...register('insuranceProvider')}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Contacto de Emergencia"
          placeholder="Nombre completo"
          error={errors.emergencyContactName?.message}
          {...register('emergencyContactName')}
        />
        
        <Input
          label="Teléfono de Emergencia"
          placeholder="+54 11 1234-5678"
          error={errors.emergencyContactPhone?.message}
          {...register('emergencyContactPhone')}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={() => onSuccess?.()}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? 'Actualizar' : 'Crear'} Paciente
        </Button>
      </div>
    </form>
  );
}