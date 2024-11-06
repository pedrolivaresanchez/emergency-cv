'use client';

import SignUp from '@/components/auth/SignUp';
import { authService } from '@/lib/service';
import { useState } from 'react';
import SocialButton from './SocialButton';

export default function Login({ onSuccessCallback }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ isSubmitting: true, error: null, success: false });

    if (!formData.email || !formData.password) {
      setStatus({ isSubmitting: false, error: 'Rellena el email y contraseña', success: false });
      return;
    }

    const response = await authService.signIn(formData.email, formData.password);
    if (response.error) {
      setStatus({ isSubmitting: false, error: 'El email o contraseña son inválidos', success: false });
      return;
    }

    setStatus({ isSubmitting: false, error: null, success: true });

    if (typeof onSuccessCallback === 'function') {
      onSuccessCallback();
    }
  };

  return (
    <>
      {!isSignUp && (
        <form onSubmit={handleSubmit} className={`bg-white rounded-lg p-6 w-full relative flex flex-col gap-6`}>
          <div className="space-y-6 max-h-[65vh] overflow-y-auto p-2">
            {/* Email */}
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            {/* Contraseña */}
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div className="gap-4 flex">
              <div
                className="ml-auto text-blue-400 hover:cursor-pointer"
                onClick={() => {
                  setIsSignUp(true);
                }}
              >
                Crear cuenta
              </div>
            </div>
            {/* Boton */}
            <div className="flex flex-col sm:flex-row">
              <button
                type="submit"
                disabled={status.isSubmitting}
                className={`w-full ${
                  status.isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                } text-white py-3 px-4 rounded-lg font-semibold 
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
              >
                {status.isSubmitting ? 'Iniciando sesión...' : 'Inicia Sesión'}
              </button>
            </div>

            {/* Mensaje de error */}
            {status.error && (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{status.error}</p>
              </div>
            )}
          </div>

          <div className="p-2">
            <p className="text-center text-gray-700 mb-2">O prueba con estas opciones:</p>
            <SocialButton provider="google">Inicia sesión con Google</SocialButton>
          </div>
        </form>
      )}
      {isSignUp && (
        <SignUp
          onBackButtonClicked={() => {
            setIsSignUp(false);
          }}
        />
      )}
    </>
  );
}
