export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY: '/auth/verify',
  
  // Clinics
  CLINICS: '/clinics',
  CLINIC_BY_ID: (id) => `/clinics/${id}`,
  CLINIC_STATS: (id) => `/clinics/${id}/stats`,
  CITIES: '/clinics/cities',
  
  // Doctors
  DOCTORS: '/doctors',
  DOCTOR_BY_ID: (id) => `/doctors/${id}`,
  DOCTOR_SCHEDULES: (id) => `/doctors/${id}/schedules`,
  SPECIALTIES: '/doctors/specialties',
  
  // Patients
  PATIENTS: '/patients',
  PATIENT_BY_ID: (id) => `/patients/${id}`,
  PATIENT_HISTORY: (id) => `/patients/${id}/history`,
  PATIENT_UPCOMING: (id) => `/patients/${id}/upcoming`,
  
  // Appointments
  APPOINTMENTS: '/appointments',
  APPOINTMENT_BY_ID: (id) => `/appointments/${id}`,
  APPOINTMENT_CONFIRM: (id) => `/appointments/${id}/confirm`,
  APPOINTMENT_CANCEL: (id) => `/appointments/${id}/cancel`,
  APPOINTMENT_COMPLETE: (id) => `/appointments/${id}/complete`,
  AVAILABILITY: (doctorId, date) => `/appointments/availability/${doctorId}/${date}`,
  TODAY_APPOINTMENTS: '/appointments/today',
  APPOINTMENT_STATS: '/appointments/stats',
};