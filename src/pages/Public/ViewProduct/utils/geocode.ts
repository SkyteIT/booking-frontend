// Client-side geocoding via OpenStreetMap's free Nominatim search API —
// converts a free-text location (city name, venue address) into a
// lat/lng pin. sessionStorage-cached per query string so repeat views
// of the same listing don't re-hit Nominatim (its usage policy caps
// requests at ~1/sec and asks callers to cache).
const CACHE_PREFIX = "geocode:";

export interface GeocodedPoint {
  lat: number;
  lng: number;
}

export async function geocodeLocation(query: string): Promise<GeocodedPoint | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const cacheKey = CACHE_PREFIX + trimmed.toLowerCase();
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return cached === "null" ? null : (JSON.parse(cached) as GeocodedPoint);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (!res.ok) {
      sessionStorage.setItem(cacheKey, "null");
      return null;
    }
    const results = (await res.json()) as { lat: string; lon: string }[];
    if (!results.length) {
      sessionStorage.setItem(cacheKey, "null");
      return null;
    }
    const point: GeocodedPoint = { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
    sessionStorage.setItem(cacheKey, JSON.stringify(point));
    return point;
  } catch {
    return null; // no network / blocked - degrade to no map, not an error page
  }
}
