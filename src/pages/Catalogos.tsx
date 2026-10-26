import React, { useState, useEffect } from 'react';
import { obtenerRoles } from '../services/api';

interface Rol {
  id_rol: number;
  nombre_rol: string;
}

interface Vacuna {
  id_vacuna: number;
  nombre_vacuna: string;
  stock_o_dosis: string;
}

interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  precio: number;
  estado: string;
}

export default function Catalogos() {
  const [rolesDb, setRolesDb] = useState<Rol[]>([]);
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  
  const [cargando, setCargando] = useState(true);
  const [nuevaVacuna, setNuevaVacuna] = useState('');
  const [nuevoServicio, setNuevoServicio] = useState('');
  const [costoServicio, setCostoServicio] = useState('');

  // Función para cargar todos los catálogos desde el Backend (PostgreSQL)
  const cargarCatalogosBD = async () => {
    setCargando(true);
    try {
      // 1. Obtener Roles
      const rolesData = await obtenerRoles();
      if (rolesData) setRolesDb(rolesData);

      // 2. Obtener Vacunas del Catálogo
      const resVacunas = await fetch('https://veterinaria-backend-vy1q.onrender.com/api/vacunas-catalogo');
      if (resVacunas.ok) {
        const dataVacunas = await resVacunas.json();
        setVacunas(dataVacunas);
      }

      // 3. Obtener Tarifario de Servicios
      const resServicios = await fetch('https://veterinaria-backend-vy1q.onrender.com/api/servicios');
      if (resServicios.ok) {
        const dataServicios = await resServicios.json();
        setServicios(dataServicios);
      }
    } catch (error) {
      console.error('Error al obtener catálogos desde la BD:', error);
    }
    setCargando(false);
  };

  // Consumir la API al cargar el componente
  useEffect(() => {
    cargarCatalogosBD();
  }, []);

  const handleAgregarVacuna = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaVacuna.trim()) return;

    try {
      const response = await fetch('https://veterinaria-backend-vy1q.onrender.com/api/vacunas-catalogo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_vacuna: nuevaVacuna, stock_o_dosis: '10 dosis' })
      });

      if (response.ok) {
        setNuevaVacuna('');
        cargarCatalogosBD(); // Recargar datos de la BD
      } else {
        alert('Error al registrar la vacuna en el servidor.');
      }
    } catch (error) {
      console.error('Error de red al agregar vacuna:', error);
    }
  };

  const handleAgregarServicio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoServicio.trim() || !costoServicio.trim()) return;

    const precioLimpio = parseFloat(costoServicio.replace('$', ''));
    if (isNaN(precioLimpio)) {
      alert('Por favor ingrese un precio válido.');
      return;
    }

    try {
      const response = await fetch('https://veterinaria-backend-vy1q.onrender.com/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_servicio: nuevoServicio, precio: precioLimpio })
      });

      if (response.ok) {
        setNuevoServicio('');
        setCostoServicio('');
        cargarCatalogosBD(); // Recargar datos de la BD
      } else {
        alert('Error al registrar el servicio en el servidor.');
      }
    } catch (error) {
      console.error('Error de red al agregar servicio:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Catálogos del Sistema (CUN-04)</h2>
            <p className="text-sm text-gray-500">Administración general de los cuadros de vacunas, tratamientos y tarifarios de servicios de la clínica.</p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
            🌐 Conectado a PostgreSQL en Render
          </span>
        </div>
      </div>

      {/* Sección de prueba de conexión con la Base de Datos vía API */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl space-y-3">
        <h3 className="font-bold text-blue-900 text-sm flex items-center justify-between">
          <span>Roles obtenidos desde PostgreSQL (Vía API Backend)</span>
          <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full">{rolesDb.length} registros en BD</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {rolesDb.map((rol) => (
            <div key={rol.id_rol} className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 flex flex-col">
              <span className="text-xs text-gray-400 font-mono">ID: {rol.id_rol}</span>
              <span className="text-sm font-semibold text-gray-800">{rol.nombre_rol}</span>
            </div>
          ))}
        </div>
      </div>

      {cargando ? (
        <div className="p-8 text-center text-blue-600 font-medium text-sm animate-pulse bg-white rounded-xl border border-gray-100">
          Sincronizando catálogos con la base de datos en la nube...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Catálogo de Vacunas y Tratamientos */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center justify-between">
              <span>Tipos de Vacunas / Tratamientos</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{vacunas.length} registros</span>
            </h3>
            
            <form onSubmit={handleAgregarVacuna} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nueva vacuna o tratamiento..." 
                value={nuevaVacuna}
                onChange={(e) => setNuevaVacuna(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer">
                Añadir
              </button>
            </form>

            <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
              {vacunas.map((v) => (
                <div key={v.id_vacuna} className="py-2.5 flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-800">{v.nombre_vacuna}</span>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">{v.stock_o_dosis}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tarifario de Servicios */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center justify-between">
              <span>Tarifario de Servicios</span>
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{servicios.length} activos</span>
            </h3>

            <form onSubmit={handleAgregarServicio} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Servicio..." 
                value={nuevoServicio}
                onChange={(e) => setNuevoServicio(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
              />
              <input 
                type="text" 
                placeholder="Precio ($)" 
                value={costoServicio}
                onChange={(e) => setCostoServicio(e.target.value)}
                className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
              />
              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition cursor-pointer">
                Crear
              </button>
            </form>

            <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
              {servicios.map((s) => (
                <div key={s.id_servicio} className="py-2.5 flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-800">{s.nombre_servicio}</span>
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded text-xs">
                    ${Number(s.precio).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}