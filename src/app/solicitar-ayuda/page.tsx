'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CallCenterLink } from '@/components/CallCenterLink';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Form } from './_components/Form';

export default function SolicitarAyuda() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session);
    });
  }, []);
  return (
    <div className="space-y-6">
      {/* Banner de emergencia */}
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div>
            <h2 className="text-red-800 font-bold">EMERGENCIA ACTIVA - Inundaciones CV</h2>
            <p className="text-red-700 text-sm mt-1">
              Para emergencias médicas inmediatas, llame al 112. Este formulario es para coordinar ayuda y asistencia.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <div className="space-y-4">
            <h2 className="text-red-800 font-bold">PARA PERSONAS CON DIFICULTADES TECNICAS</h2>
            <div className="flex flex-col text-red-700 space-y-2">
              <p className="font-bold">
                AVISO IMPORTANTE: Esta información es sólo para personas que tengan dificultades técnicas a la hora de
                pedir ayuda.
              </p>
              <p className="mb-2">
                Hemos habilitado el número <CallCenterLink /> para facilitar la petición de ayuda a aquellas personas
                que encuentren complicado usar la página web.{' '}
              </p>
              <p className="font-bold">
                ¡Importante! No saturéis el teléfono si podéis usar la página web, por favor. Si tenéis alguna duda
                sobre la página web o deseas aportar nuevas ideas, por favor escríbenos a{' '}
                <a className="text-blue-600 hover:text-blue-800" href="mailto:info@ajudadana.es">
                  info@ajudadana.es
                </a>
              </p>
              <p>También puedes contactar con nosotros a través de:</p>
              <a className="text-blue-600 hover:text-blue-800 flex space-x-2" href="https://wa.me/34626675591">
                <Image
                  src={
                    'https://upload.wikimedia.org/wikipedia/commons/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg'
                  }
                  alt="Whatsapp icon"
                  height={20}
                  width={20}
                />
                <span className="font-semibold">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {session ? (
        <Form session={session} />
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
