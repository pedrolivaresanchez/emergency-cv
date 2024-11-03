'use client';

import { MapPin, Clock, AlertCircle, Phone, Heart, Users, Package, Truck } from 'lucide-react';

export default function Home() {
  const emergencyNumbers = [
    { name: 'Emergencias', number: '112', description: 'Para situaciones de peligro inmediato' },
    { name: 'Policía Local', number: '092', description: 'Asistencia y seguridad local' },
    { name: 'Personas Desaparecidas', number: '900 365 112', description: 'Búsqueda y localización' }
  ];

  const collectionPoints = [
    {
      area: "CATARROJA/ALBAL",
      address: "Carrer de Fausto Albiol, 4",
      postalCode: "46470",
      city: "Albal",
      location: "Aldi"
    },
    {
      area: "BENETÚSER/SEDAVÍ",
      address: "Avinguda de la Albufera, 22",
      postalCode: "46910",
      city: "Alfafar",
      location: "Consum"
    },
    {
      area: "PAIPORTA/PICANYA",
      address: "Av. Nou d'octubre, 39",
      postalCode: "46210",
      city: "Picanya",
      location: "Pabellón polideportivo"
    },
    {
      area: "TORRENT",
      address: "Av. al Vedat, 93",
      postalCode: "46900",
      city: "Torrent",
      location: "Mercadona"
    },
    {
      area: "ALDAIA/ALACUÁS",
      address: "Carrer les Encreullades, 2",
      postalCode: "46960",
      city: "Aldaia",
      location: ""
    },
    {
      area: "XIRIVELLA",
      address: "Pl. d'Espanya, 7",
      postalCode: "46950",
      city: "Xirivella",
      location: "Lidl"
    },
    {
      area: "LA TORRE",
      address: "Avinguda Real de Madrid, 59",
      postalCode: "46017",
      city: "Valencia",
      location: "Consum"
    }
  ];

  const mainActions = [
    {
      title: "Necesito Ayuda",
      description: "Solicita asistencia urgente",
      icon: AlertCircle,
      path: "/solicitar-ayuda",
      color: "red",
      priority: "high"
    },
    {
      title: "Quiero Ayudar",
      description: "Regístrate como voluntario",
      icon: Heart,
      path: "/ofrecer-ayuda",
      color: "green",
      priority: "high"
    },
    {
      title: "Personas Desaparecidas",
      description: "Reportar o buscar personas",
      icon: Users,
      path: "https://desaparecidosdana.pythonanywhere.com/",
      color: "purple",
      priority: "high"
    },
    {
      title: "Puntos de Recogida",
      description: "Gestionar donaciones",
      icon: Package,
      path: "/punto-recogida",
      color: "blue"
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-7xl">
      {/* Sección de Emergencia */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-red-800 mb-2">EMERGENCIA ACTIVA - DANA</h2>
            <div className="prose prose-sm text-red-700">
              <p className="mb-2">
                Situación de emergencia activa por DANA en la Comunitat Valenciana.
              </p>
              <p className="font-medium">
                Para emergencias médicas inmediatas, llame al 112.
              </p>
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

      {/* Sección de Donaciones de la Generalitat */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-yellow-500 p-4">
          <h2 className="text-2xl font-bold text-white text-center">
            Cuenta Solidaria Generalitat Valenciana
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <p className="text-lg font-medium text-yellow-800 mb-4">
              Número de cuenta oficial para donaciones:
            </p>
            <div className="bg-white p-4 rounded-lg inline-block mx-auto font-mono text-xl mb-4">
              ES94 0081 0693 61 0002423445
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText('ES94 0081 0693 61 0002423445');
                alert('Número de cuenta copiado al portapapeles');
              }}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 
                transition-colors flex items-center gap-2 mx-auto"
            >
              📋 Copiar número de cuenta
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Compromiso Banco Sabadell</h3>
              <p className="text-blue-700">
                Por cada euro donado, el banco aportará otro euro adicional 
                (mínimo garantizado: 500.000€)
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Información Oficial</h3>
              <p className="text-gray-600">
                Iniciativa de la Generalitat Valenciana en colaboración con la 
                Conselleria de Hacienda y Banco Sabadell para ayudar a los afectados.
              </p>
            </div>
          </div>
        </div>
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
            <p className="font-medium text-orange-800">
              Horario de encuentro: 10:00 am todos los días
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionPoints.map((point) => (
            <div key={point.area} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-800 mb-2">{point.area}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{point.address}</p>
                <p>{point.postalCode} {point.city}</p>
                {point.location && (
                  <p className="text-orange-600 font-medium mt-2">
                    Punto de referencia: {point.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}