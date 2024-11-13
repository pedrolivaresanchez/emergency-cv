'use client';

export const locationService = {
  async getFormattedAddress(longitude: string, latitude: string) {
    return await fetch('/api/address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        longitude,
        latitude,
      }),
    }).then((res) => res.json());
  },
};
