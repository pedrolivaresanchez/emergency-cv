import React, { useEffect, useState } from 'react';
import SolicitudCard from './SolicitudCard';

interface SolicitudCardMapProps {
  id: {
    caso: string;
  };
}

export default function SolicitudCardMap({ id }: SolicitudCardMapProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [caso, setCaso] = useState<any>(null);

  useEffect(() => {
    async function getRequest() {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/solicitudes/${id}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.log(`Error fetching solicitudes: ${response.status}`);
          setError('Error fetching data');
          return;
        }

        const { data } = await response.json();
        console.log(data);
        setCaso(data[0]);
        setLoading(false);
      } catch (err) {
        console.log('Error general:', err);
        setError('Error: ' + err);
      }
    }
    getRequest();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return <SolicitudCard showLink={true} showEdit={false} caso={caso} />;
}
