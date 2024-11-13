'use client';

import SignUp from '@/components/auth/SignUp';
import { updateUser, getSessionUser, signOut, signIn } from '@/lib/actions';
import { FormEvent, useState } from 'react';
import SocialButton from './SocialButton';
import { useSessionManager } from '@/helpers/hooks';

type LoginProps = {
  onSuccessCallback: () => void;
  redirectUrl?: string;
};

type Status = {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
};

type FormData = {
  email: string;
  password: string;
  privacyPolicy: string;
};

export default function Login({ onSuccessCallback, redirectUrl }: LoginProps) {
  const { setSession } = useSessionManager();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    privacyPolicy: '',
  });
  const [status, setStatus] = useState<Status>({
    isSubmitting: false,
    error: null,
    success: false,
  });
  const [isPrivacyAccepted, setPrivacyAccepted] = useState<boolean>(true);

  const updatePrivacyPolicy = async (value: string) => {
    const { data: session, error: errorGettingUser } = await getSessionUser();

    if (!session.user || errorGettingUser) {
      throw new Error('Error a la hora de obtener el usuario');
    }

    const metadata = session.user.user_metadata;
    const metadataUpdated = { ...metadata, privacyPolicy: value };

    const { error: updateUserError } = await updateUser({
      data: metadataUpdated,
    });

    if (updateUserError) {
      throw new Error('Error a la hora de actualizar el usuario');
    }
  };

  const getUserPrivacyPolicy = async () => {
    const { data: session, error: errorGettingUser } = await getSessionUser();
    if (!session.user || errorGettingUser) {
      throw new Error('Error a la hora de obtener el usuario');
    }
    return session.user.user_metadata.privacyPolicy as string;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setStatus({ isSubmitting: true, error: null, success: false });

    if (!isPrivacyAccepted) {
      if (!formData.privacyPolicy) {
        setStatus((prev) => {
          return {
            ...prev,
            error: 'Para continuar, debes aceptar la Política de Privacidad.',
          };
        });
        return;
      }
    }

    if (!formData.email || !formData.password) {
      setStatus({ isSubmitting: false, error: 'Rellena el email y contraseña', success: false });
      return;
    }

    const response = await signIn(formData.email, formData.password);

    if (response.error) {
      setStatus({ isSubmitting: false, error: 'El email o contraseña son inválidos', success: false });
      return;
    }

    if (formData.privacyPolicy && !isPrivacyAccepted) {
      await updatePrivacyPolicy('true');
      setPrivacyAccepted(true);
    }

    const privacyPolicy = await getUserPrivacyPolicy();

    if (!privacyPolicy) {
      setPrivacyAccepted(false);
      await signOut();
      setStatus({ isSubmitting: false, error: null, success: false });

      return;
    }

    localStorage.setItem('accessToken', response.data.session.access_token);
    localStorage.setItem('refreshToken', response.data.session.refresh_token);

    setStatus({ isSubmitting: false, error: null, success: true });
    setSession(response.data.user);

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
            {/* Política de privacidad */}
            {!isPrivacyAccepted && (
              <div className="grid gap-4">
                <div className="flex gap-2 items-start lg:items-center">
                  <input
                    type="checkbox"
                    value={formData.privacyPolicy}
                    onChange={(e) => setFormData({ ...formData, privacyPolicy: e.target.checked.toString() })}
                    className="min-w-4 min-h-4 cursor-pointer"
                    id="privacyPolicy"
                    required
                  />
                  <label htmlFor="privacyPolicy" className="text-sm font-medium text-gray-700">
                    He leído y aceptado la{' '}
                    <a href="/politica-privacidad/" className="text-blue-400">
                      política de privacidad
                    </a>{' '}
                    y acepto que «ajudadana.es» recoja y guarde los datos enviados a través de este formulario.
                  </label>
                </div>
              </div>
            )}
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
            <SocialButton redirectUrl={redirectUrl} provider="google">
              Inicia sesión con Google
            </SocialButton>
          </div>
        </form>
      )}
      {isSignUp && (
        <SignUp
          onBackButtonClicked={() => {
            setIsSignUp(false);
          }}
          callback={onSuccessCallback}
        />
      )}
    </>
  );
}
