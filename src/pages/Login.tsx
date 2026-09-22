import { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (user: { name: string; role: string }) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar cada usuario de forma independiente para asignar su rol exacto
    if (username.toLowerCase() === 'admin' && password === '1234') {
      const user = { name: 'Administrador General', role: 'admin' };
      localStorage.setItem('vet_user', JSON.stringify(user));
      onLoginSuccess(user);
    } else if (username.toLowerCase() === 'recepcion' && password === '1234') {
      const user = { name: 'Recepcionista', role: 'recepcion' };
      localStorage.setItem('vet_user', JSON.stringify(user));
      onLoginSuccess(user);
    } else if (username.toLowerCase() === 'vet' && password === '1234') {
      const user = { name: 'Dr. Veterinario', role: 'veterinario' };
      localStorage.setItem('vet_user', JSON.stringify(user));
      onLoginSuccess(user);
    } else if (username.toLowerCase() === 'cliente' && password === '1234') {
      const user = { name: 'Cliente (Propietario)', role: 'cliente' };
      localStorage.setItem('vet_user', JSON.stringify(user));
      onLoginSuccess(user);
    } else {
      setError('Credenciales incorrectas. Verifique los usuarios permitidos abajo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">VetControl</h1>
          <p className="text-sm text-gray-500">Sistema Web de Control de Expedientes y Citas</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Usuario</label>
            <input
              type="text"
              placeholder="admin, recepcion, vet o cliente"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg p-2.5 text-sm font-medium hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 space-y-1 pt-4 border-t border-gray-100">
          <p className="font-semibold text-gray-500">Credenciales de prueba (Contraseña para todos: 1234):</p>
          <p>• Admin: <b>admin</b> (Control total)</p>
          <p>• Recepción: <b>recepcion</b> (Citas y Expedientes)</p>
          <p>• Veterinario: <b>vet</b> (Expedientes y Catálogos)</p>
          <p>• Cliente: <b>cliente</b> (Portal web CUN-03)</p>
        </div>
      </div>
    </div>
  );
}