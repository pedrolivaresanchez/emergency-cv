import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Solicitud() {
  return (
    <div className="space-y-6 mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex justify-start">
        <Link
          className="flex flex-row items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          href="/casos-activos/solicitudes"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Link>
      </div>
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">No se encontró la solicitud.</p>
      </div>
    </div>
  );
}
