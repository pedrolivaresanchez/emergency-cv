'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { TownSummary } from '@/types/Town';

type PuebloInfo = {
  townSummary: TownSummary;
  route: string;
};

export default function TownCardInfo({ townSummary, route }: PuebloInfo) {
  const router = useRouter();
  return (
    <div key={townSummary.town_id} className="bg-white rounded-lg flex flex-col justify-between shadow-lg p-6">
      <div className="flex justify-between flex-col items-start gap-1 mb-4">
        <h2 className="text-xl font-bold mb-1">{townSummary.town_name}</h2>
        <div className="flex flex-col xl:flex-row items-start xl:items-center">
          <div>
            <span className="text-black font-bold">{townSummary.offers_last_24h}</span>
            <span className="text-gray-500 ml-1">voluntarios</span>
          </div>
          <span className="text-semibold px-2 hidden xl:block">|</span>
          <div>
            <span className="text-black font-bold">{townSummary.needs_last_24h}</span>
            <span className="text-gray-500 ml-1">solicitudes de ayuda</span>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row items-start xl:items-center">
          <div>
            <span className="text-black font-bold">{townSummary.unassigned_needs}</span>
            <span className="text-gray-500 ml-1">solicitudes sin atender</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          router.push(route + townSummary.town_id);
        }}
        className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
      >
        Ayudar a alguien aquí
      </button>
    </div>
  );
}
