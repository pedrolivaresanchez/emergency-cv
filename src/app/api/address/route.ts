import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const mapsTranslationToDbTowns: { [key: string]: string } = {
  Aldaya: 'Aldaia',
  'Ribarroja de Turia': 'Riba-roja de Túria',
  Benetuser: 'Benetusser',
  Benetússer: 'Benetusser',
  Benetúser: 'Benetusser',
  Toris: 'Turís',
  Picaña: 'Picanya',
  'La Alcudia': "L'Alcúdia",
  'Lugar Nuevo de la Corona': 'Llocnou de la Corona',
  'Castellón de la Plana': 'Castelló de la Plana',
  Alcudia: "L'Alcúdia",
  Guadasuar: 'Guadassuar',
  València: 'Valencia',
  Almusafes: 'Almussafes',
  Montroi: 'Montroy',
  Masanasa: 'Massanassa',
  Valencia: 'València',
};

const GOOGLE_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GEOCODING_API_KEY}&latlng=`;

export type AddressAndTown = { address: string; town: string };

async function checkAuthentication(): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return false;
  }
  return true;
}

function normalizeData({ address, town }: AddressAndTown): AddressAndTown {
  const normalizedTown = Object.keys(mapsTranslationToDbTowns).includes(town) ? mapsTranslationToDbTowns[town] : town;
  const normalizedAddress = address.replace(town, normalizedTown);
  return { address: normalizedAddress, town: normalizedTown };
}

function extractAddressAndTown(googleResponse: any) {
  // for response refer to documentation: https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding
  // it returns many due to inaccuracies but they only differ from street number(normally) - we look for a good result - contains sublocality
  let town = '';
  let address = '';
  for (const result of googleResponse['results']) {
    for (const addressComponent of result['address_components']) {
      let localityFound = false;

      // max three, not really a performance issue
      for (const type of addressComponent['types']) {
        if (type === 'locality') {
          localityFound = true;
          town = addressComponent['long_name'];
          break;
        }
      }

      if (localityFound) {
        address = result['formatted_address'];

        return normalizeData({ address, town });
      }
    }
  }

  return { address, town };
}

export async function POST(request: NextRequest, response: any) {
  // will return Response object on error
  if (!(await checkAuthentication())) {
    return Response.json({ error: 'Unauthenticated: User must be logged in' }, { status: 401 });
  }

  const body = await request.json();
  if (!body.latitude || !body.longitude) {
    return Response.json({ error: 'Latitude and longitude are mandatory fields!' }, { status: 401 });
  }

  try {
    const response = await fetch(`${GOOGLE_URL}${body.latitude},${body.longitude}`).then((value) => value.json());

    if (response.error_message) {
      return Response.json({ error: `Error de google: ${response.error_message}` }, { status: 502 });
    }

    const extractedData = extractAddressAndTown(response);

    return Response.json(extractedData);
  } catch (exception) {
    console.error(exception);
    return Response.json({ error: 'An error occured calling google - check logs' }, { status: 500 });
  }
}
