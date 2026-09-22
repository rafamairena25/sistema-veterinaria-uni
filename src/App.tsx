import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expedientes from './pages/Expedientes';
import Citas from './pages/Citas';
import Catalogos from './pages/Catalogos';
import Reportes from './pages/Reportes';

export default function App() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [vista, setVista] = useState('inicio');

  // Estados para el formulario de Reserva Web (CUN-03)
  const [mascotasCliente, setMascotasCliente] = useState<any[]>([]);
  const [mascotaReserva, setMascotaReserva] = useState('');
  const [servicioReserva, setServicioReserva]  = useState('Consulta General');
  const [fechaReserva, setFechaReserva] = useState('');
  const [horaReserva, setHoraReserva] = useState('');

  useEffect(() => {
    // 1. Cargar el usuario
    const storedUser = localStorage.getItem('vet_user');
    let currentUser: { name: string; role: string } | null = null;
    
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      setUser(currentUser);
      if (currentUser?.role === 'cliente') {
        setVista('reserva');
      } else {
        setVista('inicio');
      }
    }

    // 2. Cargar todas las mascotas de los expedientes
    const expedientesGuardados = localStorage.getItem('vet_expedientes');
    if (expedientesGuardados) {
      const expedientes = JSON.parse(expedientesGuardados);
      setMascotasCliente(expedientes);
      
      if (expedientes.length > 0) {
        const m = expedientes[0];
        const nombreMascota = m.nombre || m.name || m.mascota || m.paciente || 'Mascota';
        const razaMascota = m.raza || m.breed || '';
        setMascotaReserva(razaMascota ? `${nombreMascota} (${razaMascota})` : nombreMascota);
      } else {
        setMascotaReserva('');
      }
    } else {
      const datosPrueba = [
        { mascota: 'Max', raza: 'Golden Retriever', propietario: 'Admin' },
        { mascota: 'Luna', raza: 'Siamés', propietario: 'Admin' }
      ];
      setMascotasCliente(datosPrueba);
      setMascotaReserva('Max (Golden Retriever)');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('vet_user');
    setUser(null);
  };

  const handleConfirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mascotaReserva || !fechaReserva || !horaReserva) {
      alert('Por favor completa todos los campos (mascota, fecha y hora).');
      return;
    }

    const nuevaCita = {
      id: Date.now().toString(),
      mascota: mascotaReserva,
      fecha: fechaReserva,
      hora: horaReserva,
      motivo: servicioReserva,
      estado: 'Programada (Web)'
    };

    // Guardar en localStorage para que el Dashboard y el módulo de citas lo detecten
    const citasActuales = JSON.parse(localStorage.getItem('vet_citas') || '[]');
    const nuevasCitas = [nuevaCita, ...citasActuales];
    localStorage.setItem('vet_citas', JSON.stringify(nuevasCitas));
    localStorage.setItem('citas', JSON.stringify(nuevasCitas));

    alert(`¡Cita confirmada con éxito para ${mascotaReserva} (${servicioReserva}) el ${fechaReserva} a las ${horaReserva}!`);
    
    // Limpiar campos de fecha y hora
    setFechaReserva('');
    setHoraReserva('');
  };

  if (!user) {
    return <Login onLoginSuccess={(u) => {
      setUser(u);
      const expedientesGuardados = localStorage.getItem('vet_expedientes');
      if (expedientesGuardados) {
        const expedientes = JSON.parse(expedientesGuardados);
        setMascotasCliente(expedientes);
        if (expedientes.length > 0) {
          const m = expedientes[0];
          const nombreMascota = m.nombre || m.name || m.mascota || m.paciente || 'Mascota';
          const razaMascota = m.raza || m.breed || '';
          setMascotaReserva(razaMascota ? `${nombreMascota} (${razaMascota})` : nombreMascota);
        } else {
          setMascotaReserva('');
        }
      }

      if (u.role === 'cliente') {
        setVista('reserva');
      } else {
        setVista('inicio');
      }
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra de Navegación Superior */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center shadow-xs">
        <div className="flex items-center space-x-6">
          <span className="font-bold text-gray-800 text-lg">VetControl</span>
          
          <nav className="flex space-x-2 text-sm font-medium">
            {user.role === 'cliente' ? (
              <button 
                onClick={() => setVista('reserva')} 
                className={`px-3 py-1.5 rounded-lg transition ${vista === 'reserva' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Mi Reserva Web
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setVista('inicio')} 
                  className={`px-3 py-1.5 rounded-lg transition ${vista === 'inicio' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Inicio
                </button>

                <button 
                  onClick={() => setVista('expedientes')} 
                  className={`px-3 py-1.5 rounded-lg transition ${vista === 'expedientes' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Expedientes
                </button>

                <button 
                  onClick={() => setVista('citas')} 
                  className={`px-3 py-1.5 rounded-lg transition ${vista === 'citas' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Citas
                </button>

                {(user.role === 'admin' || user.role === 'veterinario') && (
                  <button 
                    onClick={() => setVista('catalogos')} 
                    className={`px-3 py-1.5 rounded-lg transition ${vista === 'catalogos' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Catálogos
                  </button>
                )}

                {user.role === 'admin' && (
                  <button 
                    onClick={() => setVista('reportes')} 
                    className={`px-3 py-1.5 rounded-lg transition ${vista === 'reportes' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Reportes
                  </button>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Datos de Usuario y Cerrar Sesión */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-800">{user.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-blue-600 font-medium">Rol: {user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="border border-red-200 text-red-600 hover:bg-red-50 text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Dinámico Principal */}
      <main className="flex-1 p-6">
        {vista === 'inicio' && <Dashboard onNavigate={(nuevaVista) => setVista(nuevaVista)} />}

        {vista === 'expedientes' && <Expedientes />}

        {vista === 'citas' && <Citas />}

        {vista === 'catalogos' && <Catalogos />}

        {vista === 'reportes' && user.role === 'admin' && <Reportes />}

        {vista === 'reserva' && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Portal de Clientes: Reserva Web (CUN-03)</h2>
            <p className="text-sm text-gray-600">Formulario simplificado para que los propietarios agenden citas para sus mascotas.</p>
            
            <form onSubmit={handleConfirmarReserva} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Seleccionar Mascota</label>
                <select 
                  value={mascotaReserva}
                  onChange={(e) => setMascotaReserva(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                >
                  {mascotasCliente.length === 0 && (
                    <option value="">No hay mascotas registradas</option>
                  )}
                  {mascotasCliente.map((m, index) => {
                    const nombreMascota = m.nombre || m.name || m.mascota || m.paciente || `Mascota ${index + 1}`;
                    const razaMascota = m.raza || m.breed || '';
                    const textoOpcion = razaMascota ? `${nombreMascota} (${razaMascota})` : nombreMascota;

                    return (
                      <option key={index} value={textoOpcion}>
                        {textoOpcion}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Servicio Requerido</label>
                <select 
                  value={servicioReserva}
                  onChange={(e) => setServicioReserva(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                >
                  <option value="Consulta General">Consulta General</option>
                  <option value="Vacunación">Vacunación</option>
                  <option value="Desparasitación">Desparasitación</option>
                  <option value="Peluquería y Estética">Peluquería y Estética</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de la Cita</label>
                <input 
                  type="date"
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hora de la Cita</label>
                <input 
                  type="time"
                  value={horaReserva}
                  onChange={(e) => setHoraReserva(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                  required
                />
              </div>

              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
              >
                Confirmar Cita
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}