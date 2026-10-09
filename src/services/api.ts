const API_URL = 'https://veterinaria-backend-vy1q.onrender.com/api';

export const obtenerRoles = async () => {
  try {
    const response = await fetch(`${API_URL}/roles`);
    if (!response.ok) {
      throw new Error('Error al obtener los roles del servidor');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la petición:', error);
    return [];
  }
};