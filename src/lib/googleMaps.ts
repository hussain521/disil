import { useLoadScript, type Libraries } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'geometry'];

/**
 * Loads the Google Maps JS SDK once and reports readiness, for use by any
 * screen rendering a `<GoogleMap>` from `@react-google-maps/api`.
 */
export function useGoogleMapsLoader() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  return { isLoaded, loadError, apiKey: GOOGLE_MAPS_API_KEY };
}
