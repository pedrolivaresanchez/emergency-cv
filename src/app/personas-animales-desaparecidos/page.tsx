// personas-animales-desaparecidos/page.tsx

import { Users, PawPrint, Car, UserSearch, Map } from 'lucide-react';

export default function PersonasAnimalesDesaparecidos() {
  return (
    <div className="mx-auto p-4 max-w-4xl">
      {/* Encabezado con fondo de color e icono */}
      <div className="flex items-center justify-between bg-purple-100 p-6 rounded-t-lg shadow">
        <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
          <UserSearch className="h-8 w-8 text-purple-500" />
          Personas, Animales y Vehículos Desaparecidos
        </h1>
      </div>

      {/* Tarjeta grande para información */}
      <div className="bg-white p-8 rounded-b-lg shadow mb-8">
        <p className="text-gray-700 text-lg">
          En esta página puedes acceder a diferentes herramientas externas para encontrar personas, animales y vehículos
          desaparecidos. Selecciona la opción que necesitas para más información y para reportar un caso o buscar ayuda.
        </p>
      </div>

      {/* Tres columnas de botones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Botón para Personas Desaparecidas */}
        <a
          href="https://www.google.com/maps/d/edit?mid=1WbP4DX7LKE4s_b7DqURdeDRu9GFi51c&usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center bg-white border-l-4 border-blue-500 p-6 rounded-lg shadow hover:shadow-md transition-transform transform hover:-translate-y-1"
        >
          <Users className="h-10 w-10 text-blue-500 mb-2" />
          <h2 className="text-lg font-bold text-blue-600 text-center">Personas Desaparecidas</h2>
        </a>

        {/* Botón para Animales Desaparecidos */}
        <a
          href="https://gorogoro.es/dana"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center bg-white border-l-4 border-green-500 p-6 rounded-lg shadow hover:shadow-md transition-transform transform hover:-translate-y-1"
        >
          <PawPrint className="h-10 w-10 text-green-500 mb-2" />
          <h2 className="text-lg font-bold text-green-600 text-center">Animales Desaparecidos</h2>
        </a>

        {/* Botón para Vehículos Extraviados */}
        <a
          href="https://tucochedana.es/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center bg-white border-l-4 border-purple-500 p-6 rounded-lg shadow hover:shadow-md transition-transform transform hover:-translate-y-1"
        >
          <Car className="h-10 w-10 text-purple-500 mb-2" />
          <h2 className="text-lg font-bold text-purple-600 text-center">Vehículos Extraviados</h2>
        </a>

        {/* Botón para Mapa Desaparecidos */}
        <a
          href="https://www.google.com/maps/d/u/0/viewer?mid=1WbP4DX7LKE4s_b7DqURdeDRu9GFi51c&ll=39.48755099221443%2C-0.3798128440213966&z=12"
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-1 md:col-start-2 flex flex-col items-center justify-center bg-white border-l-4 border-amber-500 p-6 rounded-lg shadow hover:shadow-md transition-transform transform hover:-translate-y-1"
        >
          <Map className="h-10 w-10 text-amber-500 mb-2" />
          <h2 className="text-lg font-bold text-amber-600 text-center">Mapa Desaparecidos</h2>
        </a>
      </div>
    </div>
  );
}
