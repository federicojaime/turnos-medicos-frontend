import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  HomeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';

const getNavigationItems = (role) => {
  const baseItems = [
    { name: 'Dashboard', href: `/${role}`, icon: HomeIcon },
  ];

  switch (role) {
    case 'admin':
      return [
        ...baseItems,
        { name: 'Turnos', href: '/admin/appointments', icon: CalendarDaysIcon },
        { name: 'Pacientes', href: '/admin/patients', icon: UserGroupIcon },
        { name: 'Médicos', href: '/admin/doctors', icon: UserIcon },
        { name: 'Clínicas', href: '/admin/clinics', icon: BuildingOfficeIcon },
        { name: 'Estadísticas', href: '/admin/stats', icon: ChartBarIcon },
        { name: 'Configuración', href: '/admin/settings', icon: CogIcon },
      ];
    
    case 'doctor':
      return [
        ...baseItems,
        { name: 'Mis Turnos', href: '/doctor/appointments', icon: CalendarDaysIcon },
        { name: 'Pacientes', href: '/doctor/patients', icon: UserGroupIcon },
        { name: 'Horarios', href: '/doctor/schedule', icon: CogIcon },
      ];
    
    case 'patient':
      return [
        ...baseItems,
        { name: 'Mis Turnos', href: '/patient/appointments', icon: CalendarDaysIcon },
        { name: 'Nuevo Turno', href: '/patient/appointments/new', icon: CalendarDaysIcon },
        { name: 'Historial', href: '/patient/history', icon: ChartBarIcon },
        { name: 'Mi Perfil', href: '/patient/profile', icon: UserIcon },
      ];
    
    default:
      return baseItems;
  }
};

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const navigation = getNavigationItems(user?.role);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          <span className="ml-2 text-lg font-semibold text-gray-900">
            Turnos Médicos
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-9 w-9 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-2 w-full text-left text-sm text-gray-500 hover:text-gray-700"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}