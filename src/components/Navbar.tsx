import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-blue-600 text-white'
      : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 print:hidden">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo / Nombre del Sistema */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <span>🐾</span> VetControl
        </Link>

        {/* Enlaces de Navegación */}
        <div className="flex gap-2 items-center">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/')}`}
          >
            Inicio
          </Link>
          <Link
            to="/expedientes"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/expedientes')}`}
          >
            Expedientes
          </Link>
          <Link
            to="/citas"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/citas')}`}
          >
            Citas
          </Link>
          <Link
            to="/catalogos"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/catalogos')}`}
          >
            Catálogos
          </Link>

          {/* Reportes solo visible para Administradores */}
          {(() => {
            const userStr = localStorage.getItem('vet_user');
            const user = userStr ? JSON.parse(userStr) : null;
            if (user && (user.rol === 'ADMIN' || user.role === 'ADMIN')) {
              return (
                <Link
                  to="/reportes"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/reportes')}`}
                >
                  Reportes
                </Link>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </nav>
  );
}