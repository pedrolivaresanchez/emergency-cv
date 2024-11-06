import { NextRequest } from 'next/server';

const GOOGLE_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.API_KEY}&latlng=`;

const extractAddressAndTown = (googleResponse: any) => {
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
        return { address, town };
      }
    }
  }

  return { address, town };
};

// we should protect this with only authenticated users!
export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.latitude || !body.longitude) {
    return Response.json({
      error: 'Latitude and longitude are mandatory fields!',
    });
  }

  try {
    const response = await fetch(`${GOOGLE_URL}${body.latitude},${body.longitude}`);
    const extractedData = extractAddressAndTown(await response.json());
    return Response.json(extractedData);
  } catch (exception) {
    console.error(exception);
    return Response.json({
      error: 'An error occured calling google - check logs',
    });
  }
}
