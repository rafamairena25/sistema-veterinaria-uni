import { useState, useEffect } from 'react';

export default function Citas() {
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');
  const [fechaCita, setFechaCita] = useState('');
  const [horaCita, setHoraCita] = useState('');
  const [motivoCita, setMotivoCita] = useState('Consulta General');

  // Estados para la Orden de Atención Médica (CU-03)
  const [pacienteAtencion, setPacienteAtencion] = useState('');
  const [peso, setPeso] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState('');
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [receta, setReceta] = useState('');

  // Cargar mascotas reales desde el Backend / Base de Datos
  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await fetch('https://veterinaria-backend-vy1q.onrender.com/api/expedientes');
        if (response.ok) {
          const data = await response.json();
          setMascotas(data);
          if (data.length > 0) {
            setMascotaSeleccionada(data[0].id_mascota.toString());
            setPacienteAtencion(data[0].id_mascota.toString());
          }
        }
      } catch (error) {
        console.error('Error al cargar mascotas para citas:', error);
      }
    };

    fetchMascotas();
  }, []);

  const handleAgendarCita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mascotaSeleccionada || !fechaCita || !horaCita) {
      alert('Por favor selecciona una mascota, una fecha y una hora para la cita.');
      return;
    }

    // Combinar fecha y hora en el formato que espera PostgreSQL (YYYY-MM-DD HH:mm:ss)
    const fechaHoraCombinada = `${fechaCita} ${horaCita}:00`;

    try {
      const response = await fetch('https://veterinaria-backend-vy1q.onrender.com/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_mascota: mascotaSeleccionada,
          fecha_cita: fechaHoraCombinada,
          motivo_servicio: motivoCita
        }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        // Mostrar alerta si el backend detecta un choque de horarios
        alert(resultado.error || 'Error al agendar la cita.');
        return;
      }

      alert(`¡Cita agendada con éxito en el servidor para el horario ${fechaHoraCombinada}!`);
      setFechaCita('');
      setHoraCita('');
    } catch (error) {
      console.error('Error de red al agendar cita:', error);
      alert('No se pudo conectar con el servidor para agendar la cita.');
    }
  };

  const handleGuardarAtencion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteAtencion || !diagnostico) {
      alert('Por favor selecciona un paciente y completa el diagnóstico.');
      return;
    }

    const constantesTexto = `Peso: ${peso || 'N/D'} kg, Temp: ${temperatura || 'N/D'} °C, F. Cardíaca: ${frecuenciaCardiaca || 'N/D'} lpm`;

    try {
      const response = await fetch('https://veterinaria-backend-vy1q.onrender.com/api/historial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_mascota: pacienteAtencion,
          constantes_vitales: constantesTexto,
          motivo_consulta: motivoConsulta || 'Consulta General',
          diagnostico: diagnostico,
          tratamiento_recetado: receta || 'Sin tratamiento recetado'
        }),
      });

      if (!response.ok) {
        alert('Error al registrar la orden de atención médica en el servidor.');
        return;
      }

      alert(`¡Orden de atención médica registrada y guardada en la base de datos correctamente!`);
      // Limpiar formulario de atención
      setPeso('');
      setTemperatura('');
      setFrecuenciaCardiaca('');
      setMotivoConsulta('');
      setDiagnostico('');
      setReceta('');
    } catch (error) {
      console.error('Error de red al guardar orden de atención:', error);
      alert('No se pudo conectar con el servidor para guardar la orden.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Sección 1: Gestión de Citas (CU-02) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Gestión de Citas Médicas (CU-02)</h2>
        <p className="text-sm text-gray-600">Registra y programa las citas médicas evitando cruces de horarios.</p>
        
        <form onSubmit={handleAgendarCita} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mascota / Paciente</label>
              <select
                value={mascotaSeleccionada}
                onChange={(e) => setMascotaSeleccionada(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
              >
                {mascotas.length === 0 && <option value="">No hay mascotas registradas</option>}
                {mascotas.map((m) => (
                  <option key={m.id_mascota} value={m.id_mascota}>
                    {m.nombre_mascota} ({m.raza || m.especie}) - Propietario: {m.propietario}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de la Cita</label>
              <input
                type="date"
                value={fechaCita}
                onChange={(e) => setFechaCita(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hora</label>
              <input
                type="time"
                value={horaCita}
                onChange={(e) => setHoraCita(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Motivo / Servicio</label>
              <select
                value={motivoCita}
                onChange={(e) => setMotivoCita(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
              >
                <option value="Consulta General">Consulta General</option>
                <option value="Vacunación">Vacunación</option>
                <option value="Desparasitación">Desparasitación</option>
                <option value="Control / Seguimiento">Control / Seguimiento</option>
                <option value="Peluquería y Estética">Peluquería y Estética</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            Agendar Cita
          </button>
        </form>
      </div>

      {/* Sección 2: Orden de Atención Médica (CU-03) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Orden de Atención Médica (CU-03)</h2>
          <p className="text-sm text-gray-600">Registro de constantes vitales, diagnóstico, evolución y prescripción de medicamentos.</p>
        </div>

        <form onSubmit={handleGuardarAtencion} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2">1. Constantes Vitales del Paciente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Paciente</label>
                <select
                  value={pacienteAtencion}
                  onChange={(e) => setPacienteAtencion(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                >
                  {mascotas.map((m) => (
                    <option key={m.id_mascota} value={m.id_mascota}>
                      {m.nombre_mascota} ({m.raza || m.especie})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Peso (kg)</label>
                <input
                  type="text"
                  placeholder="Ej. 18 kg"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Temperatura (°C)</label>
                <input
                  type="text"
                  placeholder="Ej. 38.5 °C"
                  value={temperatura}
                  onChange={(e) => setTemperatura(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Frec. Cardíaca</label>
                <input
                  type="text"
                  placeholder="Ej. 90 lpm"
                  value={frecuenciaCardiaca}
                  onChange={(e) => setFrecuenciaCardiaca(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2">2. Evaluación Médica y Tratamiento</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Motivo de Consulta</label>
              <textarea
                rows={2}
                placeholder="Descripción del motivo de la visita..."
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Diagnóstico</label>
                <textarea
                  rows={3}
                  placeholder="Diagnóstico clínico..."
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Receta / Medicamentos</label>
                <textarea
                  rows={3}
                  placeholder="Medicamentos recetados y dosis..."
                  value={receta}
                  onChange={(e) => setReceta(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            Guardar Orden de Atención
          </button>
        </form>
      </div>
    </div>
  );
}