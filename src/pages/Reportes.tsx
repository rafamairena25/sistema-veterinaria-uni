export default function Reportes() {
  const atencionesRecientes = [
    { id: 1, mascota: 'Max', especie: 'Canino', servicio: 'Consulta General', fecha: '31/08/2026', costo: '$20' },
    { id: 2, mascota: 'Luna', especie: 'Felino', servicio: 'Vacunación (Rabia)', fecha: '30/08/2026', costo: '$15' },
    { id: 3, mascota: 'Rocky', especie: 'Canino', servicio: 'Desparasitación', fecha: '29/08/2026', costo: '$12' },
    { id: 4, mascota: 'Mila', especie: 'Felino', servicio: 'Baño y Corte', fecha: '28/08/2026', costo: '$18' }
  ];

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
        <button 
          onClick={handleImprimir}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
        >
          🖨️ Exportar / Imprimir
        </button>
      </div>

      {/* Tarjetas de Métricas Clave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-1">
          <p className="text-xs font-semibold text-blue-600">Total Ingresos del Mes</p>
          <p className="text-2xl font-bold text-gray-900">$1,450.00</p>
          <p className="text-[11px] text-gray-400">+12% en comparación al mes anterior</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-1">
          <p className="text-xs font-semibold text-emerald-600">Pacientes Atendidos</p>
          <p className="text-2xl font-bold text-gray-900">68 Mascotas</p>
          <p className="text-[11px] text-gray-400">Caninos y felinos predominantes</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-1">
          <p className="text-xs font-semibold text-purple-600">Citas Completadas</p>
          <p className="text-2xl font-bold text-gray-900">94.5%</p>
          <p className="text-[11px] text-gray-400">Bajo índice de ausentismo</p>
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
              <th className="pb-3 font-semibold">Costo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-600">
            {atencionesRecientes.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="py-3 font-medium text-gray-800">{item.mascota}</td>
                <td className="py-3 text-gray-500">{item.especie}</td>
                <td className="py-3">{item.servicio}</td>
                <td className="py-3 text-gray-500">{item.fecha}</td>
                <td className="py-3 font-semibold text-emerald-600">{item.costo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}