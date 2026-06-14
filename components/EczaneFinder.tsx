"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { EczaneCard } from "@/components/EczaneCard";
import { haversine } from "@/lib/geo";
import type {
  Eczane,
  EczaneWithDistance,
  GeolocationStatus,
  Scope,
} from "@/lib/types";

const EczaneMap = dynamic(
  () => import("@/components/EczaneMap").then((mod) => mod.EczaneMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500">
        Harita yükleniyor...
      </div>
    ),
  },
);

interface EczaneFinderProps {
  eczaneler: Eczane[];
  scope?: Scope;
  showMap?: boolean;
  highlightNearest?: boolean;
}

export function EczaneFinder({
  eczaneler,
  scope,
  showMap = true,
  highlightNearest = false,
}: EczaneFinderProps) {
  const [geoStatus, setGeoStatus] = useState<GeolocationStatus>("idle");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("unavailable");
      return;
    }

    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoStatus("granted");
      },
      () => {
        setGeoStatus("denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60_000,
      },
    );
  }, []);

  const scopedEczaneler = useMemo(() => {
    if (!scope || scope.type === "all") return eczaneler;
    if (scope.type === "district" && scope.district) {
      const district = scope.district.toLowerCase();
      return eczaneler.filter(
        (eczane) =>
          eczane.district.toLowerCase() === district ||
          eczane.dutyZone.toLowerCase().includes(district),
      );
    }
    if (scope.type === "mahalle" && scope.district) {
      const district = scope.district.toLowerCase();
      return eczaneler.filter(
        (eczane) =>
          eczane.district.toLowerCase() === district ||
          eczane.dutyZone.toLowerCase().includes(district),
      );
    }
    return eczaneler;
  }, [eczaneler, scope]);

  const sortedEczaneler: EczaneWithDistance[] = useMemo(() => {
    if (!userLocation) return scopedEczaneler;
    return [...scopedEczaneler]
      .map((eczane) => ({
        ...eczane,
        distanceMeters: haversine(userLocation, {
          lat: eczane.lat,
          lng: eczane.lng,
        }),
      }))
      .sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
  }, [scopedEczaneler, userLocation]);

  const nearest = sortedEczaneler[0] ?? null;
  const activeSelectedId =
    selectedId ?? (highlightNearest ? (nearest?.id ?? null) : null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {geoStatus !== "granted" && (
          <button
            type="button"
            onClick={requestLocation}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            {geoStatus === "requesting"
              ? "Konum alınıyor..."
              : "Konumuma göre sırala"}
          </button>
        )}
        {geoStatus === "granted" && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            Konumuna göre sıralandı
          </span>
        )}
        {geoStatus === "denied" && (
          <span className="text-sm text-amber-700">
            Konum izni verilmedi. Liste varsayılan sırayla gösteriliyor.
          </span>
        )}
      </div>

      {showMap && sortedEczaneler.length > 0 && (
        <EczaneMap
          eczaneler={sortedEczaneler}
          userLocation={userLocation}
          selectedId={activeSelectedId}
          onSelect={(eczane) => setSelectedId(eczane.id)}
        />
      )}

      <div className="grid gap-4">
        {sortedEczaneler.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-600">
            Bu bölge için bugün nöbetçi eczane bulunamadı.
          </div>
        ) : (
          sortedEczaneler.map((eczane, index) => (
            <EczaneCard
              key={eczane.id}
              eczane={eczane}
              highlighted={highlightNearest && index === 0}
              selected={activeSelectedId === eczane.id}
              onSelect={(item) => setSelectedId(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}