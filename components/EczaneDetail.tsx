"use client";

import { getDirectionsUrl } from "@/lib/geo";
import type { EczaneWithDistance } from "@/lib/types";

interface EczaneDetailProps {
  eczane: EczaneWithDistance;
  onBack?: () => void;
}

export function EczaneDetail({ eczane, onBack }: EczaneDetailProps) {
  const primaryPhone = eczane.phones[0]?.replace(/\s+/g, "") ?? "";

  const handleShare = async () => {
    const text = `${eczane.name}\n${eczane.address}\n${eczane.phones[0] ?? ""}`;
    const url = getDirectionsUrl(eczane.lat, eczane.lng);
    if (navigator.share) {
      try {
        await navigator.share({
          title: eczane.name,
          text,
          url,
        });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
  };

  return (
    <div className="flex h-full flex-col">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-3 flex items-center gap-1 text-sm font-medium text-emerald-700"
        >
          ← Listeye dön
        </button>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto pb-24">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{eczane.name}</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {eczane.district}
              {eczane.dutyZone !== eczane.district.toUpperCase()
                ? ` · ${eczane.dutyZone}`
                : ""}
            </p>
          </div>
          {typeof eczane.distanceMeters === "number" && (
            <span className="shrink-0 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
              {eczane.distanceMeters < 1000
                ? `${Math.round(eczane.distanceMeters)} m`
                : `${(eczane.distanceMeters / 1000).toFixed(1)} km`}
            </span>
          )}
        </div>

        <div className="space-y-2 text-sm text-zinc-700">
          <p>{eczane.address}</p>
          {eczane.landmark && (
            <p className="text-zinc-500">({eczane.landmark})</p>
          )}
          {eczane.phones.length > 0 && (
            <p className="font-semibold text-emerald-700">
              {eczane.phones.join(" / ")}
            </p>
          )}
          <p className="text-xs text-zinc-500">
            Nöbet: {eczane.dutyStart} – {eczane.dutyEnd}
          </p>
        </div>
      </div>

      <div className="detail-action-bar">
        <a
          href={getDirectionsUrl(eczane.lat, eczane.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="detail-action-primary"
        >
          Yol Tarifi
        </a>
        {primaryPhone && (
          <a href={`tel:${primaryPhone}`} className="detail-action-secondary">
            Ara
          </a>
        )}
        <button type="button" onClick={handleShare} className="detail-action-secondary">
          Paylaş
        </button>
      </div>
    </div>
  );
}
