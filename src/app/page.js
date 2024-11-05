'use client';

import { MapPin, Clock, AlertCircle, Heart, Users, Package, Thermometer, Cross } from 'lucide-react';

import PhoneNumberDialog from '@/components/auth/PhoneNumberDialog';

import Image from 'next/image';

export default function Home() {
  const emergencyNumbers = [
    { name: 'Emergencias', number: '112', description: 'Para situaciones de peligro inmediato' },
    { name: 'Policía Local', number: '092', description: 'Asistencia y seguridad local' },
    { name: 'Personas Desaparecidas', number: '900 365 112', description: 'Búsqueda y localización' },
  ];

  const collectionPoints = [
    {
      area: 'CATARROJA/ALBAL',
      address: 'Carrer de Fausto Albiol, 4',
      postalCode: '46470',
      city: 'Albal',
      location: 'Aldi',
    },
    {
      area: 'BENETÚSER/SEDAVÍ',
      address: 'Avinguda de la Albufera, 22',
      postalCode: '46910',
      city: 'Alfafar',
      location: 'Consum',
    },
    {
      area: 'PAIPORTA/PICANYA',
      address: "Av. Nou d'octubre, 39",
      postalCode: '46210',
      city: 'Picanya',
      location: 'Pabellón polideportivo',
    },
    {
      area: 'TORRENT',
      address: 'Av. al Vedat, 93',
      postalCode: '46900',
      city: 'Torrent',
      location: 'Mercadona',
    },
    {
      area: 'ALDAIA/ALACUÁS',
      address: 'Carrer les Encreullades, 2',
      postalCode: '46960',
      city: 'Aldaia',
      location: '',
    },
    {
      area: 'XIRIVELLA',
      address: "Pl. d'Espanya, 7",
      postalCode: '46950',
      city: 'Xirivella',
      location: 'Lidl',
    },
    {
      area: 'LA TORRE',
      address: 'Avinguda Real de Madrid, 59',
      postalCode: '46017',
      city: 'Valencia',
      location: 'Consum',
    },
  ];

  const mainActions = [
    {
      title: 'Casos activos',
      description: 'Observa los casos activos',
      icon: AlertCircle,
      path: '/casos-activos',
      color: 'orange',
    },
    {
      title: 'Voluntómetro',
      description: 'Mira los voluntarios',
      icon: Thermometer,
      path: '/voluntometro',
      color: 'yellow',
    },
    {
      title: 'Necesito Ayuda',
      description: 'Solicita asistencia urgente',
      icon: Cross,
      path: '/solicitar-ayuda',
      color: 'red',
      priority: 'high',
    },
    {
      title: 'Quiero Ayudar',
      description: 'Regístrate como voluntario',
      icon: Heart,
      path: '/ofrecer-ayuda',
      color: 'green',
      priority: 'high',
    },
    {
      title: 'Personas Desaparecidas',
      description: 'Reportar o buscar personas',
      icon: Users,
      path: 'https://desaparecidosdana.pythonanywhere.com/',
      color: 'purple',
      priority: 'high',
    },
    {
      title: 'Puntos de Recogida',
      description: 'Gestionar donaciones',
      icon: Package,
      path: '/punto-recogida',
      color: 'blue',
    },
  ];

  return (
    <>
      <PhoneNumberDialog />
      <div className="container mx-auto p-4 space-y-8 max-w-7xl">
        {/* Sección de Emergencia */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-red-800 mb-2">EMERGENCIA ACTIVA - DANA</h2>
              <div className="prose prose-sm text-red-700">
                <p className="mb-2">Situación de emergencia activa por DANA en la Comunitat Valenciana.</p>
                <p className="font-medium">Para emergencias médicas inmediatas, llame al 112.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div className="w-full">
              <h2 className="text-xl font-bold text-red-800 mb-2">PARA PERSONAS CON DIFICULTADES TECNICAS</h2>
              <div className="flex flex-col text-red-700 space-y-2">
                <p className="font-bold">
                  AVISO IMPORTANTE: Esta información es sólo para personas que tengan dificultades técnicas a la hora de
                  pedir ayuda.
                </p>
                <p className="mb-2">
                  Hemos habilitado el número{' '}
                  <a className="font-bold text-blue-600 hover:text-blue-800" href="tel:+34626675591">
                    626 675 591
                  </a>{' '}
                  para facilitar la petición de ayuda a aquellas personas que encuentren complicado usar la página web.{' '}
                </p>
                <p className="font-bold">
                  ¡Importante! No saturéis el teléfono si podéis usar la página web, por favor. Si tenéis alguna duda
                  sobre la página web o deseáis aportar nuevas ideas, por favor escríbenos a{' '}
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

        {/* Acciones Principales - Más grandes y prominentes */}
        <div className="grid md:grid-cols-2 gap-6">
          {mainActions.map((action) => (
            <a
              key={action.title}
              href={action.path}
              className={`bg-white p-8 rounded-lg shadow-lg border-l-4 
              border-${action.color}-500 hover:shadow-xl transition-all hover:-translate-y-1
              ${action.priority === 'high' ? 'md:col-span-1 relative overflow-hidden' : ''}`}
            >
              {action.priority === 'high' && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-lg text-sm">
                  Prioritario
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <action.icon className={`h-8 w-8 text-${action.color}-500`} />
                <h3 className={`text-xl font-bold text-${action.color}-600`}>{action.title}</h3>
              </div>
              <p className="text-gray-600">{action.description}</p>
            </a>
          ))}
        </div>

        {/* Puntos de Encuentro */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-800">Puntos de Encuentro</h2>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <p className="font-medium text-orange-800">Horario de encuentro: 10:00 am todos los días</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collectionPoints.map((point) => (
              <div key={point.area} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-800 mb-2">{point.area}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{point.address}</p>
                  <p>
                    {point.postalCode} {point.city}
                  </p>
                  {point.location && (
                    <p className="text-orange-600 font-medium mt-2">Punto de referencia: {point.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}