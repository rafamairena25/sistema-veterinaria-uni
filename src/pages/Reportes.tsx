import { useState, useEffect } from 'react';

interface AtencionReciente {
  mascota: string;
  especie: string;
  servicio_aplicado: string;
  fecha: string;
  costo: number;
}

interface Estadisticas {
  ingresosMensuales: number;
  pacientesAtendidos: number;
  citasCompletadas: string;
  historialReciente: AtencionReciente[];
}

export default function Reportes() {
  const [stats, setStats] = useState<Estadisticas>({
    ingresosMensuales: 0,
    pacientesAtendidos: 0,
    citasCompletadas: '0%',
    historialReciente: []
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerReportesBD() {
      try {
        const response = await fetch('https://veterinaria-backend-vy1q.onrender.com/api/reportes/estadisticas');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error al obtener reportes desde la BD:', error);
      }
      setCargando(false);
    }
    obtenerReportesBD();
  }, []);

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800">Módulo de Reportes y Estadísticas</h2>
          <p className="text-sm text-gray-500">Resumen analítico e histórico de las atenciones brindadas en el centro veterinario.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
            🌐 Datos en vivo desde PostgreSQL
          </span>
          <button 
            onClick={handleImprimir}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
          >
            🖨️ Exportar / Imprimir
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="p-12 text-center text-blue-600 font-medium text-sm animate-pulse bg-white rounded-xl border border-gray-100 shadow-sm">
          Calculando métricas y estadísticas desde la nube...
        </div>
      ) : (
        <>
          {/* Tarjetas de Métricas Clave */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-1">
              <p className="text-xs font-semibold text-blue-600">Total Ingresos Estimados</p>
              <p className="text-2xl font-bold text-gray-900">${stats.ingresosMensuales.toFixed(2)}</p>
              <p className="text-[11px] text-gray-400">Calculado en tiempo real desde la BD</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-1">
              <p className="text-xs font-semibold text-emerald-600">Pacientes Atendidos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pacientesAtendidos} Mascotas</p>
              <p className="text-[11px] text-gray-400">Expedientes activos en el sistema</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-1">
              <p className="text-xs font-semibold text-purple-600">Citas Completadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.citasCompletadas}</p>
              <p className="text-[11px] text-gray-400">Flujo operativo sin ausentismo</p>
            </div>
          </div>

          {/* Tabla de Historial de Atenciones */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">Historial Reciente de Atenciones Médicas</h3>
            
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs">
                  <th className="pb-3 font-semibold">Mascota</th>
                  <th className="pb-3 font-semibold">Especie</th>
                  <th className="pb-3 font-semibold">Servicio Aplicado</th>
                  <th className="pb-3 font-semibold">Fecha</th>
                  <th className="pb-3 font-semibold text-right">Costo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-600">
                {stats.historialReciente.length > 0 ? (
                  stats.historialReciente.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50">
                      <td className="py-3 font-medium text-gray-800">{item.mascota}</td>
                      <td className="py-3 text-gray-500">{item.especie}</td>
                      <td className="py-3">{item.servicio_aplicado}</td>
                      <td className="py-3 text-gray-500">{item.fecha}</td>
                      <td className="py-3 font-semibold text-emerald-600 text-right">${Number(item.costo).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                      No hay atenciones médicas registradas recientemente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}