// Tipos para el Módulo de Expedientes (CU-01)
export interface Propietario {
  id: string;
  cedula: string;
  nombre: string;
  telefono: string;
  correo: string;
}

export interface Mascota {
  id: string;
  propietarioId: string;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  peso: number;
}

// Tipos para el Módulo de Citas (CU-02)
export interface Cita {
  id: string;
  mascotaId: string;
  servicio: 'Consulta General' | 'Vacunación' | 'Cirugía' | 'Control';
  veterinario: string;
  fechaHora: string;
  estado: 'Programada' | 'En Espera' | 'Atendiendo' | 'Finalizada' | 'Cancelada';
}