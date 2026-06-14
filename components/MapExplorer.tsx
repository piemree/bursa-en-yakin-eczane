"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { EczaneCard } from "@/components/EczaneCard";
import { EczaneDetail } from "@/components/EczaneDetail";
import type { EczaneMapHandle } from "@/components/EczaneMap";
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
      <div className="flex h-full items-center justify-center bg-zinc-100 text-sm text-zinc-500">
        Harita yükleniyor...
      </div>
    ),
  },
);

type PanelMode = "list" | "detail";

interface MapExplorerProps {
  eczaneler: Eczane[];
  scope?: Scope;
  autoLocate?: boolean;
  highlightNearest?: boolean;
  className?: string;
}

export function MapExplorer({
  eczaneler,
  scope,
  autoLocate = false,
  highlightNearest = false,
  className = "",
}: MapExplorerProps) {
  const mapRef = useRef<EczaneMapHandle>(null);
  const [geoStatus, setGeoStatus] = useState<GeolocationStatus>("idle");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("list");
  const [focusUserTrigger, setFocusUserTrigger] = useState(0);

  const requestLocation = useCallback((andFocus = false) => {
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
        setLocationAccuracy(position.coords.accuracy ?? null);
        setGeoStatus("granted");
        if (andFocus) setFocusUserTrigger((n) => n + 1);
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 },
    );
  }, []);

  useEffect(() => {
    if (!autoLocate) return;
    if (!navigator.geolocation) {
      const timer = window.setTimeout(() => setGeoStatus("unavailable"), 0);
      return () => window.clearTimeout(timer);
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationAccuracy(position.coords.accuracy ?? null);
        setGeoStatus("granted");
        setFocusUserTrigger((n) => n + 1);
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 },
    );
  }, [autoLocate]);

  const scopedEczaneler = useMemo(() => {
    if (!scope || scope.type === "all") return eczaneler;
    if (scope.district) {
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
  const selectedEczane =
    sortedEczaneler.find((e) => e.id === activeSelectedId) ?? null;

  const selectEczane = useCallback((eczane: EczaneWithDistance) => {
    setSelectedId(eczane.id);
    setPanelMode("detail");
  }, []);

  const handleLocate = () => {
    if (geoStatus === "granted" && userLocation) {
      setFocusUserTrigger((n) => n + 1);
      return;
    }
    requestLocation(true);
  };

  const listContent =
    sortedEczaneler.length === 0 ? (
      <p className="p-4 text-center text-sm text-zinc-600">
        Bu bölge için bugün nöbetçi eczane bulunamadı.
      </p>
    ) : (
      <div className="divide-y divide-zinc-100">
        {sortedEczaneler.map((eczane, index) => (
          <EczaneCard
            key={eczane.id}
            eczane={eczane}
            variant="row"
            highlighted={highlightNearest && index === 0}
            selected={activeSelectedId === eczane.id}
            onSelect={selectEczane}
          />
        ))}
      </div>
    );

  const listHeader = (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
      <h2 className="text-base font-bold text-zinc-900">Nöbetçi Eczaneler</h2>
      {geoStatus !== "granted" ? (
        <button
          type="button"
          onClick={() => requestLocation()}
          className="text-sm font-medium text-emerald-700"
        >
          Konuma göre sırala
        </button>
      ) : (
        <span className="text-xs text-emerald-700">Konuma göre sıralı</span>
      )}
    </div>
  );

  return (
    <div className={`map-explorer ${className}`}>
      <div className="map-explorer-map">
        <EczaneMap
          ref={mapRef}
          eczaneler={sortedEczaneler}
          userLocation={userLocation}
          locationAccuracy={locationAccuracy}
          selectedId={activeSelectedId}
          onSelect={selectEczane}
          focusUserTrigger={focusUserTrigger}
          className="h-full w-full"
        />

        <div className="map-overlay-controls">
          <button
            type="button"
            onClick={handleLocate}
            className="map-control-btn"
            aria-label="Konumuma odaklan"
          >
            {geoStatus === "requesting" ? "…" : "◎"}
          </button>
          <span className="map-count-badge">
            {sortedEczaneler.length} eczane
          </span>
        </div>
      </div>

      {/* Mobile list below map */}
      <section className="map-explorer-mobile-list md:hidden">
        {listHeader}
        {listContent}
      </section>

      {/* Desktop side panel */}
      <aside className="map-explorer-panel hidden md:flex md:flex-col">
        <div className="border-b border-zinc-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-zinc-900">Nöbetçi Eczaneler</h2>
            <button
              type="button"
              onClick={handleLocate}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              {geoStatus === "requesting"
                ? "Konum alınıyor..."
                : "Konumuma odaklan"}
            </button>
          </div>
          {geoStatus === "denied" && (
            <p className="mt-2 text-xs text-amber-700">
              Konum izni verilmedi.
            </p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {panelMode === "detail" && selectedEczane ? (
            <div className="p-4">
              <EczaneDetail
                eczane={selectedEczane}
                onBack={() => setPanelMode("list")}
              />
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">{listContent}</div>
          )}
        </div>
      </aside>
    </div>
  );
}
