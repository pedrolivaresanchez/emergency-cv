'use client';

import { MapPin, Clock } from 'lucide-react';

export default function Home() {
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

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-yellow-800">Aviso Importante</h2>
        <p className="text-yellow-700 text-lg font-semibold">
          Por favor, use mascarillas y guantes al ofrecer ayuda para garantizar la seguridad de todos.
        </p>
      </div>

      {/* Puntos de Recogida Oficiales */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <MapPin className="h-6 w-6 text-orange-500 mr-2" />
          <h2 className="text-xl font-bold text-orange-800">Quedadas de ayuda</h2>
        </div>
        
        <div className="flex items-center mb-4 text-orange-700">
          <Clock className="h-5 w-5 mr-2" />
          <p className="font-semibold">Horario: 10:00 am todos los días</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collectionPoints.map((point, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-orange-600 mb-2">{point.area}</h3>
              <p className="text-gray-600 text-sm mb-1">{point.address}</p>
              <p className="text-gray-600 text-sm mb-1">{point.postalCode} {point.city}</p>
              {point.location && (
                <p className="text-gray-500 text-sm font-medium mt-2">
                  Ubicación: {point.location}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a 
          href="/solicitar-ayuda"
          className="block p-6 bg-white rounded-lg shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-bold text-red-600 mb-2">Necesito Ayuda</h2>
          <p className="text-gray-600">
            Solicita asistencia urgente si te encuentras en una situación de emergencia.
          </p>
        </a>

        <a 
          href="/ofrecer-ayuda"
          className="block p-6 bg-white rounded-lg shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-bold text-green-600 mb-2">Quiero Ayudar</h2>
          <p className="text-gray-600">
            Regístrate como voluntario o indica qué tipo de ayuda puedes ofrecer.
          </p>
        </a>

        <a 
          href="https://desaparecidosdana.pythonanywhere.com/"
          className="block p-6 bg-white rounded-lg shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-bold text-purple-600 mb-2">Personas Desaparecidas</h2>
          <p className="text-gray-600">
            Reporta o consulta información sobre personas desaparecidas.
          </p>
        </a>

        <a 
          href="/punto-recogida"
          className="block p-6 bg-white rounded-lg shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-bold text-blue-600 mb-2">Puntos de Recogida</h2>
          <p className="text-gray-600">
            Encuentra o registra puntos de recogida de ayuda humanitaria.
          </p>
        </a>
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Teléfonos de Emergencia</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="font-semibold">Emergencias</span>
            <span className="text-red-600 font-bold">112</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="font-semibold">Policía Local</span>
            <span className="text-red-600 font-bold">092</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="font-semibold">Personas Desaparecidas</span>
            <span className="text-red-600 font-bold">900 365 112</span>
          </div>
        </div>
      </div>
    </div>
  );
}