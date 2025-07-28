import * as yup from 'yup';

export const appointmentSchema = yup.object({
  patientId: yup.number().required('Paciente requerido'),
  doctorId: yup.number().required('Médico requerido'),
  clinicId: yup.number().required('Clínica requerida'),
  appointmentDate: yup.date().min(new Date(), 'Fecha debe ser futura').required('Fecha requerida'),
  appointmentTime: yup.string().required('Hora requerida'),
  reason: yup.string().max(500, 'Máximo 500 caracteres'),
});

export const patientSchema = yup.object({
  userId: yup.number().required('Usuario requerido'),
  birthDate: yup.date().max(new Date(), 'Fecha no puede ser futura'),
  gender: yup.string().oneOf(['M', 'F', 'Other']),
  emergencyContactPhone: yup.string().matches(/^[\+]?[0-9\s\-\(\)]+$/, 'Teléfono inválido'),
});

export const loginSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
});