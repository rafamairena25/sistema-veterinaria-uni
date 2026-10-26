import { useState, useEffect } from 'react';

interface Cita {
  id_cita?: number | string;
  id?: string;
  mascota?: string;
  paciente?: string;
  nombre?: string;
  fecha_cita?: string;
  fecha?: string;
  hora?: string;
  motivo_servicio?: string;
  motivo?: string;
  estado?: string;
  [key: string]: any;
}

interface DashboardProps {
  onNavigate?: (vista: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [totalExpedientes, setTotalExpedientes] = useState(0);
  const [citasPendientes, setCitasPendientes] = useState(0);
  const [totalEspecies, setTotalEspecies] = useState(0);
  const [todasLasCitas, setTodasLasCitas] = useState<Cita[]>([]);

  useEffect(() => {
    // 1. Cargar total de expedientes desde el Backend
    const fetchExpedientes = async () => {
      try {
        const response = await fetch('https://veterinaria-backend-vy1q.onrender.com/api/expedientes');
        if (response.ok) {
          const data = await response.json();
          setTotalExpedientes(data.length);
        }
      } catch (e) {
        console.error('Error al cargar expedientes en el dashboard:', e);
      }
    };

    // 2. Cargar citas desde el Backend de PostgreSQL
    const fetchCitas = async () => {
      try {
        const response = await fetch('https://veterinaria-backend-vy1q.onrender.com/api/citas');
        if (response.ok) {
          const data = await response.json();
          setTodasLasCitas(data);
          setCitasPendientes(data.length);
        }
      } catch (e) {
        console.error('Error al cargar citas en el dashboard:', e);
      }
    };

    // 3. Especies (Mantenemos respaldo en localStorage por si acaso)
    const esp = localStorage.getItem('vet_especies');
    if (esp) {
      try { setTotalEspecies(JSON.parse(esp).length); } catch (e) { console.error(e); }
    }

    fetchExpedientes();
    fetchCitas();
  }, []);

  const irA = (vista: string) => {
    if (onNavigate) {
      onNavigate(vista);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-800">Panel Principal</h1>
        <p className="text-gray-500">Bienvenido al Sistema de Control e Historial Clínico Veterinario</p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Expedientes Registrados</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-1">{totalExpedientes}</h2>
          </div>
          <span className="text-3xl">🐶</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total de Citas Registradas</p>
            <h2 className="text-3xl font-bold text-green-600 mt-1">{citasPendientes}</h2>
          </div>
          <span className="text-3xl">📅</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Especies en Catálogo</p>
            <h2 className="text-3xl font-bold text-purple-600 mt-1">{totalEspecies}</h2>
          </div>
          <span className="text-3xl">🧪</span>
        </div>
      </div>

      {/* Listado Directo de Citas Registradas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Citas Agendadas Recientemente</h2>
          <button 
            onClick={() => irA('citas')} 
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
          >
            + Ir a Módulo de Citas
          </button>
        </div>

        {todasLasCitas.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
            No hay citas registradas todavía en la base de datos. Agrega una desde la pestaña <strong>Citas</strong>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Mascota / Paciente</th>
                  <th className="py-3 px-4 font-semibold">Fecha y Hora</th>
                  <th className="py-3 px-4 font-semibold">Motivo / Servicio</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {todasLasCitas.map((cita, index) => {
                  const nombreMascota = cita.mascota || cita.nombre_mascota || cita.paciente || 'Paciente';
                  const fechaCompleta = cita.fecha_cita ? new Date(cita.fecha_cita).toLocaleString() : (cita.fecha || 'Pendiente');
                  const motivoCita = cita.motivo_servicio || cita.motivo || 'Consulta General';
                  const estadoCita = cita.estado || 'Programada';

                  return (
                    <tr key={cita.id_cita || cita.id || index} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-4 font-medium text-gray-800">{nombreMascota}</td>
                      <td className="py-3 px-4 text-gray-600">{fechaCompleta}</td>
                      <td className="py-3 px-4 text-gray-600">{motivoCita}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                          {estadoCita}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Accesos Rápidos */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div onClick={() => irA('expedientes')} className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition cursor-pointer group">
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">Registrar Expedientes →</h3>
            <p className="text-xs text-gray-500 mt-1">Alta de mascotas, razas y datos de propietarios.</p>
          </div>

          <div onClick={() => irA('citas')} className="p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50/50 transition cursor-pointer group">
            <h3 className="font-semibold text-gray-800 group-hover:text-green-600">Agendar Citas →</h3>
            <p className="text-xs text-gray-500 mt-1">Programación de consultas clínicas y vacunas.</p>
          </div>

          <div onClick={() => irA('catalogos')} className="p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50/50 transition cursor-pointer group">
            <h3 className="font-semibold text-gray-800 group-hover:text-purple-600">Administrar Catálogos →</h3>
            <p className="text-xs text-gray-500 mt-1">Mantenimiento de especies y parámetros base.</p>
          </div>
        </div>
      </div>
    </div>
  );
}