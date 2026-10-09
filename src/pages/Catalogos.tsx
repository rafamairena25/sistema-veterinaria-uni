import React, { useState, useEffect } from 'react';
import { obtenerRoles } from '../services/api';

export default function Catalogos() {
  const [rolesDb, setRolesDb] = useState([]);
  
  const [vacunas, setVacunas] = useState([
    { id: 1, nombre: 'Rabia', stock: '25 dosis' },
    { id: 2, nombre: 'Triple Felina', stock: '12 dosis' },
    { id: 3, nombre: 'Desparasitación Interna', stock: '40 dosis' }
  ]);
  
  const [servicios, setServicios] = useState([
    { id: 1, nombre: 'Consulta General', costo: '$20' },
    { id: 2, nombre: 'Baño y Corte', costo: '$15' },
    { id: 3, nombre: 'Cirugía Menor', costo: '$80' }
  ]);

  const [nuevaVacuna, setNuevaVacuna] = useState('');
  const [nuevoServicio, setNuevoServicio] = useState('');
  const [costoServicio, setCostoServicio] = useState('');

  // Consumir la API al cargar el componente
  useEffect(() => {
    obtenerRoles().then(data => setRolesDb(data));
  }, []);

  const handleAgregarVacuna = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaVacuna.trim()) return;
    setVacunas([...vacunas, { id: Date.now(), nombre: nuevaVacuna, stock: '10 dosis' }]);
    setNuevaVacuna('');
  };

  const handleAgregarServicio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoServicio.trim() || !costoServicio.trim()) return;
    setServicios([...servicios, { id: Date.now(), nombre: nuevoServicio, costo: `$${costoServicio.replace('$', '')}` }]);
    setNuevoServicio('');
    setCostoServicio('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Catálogos del Sistema (CUN-04)</h2>
        <p className="text-sm text-gray-500">Administración general de los cuadros de vacunas, tratamientos y tarifarios de servicios de la clínica.</p>
      </div>

      {/* Sección de prueba de conexión con la Base de Datos vía API */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl space-y-3">
        <h3 className="font-bold text-blue-900 text-sm flex items-center justify-between">
          <span>Roles obtenidos desde PostgreSQL (Vía API Backend)</span>
          <span className="text-xs bg-blue-600 text-white px-2.5 py-0.5 rounded-full">{rolesDb.length} registros en BD</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {rolesDb.map((rol: any) => (
            <div key={rol.id_rol} className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 flex flex-col">
              <span className="text-xs text-gray-400 font-mono">ID: {rol.id_rol}</span>
              <span className="text-sm font-semibold text-gray-800">{rol.nombre_rol}</span>
            </div>
          ))}
        </div>
      </div>

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
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer">
              Añadir
            </button>
          </form>

          <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
            {vacunas.map((v) => (
              <div key={v.id} className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-gray-800">{v.nombre}</span>
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">{v.stock}</span>
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
            />
            <input 
              type="text" 
              placeholder="Precio ($)" 
              value={costoServicio}
              onChange={(e) => setCostoServicio(e.target.value)}
              className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition cursor-pointer">
              Crear
            </button>
          </form>

          <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
            {servicios.map((s) => (
              <div key={s.id} className="py-2.5 flex justify-between items-center text-sm">
                <span className="font-medium text-gray-800">{s.nombre}</span>
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded text-xs">{s.costo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}