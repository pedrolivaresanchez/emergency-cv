import { AlertCircle, Clock, Cross, Heart, MapPin, Navigation, Package, Thermometer, Users } from 'lucide-react';

import PhoneNumberDialog from '@/components/auth/PhoneNumberDialog';

import Image from 'next/image';
import { CallCenterLink } from '@/components/CallCenterLink';

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

  const medicalCenters = [
    {
      name: 'PICANYA - RESIDENCIA SOLIMAR',
      address: 'Av. Ricardo Capella, 4, 46210 Picanya, Valencia',
      location: 'https://maps.app.goo.gl/t7qFNX4b6eH5HjMJ6',
    },
    {
      name: 'PAIPORTA - CEIP LLuís Vives',
      address: 'Carrer Marqués del Turia, 59, 46200 Paiporta, València',
      location: 'https://maps.app.goo.gl/EcbuAxHtJaXh4SHd7',
    },
    {
      name: 'LA TORRE - Centro municipal de personas mayores',
      address: 'Carrer Benidoleig, 9, Pobles del Sud, 46017 València, Valencia',
      location: 'https://maps.app.goo.gl/ZS87MfGakwpBvP8v6',
    },
    {
      name: 'ALFAFAR, la tauleta',
      address: 'Carrer la tauleta 38',
      location: 'https://maps.app.goo.gl/anTLDsHJnVZuBjPbA',
    },
    {
      name: 'ALFAFAR - Parque Alcosa Bar Hogar del Jubilado Barrio Orba',
      address: 'C. Algemesí, 11, 46910 Alfafar, Valencia',
      location: 'https://maps.app.goo.gl/ktk4nqKa44tgxhDh9',
    },
    {
      name: 'BENETUSSER - CEIP Blasco Ibañez',
      address: 'Passatge Maestra Rogelia Antón, s/n, 46910 Benetússer, Valencia',
      location: 'https://maps.app.goo.gl/G2EPM6zzkSCtdcnq7',
    },
    {
      name: 'CATARROJA - La Florida universitaria',
      address: 'Carrer del Rei En Jaume I, 2, 46470 Catarroja, Valencia',
      location: 'https://maps.app.goo.gl/dCNsCVweDzhk2SdVA',
    },
    {
      name: 'MASSANASA - Ayuntamiento Massanasa',
      address: 'Pl. de les Escoles Velles, 1, 46470 Masanasa, Valencia',
      location: 'https://maps.app.goo.gl/1J8HV2QqSMJp1TEPA',
    },
    {
      name: 'SEDAVI - IES Sedaví',
      address: 'Avinguda del País Valencià, 26, 46910 Sedaví, Valencia',
      location: 'https://maps.app.goo.gl/ykSRKdJ2mJzHYt1Z9',
    },
    {
      name: 'CASTELLAR - Centro de salud habitual',
      address: 'C/ de Vicent Puchol, 11, Pobles del Sud, 46026 València, Valencia',
      location: 'https://maps.app.goo.gl/qkuXMKKM9X63itBq8',
    },
    {
      name: 'ALDAIA - Centro Matilde Salvador',
      address: 'C/ Mestre Serrano, 42, Piso 1 - Puerta 1, 46960 Aldaia, Valencia',
      location: 'https://maps.app.goo.gl/vLZRc7W9WTmnhHWn6',
    },
    {
      name: 'ALDAIA - Parroquia de la Anunciación',
      address: 'C/ Iglesia, 1, 46960 Aldaia, Valencia',
      location: 'https://maps.app.goo.gl/MAo6hwFMUxAjkFv67',
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
      title: 'Desaparecidos y Extraviados',
      description: 'Reportar o buscar Personas, animales y vehículos',
      icon: Users,
      path: '/personas-animales-desaparecidos',
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
                  Hemos habilitado el número <CallCenterLink /> para facilitar la petición de ayuda a aquellas personas
                  que encuentren complicado usar la página web.{' '}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto p-6">
          {/* Puntos de Encuentro */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <MapPin className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800">Puntos de Encuentro</h2>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <p className="font-medium text-orange-800">Horario de encuentro: 10:00 am todos los días</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
              {collectionPoints.map((point) => (
                <div key={point.area} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-gray-800 mb-2">{point.area}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <a
                      href={`https://maps.google.com/?q=${point.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 group-hover:underline"
                    >
                      <Navigation className="h-4 w-4" />
                      <span className="line-clamp-2">
                        {point.address} {point.postalCode} {point.city}
                      </span>
                    </a>
                    {point.location && (
                      <p className="text-orange-600 font-medium mt-2">Punto de referencia: {point.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Puntos Medicos */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-full">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Puntos Médicos</h2>
            </div>
            <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
              {medicalCenters.map((center) => (
                <div
                  key={center.name}
                  className="group bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-shadow hover:shadow-md"
                >
                  <h3 className="font-bold text-gray-800 mb-2">{center.name}</h3>
                  <a
                    href={center.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 group-hover:underline"
                  >
                    <Navigation className="h-4 w-4" />
                    <span className="line-clamp-2">{center.address}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
