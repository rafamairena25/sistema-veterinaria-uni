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

// --- MÓDULO DE EXPEDIENTES ---
export const obtenerExpedientes = async () => {
  try {
    const response = await fetch(`${API_URL}/expedientes`);
    if (!response.ok) {
      throw new Error('Error al obtener los expedientes del servidor');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la petición de expedientes:', error);
    return [];
  }
};

// NUEVA FUNCIÓN: Guardar un nuevo expediente en la base de datos de Render
export const crearExpedienteAPI = async (nuevoExpediente: {
  mascota: string;
  especie: string;
  raza: string;
  propietario: string;
  telefono: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/expedientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoExpediente),
    });

    if (!response.ok) {
      throw new Error('Error al crear el expediente en el servidor');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la petición para crear expediente:', error);
    return null;
  }
};

// --- MÓDULO DE CITAS ---
export const obtenerCitas = async () => {
  try {
    const response = await fetch(`${API_URL}/citas`);
    if (!response.ok) {
      throw new Error('Error al obtener las citas del servidor');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la petición de citas:', error);
    return [];
  }
};