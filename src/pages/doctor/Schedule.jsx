import { useState, useEffect } from 'react';
import { ClockIcon, PlusIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { doctorsService } from '../../api/services/doctors';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import { DAYS_OF_WEEK } from '../../utils/constants';

export default function DoctorSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    isActive: true
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      // TODO: Get doctorId from auth store
      const response = await doctorsService.getSchedules(1);
      setSchedules(response.data.data || []);
    } catch (error) {
      console.error('Error loading schedules:', error);
      // Datos de fallback
      setSchedules([
        {
          id: 1,
          dayOfWeek: 1,
          dayName: 'Lunes',
          startTime: '08:00',
          endTime: '12:00',
          isActive: true
        },
        {
          id: 2,
          dayOfWeek: 1,
          dayName: 'Lunes',
          startTime: '14:00',
          endTime: '18:00',
          isActive: true
        },
        {
          id: 3,
          dayOfWeek: 2,
          dayName: 'Martes',
          startTime: '08:00',
          endTime: '16:00',
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const scheduleData = {
        schedules: editingSchedule 
          ? schedules.map(s => s.id === editingSchedule.id ? { ...formData, id: editingSchedule.id } : s)
          : [...schedules, formData]
      };

      // TODO: Get doctorId from auth store
      await doctorsService.updateSchedules(1, scheduleData.schedules);
      
      toast.success(editingSchedule ? 'Horario actualizado' : 'Horario agregado');
      setShowForm(false);
      setEditingSchedule(null);
      resetForm();
      loadSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isActive: schedule.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (scheduleId) => {
    if (!confirm('¿Estás seguro de eliminar este horario?')) return;
    
    try {
      const updatedSchedules = schedules.filter(s => s.id !== scheduleId);
      await doctorsService.updateSchedules(1, updatedSchedules);
      toast.success('Horario eliminado');
      loadSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      isActive: true
    });
  };

  const getDayName = (dayOfWeek) => {
    const day = DAYS_OF_WEEK.find(d => d.value === dayOfWeek);
    return day ? day.label : dayOfWeek;
  };

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const day = getDayName(schedule.dayOfWeek);
    if (!acc[day]) acc[day] = [];
    acc[day].push(schedule);
    return acc;
  }, {});

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Horarios</h1>
            <p className="text-gray-600">Gestiona tu disponibilidad semanal</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setEditingSchedule(null);
              setShowForm(true);
            }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Agregar Horario
          </Button>
        </div>

        {/* Vista Semanal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day.value} className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-600" />
                {day.label}
              </h3>
              
              <div className="space-y-3">
                {groupedSchedules[day.label]?.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      schedule.isActive 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm font-medium">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(schedule)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(schedule.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        schedule.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {schedule.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Sin horarios configurados
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Formulario */}
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingSchedule(null);
            resetForm();
          }}
          title={editingSchedule ? 'Editar Horario' : 'Nuevo Horario'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Día de la Semana"
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
              options={DAYS_OF_WEEK}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Hora Inicio"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
              
              <Input
                label="Hora Fin"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Horario activo
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingSchedule(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingSchedule ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}