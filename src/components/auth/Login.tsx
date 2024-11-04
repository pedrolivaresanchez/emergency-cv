'use client';

import SignUp from '@/components/auth/SignUp';
import { authService } from '@/lib/service';
import { FC, FormEvent, useEffect, useState } from 'react';
import { User } from '@supabase/auth-js';

type LoginProps = {
  onSuccessCallback?: () => void;
};
const Login: FC<LoginProps> = ({ onSuccessCallback }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [status, setStatus] = useState<{
    isSubmitting: boolean;
    error: string | null;
    success: boolean;
  }>({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const [user, setUser] = useState<User>();

  const refreshUser = async () => {
    const response = await authService.getSessionUser();
    if (response.error) {
      return;
    }
    setUser(response.data.user);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus({ isSubmitting: true, error: null, success: false });

    if (!formData.email || !formData.password) {
      setStatus({ isSubmitting: false, error: 'Rellena el email y contraseña', success: false });
      return;
    }

    const response = await authService.signIn(formData.email, formData.password);
    if (response.error) {
      setStatus({ isSubmitting: false, error: 'El email o contraseña son invalidos', success: false });
      return;
    }

    setStatus({ isSubmitting: false, error: null, success: true });
    setUser(response.data.user);
    if (typeof onSuccessCallback === 'function') {
      onSuccessCallback();
    }
  };

  const logOut = async () => {
    const response = await authService.signOut();
    if (!response.error) {
      setUser(undefined);
    }
  };

  return (
    <>
      {user && (
        <div className={`bg-white rounded-lg p-6 w-full relative flex flex-col gap-6`}>
          <div>La sesión ya esta iniciada</div>
          <div className="text-blue-400 hover:cursor-pointer" onClick={logOut}>
            Cerrar sesión
          </div>
        </div>
      )}
      {!isSignUp && !user && (
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
                {status.isSubmitting ? 'Iniciando sesion...' : 'Inicia Sesion'}
              </button>
            </div>

            {/* Mensaje de error */}
            {status.error && (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{status.error}</p>
              </div>
            )}
          </div>
        </form>
      )}
      {isSignUp && (
        <SignUp
          onBackButtonClicked={() => {
            setIsSignUp(false);
          }}
          onSuccessCallback={() => {
            refreshUser();
            setIsSignUp(false);
          }}
        />
      )}
    </>
  );
};

export default Login;
