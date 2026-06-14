"use client";

import { getDirectionsUrl } from "@/lib/geo";
import type { EczaneWithDistance } from "@/lib/types";

interface EczaneCardProps {
  eczane: EczaneWithDistance;
  highlighted?: boolean;
  onSelect?: (eczane: EczaneWithDistance) => void;
  selected?: boolean;
  variant?: "card" | "row";
}

export function EczaneCard({
  eczane,
  highlighted = false,
  onSelect,
  selected = false,
  variant = "card",
}: EczaneCardProps) {
  const primaryPhone = eczane.phones[0]?.replace(/\s+/g, "") ?? "";

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={() => onSelect?.(eczane)}
        className={`eczane-row ${selected ? "eczane-row--selected" : ""} ${highlighted ? "eczane-row--highlighted" : ""}`}
      >
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate font-semibold text-zinc-900">{eczane.name}</p>
          <p className="truncate text-sm text-zinc-500">{eczane.district}</p>
        </div>
        {typeof eczane.distanceMeters === "number" && (
          <span className="shrink-0 text-sm font-semibold text-zinc-700">
            {eczane.distanceMeters < 1000
              ? `${Math.round(eczane.distanceMeters)} m`
              : `${(eczane.distanceMeters / 1000).toFixed(1)} km`}
          </span>
        )}
        <span className="shrink-0 text-zinc-400" aria-hidden>
          ›
        </span>
      </button>
    );
  }

  return (
    <article
      className={`rounded-2xl border p-4 transition-all ${
        highlighted
          ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100"
          : selected
            ? "border-sky-400 bg-sky-50"
            : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
      onClick={() => onSelect?.(eczane)}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">{eczane.name}</h3>
          <p className="text-sm text-zinc-500">
            {eczane.district}
            {eczane.dutyZone !== eczane.district.toUpperCase()
              ? ` · ${eczane.dutyZone}`
              : ""}
          </p>
        </div>
        {typeof eczane.distanceMeters === "number" && (
          <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
            {eczane.distanceMeters < 1000
              ? `${Math.round(eczane.distanceMeters)} m`
              : `${(eczane.distanceMeters / 1000).toFixed(1)} km`}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1 text-sm text-zinc-700">
        <p>{eczane.address}</p>
        {eczane.landmark && (
          <p className="text-zinc-500">({eczane.landmark})</p>
        )}
        {eczane.phones.length > 0 && (
          <p className="font-medium text-emerald-700">{eczane.phones.join(" / ")}</p>
        )}
        <p className="text-xs text-zinc-500">
          Nöbet: {eczane.dutyStart} - {eczane.dutyEnd}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={getDirectionsUrl(eczane.lat, eczane.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          onClick={(event) => event.stopPropagation()}
        >
          Yol Tarifi
        </a>
        {primaryPhone && (
          <a
            href={`tel:${primaryPhone}`}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            onClick={(event) => event.stopPropagation()}
          >
            Ara
          </a>
        )}
        <a
          href={eczane.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          onClick={(event) => event.stopPropagation()}
        >
          Haritada Gör
        </a>
      </div>
    </article>
  );
}
