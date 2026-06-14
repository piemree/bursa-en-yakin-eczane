"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Coordinates } from "@/lib/geo";
import type { EczaneWithDistance } from "@/lib/types";
import "leaflet/dist/leaflet.css";

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:9999px;background:#2563eb;border:2px solid white;box-shadow:0 0 0 2px #2563eb;"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const pharmacyIcon = L.divIcon({
  className: "",
  html: `<div style="width:12px;height:12px;border-radius:9999px;background:#059669;border:2px solid white;box-shadow:0 0 0 2px #059669;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const selectedIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#dc2626;border:2px solid white;box-shadow:0 0 0 3px rgba(220,38,38,0.35);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function MapBounds({
  eczaneler,
  userLocation,
}: {
  eczaneler: EczaneWithDistance[];
  userLocation?: Coordinates | null;
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = eczaneler.map((eczane) => [
      eczane.lat,
      eczane.lng,
    ]);
    if (userLocation) {
      points.push([userLocation.lat, userLocation.lng]);
    }
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds.pad(0.15));
  }, [eczaneler, map, userLocation]);

  return null;
}

interface EczaneMapProps {
  eczaneler: EczaneWithDistance[];
  userLocation?: Coordinates | null;
  selectedId?: string | null;
  onSelect?: (eczane: EczaneWithDistance) => void;
  className?: string;
}

export function EczaneMap({
  eczaneler,
  userLocation,
  selectedId,
  onSelect,
  className = "h-[360px] w-full rounded-2xl overflow-hidden border border-zinc-200",
}: EczaneMapProps) {
  const center = useMemo<[number, number]>(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (eczaneler[0]) return [eczaneler[0].lat, eczaneler[0].lng];
    return [40.1885, 29.061];
  }, [eczaneler, userLocation]);

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds eczaneler={eczaneler} userLocation={userLocation} />
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>Konumunuz</Popup>
          </Marker>
        )}
        {eczaneler.map((eczane) => (
          <Marker
            key={eczane.id}
            position={[eczane.lat, eczane.lng]}
            icon={selectedId === eczane.id ? selectedIcon : pharmacyIcon}
            eventHandlers={{
              click: () => onSelect?.(eczane),
            }}
          >
            <Popup>
              <div className="space-y-1">
                <strong>{eczane.name}</strong>
                <div>{eczane.address}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
