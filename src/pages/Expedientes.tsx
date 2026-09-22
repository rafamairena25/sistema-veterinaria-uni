import { useState, useEffect } from 'react';

interface Consulta {
  fecha: string;
  peso: string;
  temperatura: string;
  frecuenciaCardiaca: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
  medicamentos: string;
}

interface Expediente {
  id: string;
  mascota: string;
  especie: string;
  raza: string;
  propietario: string;
  telefono: string;
  historial?: Consulta[];
}

export default function Expedientes() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Expediente | null>(null);

  const [mascota, setMascota] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [raza, setRaza] = useState('');
  const [propietario, setPropietario] = useState('');
  const [telefono, setTelefono] = useState('');

  const listaEspecies = ['Perro', 'Gato', 'Ave', 'Conejo', 'Otro'];

  useEffect(() => {
    const dataExp = localStorage.getItem('vet_expedientes');
    if (dataExp) {
      setExpedientes(JSON.parse(dataExp));
    }
  }, []);

  const guardarExpediente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mascota || !propietario) return;

    const nuevo: Expediente = {
      id: Date.now().toString(),
      mascota,
      especie,
      raza: raza || 'Mestizo',
      propietario,
      telefono,
      historial: []
    };

    const actualizados = [...expedientes, nuevo];
    setExpedientes(actualizados);
    localStorage.setItem('vet_expedientes', JSON.stringify(actualizados));

    // Limpiar formulario
    setMascota('');
    setPropietario('');
    setTelefono('');
    setRaza('');
    setEspecie('Perro');
  };

  const eliminarExpediente = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se abra el modal al hacer clic en eliminar
    const actualizados = expedientes.filter((item) => item.id !== id);
    setExpedientes(actualizados);
    localStorage.setItem('vet_expedientes', JSON.stringify(actualizados));
  };

  const expedientesFiltrados = expedientes.filter(
    (e) =>
      e.mascota.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.propietario.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Expedientes</h1>
        <p className="text-sm text-gray-500">Registro, consulta de pacientes e historial médico clínico</p>
      </div>

      {/* Formulario de Alta */}
      <form onSubmit={guardarExpediente} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Registrar Nuevo Expediente</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre de la mascota"
            value={mascota}
            onChange={(e) => setMascota(e.target.value)}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
            required
          />
          <select
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 bg-white"
          >
            {listaEspecies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Raza"
            value={raza}
            onChange={(e) => setRaza(e.target.value)}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Nombre del propietario"
            value={propietario}
            onChange={(e) => setPropietario(e.target.value)}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg p-2.5 text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            + Guardar Expediente
          </button>
        </div>
      </form>

      {/* Lista y Buscador */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="font-semibold text-gray-800">Listado de Pacientes ({expedientesFiltrados.length})</h2>
            <p className="text-xs text-gray-400">Haz clic en cualquier fila para ver el historial clínico completo y recetas.</p>
          </div>
          
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="🔍 Buscar por mascota o dueño..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="p-3">Mascota</th>
              <th className="p-3">Especie / Raza</th>
              <th className="p-3">Propietario</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expedientesFiltrados.length > 0 ? (
              expedientesFiltrados.map((e) => (
                <tr 
                  key={e.id} 
                  onClick={() => setMascotaSeleccionada(e)}
                  className="hover:bg-blue-50/40 cursor-pointer transition"
                >
                  <td className="p-3 font-semibold text-gray-800 flex items-center gap-2">
                    {e.mascota}
                    {e.historial && e.historial.length > 0 && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {e.historial.length} consultas
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-600">{e.especie} - {e.raza}</td>
                  <td className="p-3 text-gray-600">{e.propietario}</td>
                  <td className="p-3 text-gray-600">{e.telefono || 'No registrado'}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={(evt) => eliminarExpediente(e.id, evt)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 bg-red-50 rounded hover:bg-red-100 transition cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">
                  No se encontraron expedientes registrados. Agrega uno arriba o haz una consulta médica.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para ver el Historial Clínico de la Mascota */}
      {mascotaSeleccionada && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Expediente Médico: {mascotaSeleccionada.mascota}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Propietario: <span className="font-semibold text-gray-700">{mascotaSeleccionada.propietario}</span> | 
                  Especie/Raza: <span className="font-semibold text-gray-700">{mascotaSeleccionada.especie} ({mascotaSeleccionada.raza})</span>
                </p>
              </div>
              <button
                onClick={() => setMascotaSeleccionada(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg px-2 py-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">Historial de Consultas y Recetas</h3>
              
              {mascotaSeleccionada.historial && mascotaSeleccionada.historial.length > 0 ? (
                mascotaSeleccionada.historial.map((c, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50 shadow-xs">
                    <div className="flex justify-between items-center text-xs text-gray-500 border-b pb-2">
                      <span className="font-semibold text-gray-700">📅 Fecha: {c.fecha || 'Reciente'}</span>
                      <div className="space-x-3">
                        <span>Peso: <b>{c.peso || 'N/D'}</b></span>
                        <span>Temp: <b>{c.temperatura || 'N/D'}</b></span>
                        <span>FC: <b>{c.frecuenciaCardiaca || 'N/D'}</b></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-semibold text-gray-700">Motivo:</p>
                        <p className="text-gray-600 bg-white p-2 rounded border border-gray-100 mt-0.5">{c.motivo || 'Sin especificar'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Diagnóstico:</p>
                        <p className="text-gray-600 bg-white p-2 rounded border border-gray-100 mt-0.5">{c.diagnostico || 'Sin especificar'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <p className="font-semibold text-gray-700">Tratamiento:</p>
                        <p className="text-gray-600 bg-white p-2 rounded border border-gray-100 mt-0.5">{c.tratamiento || 'Sin especificar'}</p>
                      </div>
                      <div>
                        <p className="font-medium text-emerald-700">Medicamentos / Vacunas:</p>
                        <p className="text-emerald-800 bg-emerald-50/60 p-2 rounded border border-emerald-100 mt-0.5 font-medium">{c.medicamentos || 'Ninguno'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-500 font-medium">Esta mascota aún no tiene consultas médicas registradas.</p>
                  <p className="text-xs text-gray-400 mt-1">Ve al módulo de <b className="text-blue-600">Citas</b> para registrar una orden de atención médica.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setMascotaSeleccionada(null)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-900 transition cursor-pointer"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}