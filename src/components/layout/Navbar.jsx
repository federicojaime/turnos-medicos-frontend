import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuthStore();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={onMenuClick}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-900">
                {getPageTitle(window.location.pathname)}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
              <BellIcon className="h-6 w-6" />
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPageTitle(pathname) {
  const titles = {
    '/admin': 'Dashboard Administrativo',
    '/admin/appointments': 'Gestión de Turnos',
    '/admin/patients': 'Gestión de Pacientes',
    '/admin/doctors': 'Gestión de Médicos',
    '/admin/clinics': 'Gestión de Clínicas',
    '/doctor': 'Dashboard Médico',
    '/doctor/appointments': 'Mis Turnos',
    '/doctor/patients': 'Mis Pacientes',
    '/patient': 'Mi Dashboard',
    '/patient/appointments': 'Mis Turnos',
    '/patient/appointments/new': 'Nuevo Turno',
  };
  return titles[pathname] || 'Sistema de Turnos';
}