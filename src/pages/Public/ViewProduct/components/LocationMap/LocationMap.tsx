// Real interactive location pin via OpenStreetMap tiles + Nominatim
// geocoding (no API key, global coverage including Sri Lanka). Degrades
// silently to nothing if the location string can't be geocoded - the
// plain-text location line elsewhere on the page still covers that case.
import "leaflet/dist/leaflet.css";
import { Box, Skeleton } from "@mui/material";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { geocodeLocation, type GeocodedPoint } from "../../utils/geocode";

// Leaflet's default marker icon paths break under bundlers (webpack/Vite
// rewrite asset URLs) - this is the standard, required fix, not styling.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationMapProps {
  query: string;
  label: string;
}

const LocationMap = ({ query, label }: LocationMapProps) => {
  // Keyed by the query it was resolved for, so a query change never
  // needs a synchronous setState at the top of the effect body - the
  // "loading" state is derived by comparing `result.query` to the
  // current `query` instead of tracked separately.
  const [result, setResult] = useState<{ query: string; point: GeocodedPoint | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    geocodeLocation(query).then((point) => {
      if (!cancelled) setResult({ query, point });
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const loading = result?.query !== query;
  const point = loading ? null : result?.point ?? null;

  if (loading) {
    return <Skeleton variant="rounded" height={280} sx={{ borderRadius: "12px" }} />;
  }

  if (!point) return null; // couldn't resolve a pin - plain-text location elsewhere already covers this

  return (
    <Box sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
      <MapContainer
        center={[point.lat, point.lng]}
        zoom={14}
        style={{ height: 280, width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[point.lat, point.lng]}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default LocationMap;
