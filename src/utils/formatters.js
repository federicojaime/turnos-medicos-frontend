import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date, pattern = 'dd/MM/yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, pattern, { locale: es });
};

export const formatDateTime = (date, time) => {
  if (!date || !time) return '';
  return `${formatDate(date, 'EEEE, d MMMM yyyy')} a las ${time}`;
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  // Formato: +54 9 11 1234-5678
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 13 && cleaned.startsWith('549')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 9)}-${cleaned.slice(9)}`;
  }
  return phone;
};

export const getStatusColor = (status) => {
  const colors = {
    scheduled: 'blue',
    confirmed: 'green',
    completed: 'gray',
    cancelled: 'red',
    no_show: 'orange',
  };
  return colors[status] || 'gray';
};

export const getStatusText = (status) => {
  const texts = {
    scheduled: 'Programado',
    confirmed: 'Confirmado',
    completed: 'Completado',
    cancelled: 'Cancelado',
    no_show: 'Inasistencia',
  };
  return texts[status] || status;
};