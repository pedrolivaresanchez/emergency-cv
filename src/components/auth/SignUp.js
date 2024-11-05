'use client';

import { useCallback, useState } from 'react';
import { ArrowBigLeft } from 'lucide-react';
import { authService } from '@/lib/service';

import { PhoneInput } from '@/components/PhoneInput';
import { formatPhoneNumber } from '@/helpers/format';
import { isValidPhone } from '@/helpers/utils';

export default function SignUp({ onSuccessCallback, onBackButtonClicked }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
  });
  const [status, setStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const setError = (mensaje) => {
    setStatus({
      isSubmitting: false,
      error: mensaje,
      success: false,
    });
  };

  const handlePhoneChange = useCallback((phoneNumber) => {
    setFormData((formData) => ({ ...formData, telefono: phoneNumber }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Form validation */
    if (!isValidPhone(formData.telefono)) {
      alert('El teléfono de contacto no es válido.');
      return;
    }

    setStatus({ isSubmitting: true, error: null, success: false });

    // nombre
    if (!formData.nombre) {
      setError('Rellena correctamente el campo nombre');
      return;
    }

    // telefono
    // const telefonoValido = new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$');
    if (!formData.telefono) {
      setError('Rellena correctamente el campo teléfono');
      return;
    }
    const formatedPhoneNumber = formatPhoneNumber(formData.telefono);

    // email
    // const emailValido = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    if (!formData.email) {
      setError('Rellena correctamente el campo email');
      return;
    }

    // password
    if (!formData.password) {
      setError('Rellena correctamente el campo contraseña');
      return;
    }

    const response = await authService.signUp(formData.email, formData.password, formData.nombre, formatedPhoneNumber);
    if (response.error) {
      setError('Ha habido un error inesperado creando el usuario');
      return;
    }

    setStatus({ isSubmitting: false, error: null, success: true });
    if (typeof onSuccessCallback === 'function') {
      onSuccessCallback(response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded-lg p-6 w-full relative flex flex-col gap-6`}>
      <div className="space-y-6 max-h-[65vh] overflow-y-auto p-2">
        <div className="grid gap-4">
          <ArrowBigLeft
            className="h-6 w-6 hover:cursor-pointer"
            onClick={() => {
              if (typeof onBackButtonClicked === 'function') {
                onBackButtonClicked();
              }
            }}
          />
        </div>
        {/* Nombre */}
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Telefono */}
        <div className="grid gap-4">
          <PhoneInput phoneNumber={formData.telefono} onChange={handlePhoneChange} />
        </div>
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
          {status.isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </div>
      {/* Mensaje de error */}
      {status.error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{status.error}</p>
        </div>
      )}
    </form>
  );
}
