import React, { useState, useEffect } from 'react';

export default function RolesList() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // URL de tu backend desplegado en Render
    const API_URL = 'https://veterinaria-backend-vy1q.onrender.com/api/roles';

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al conectar con el servidor en la nube');
        }
        return response.json();
      })
      .then((data) => {
        setRoles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Roles del Sistema Veterinario (Datos desde PostgreSQL en Render)
      </h2>

      {loading && (
        <p className="text-center text-blue-600 font-medium">
          Conectando con la base de datos en la nube (puede tardar unos segundos si el servidor estaba inactivo)...
        </p>
      )}

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">ID Rol</th>
                <th className="border border-gray-300 px-4 py-2">Nombre del Rol</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => (
                <tr key={rol.id_rol} className="hover:bg-gray-50 text-center">
                  <td className="border border-gray-300 px-4 py-2">{rol.id_rol}</td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold text-gray-700">
                    {rol.nombre_rol}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}