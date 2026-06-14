"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const MapExplorer = dynamic(
  () => import("@/components/MapExplorer").then((mod) => mod.MapExplorer),
  {
    ssr: false,
    loading: () => (
      <div className="map-explorer map-explorer--page flex items-center justify-center bg-zinc-100 text-sm text-zinc-500">
        Harita yükleniyor...
      </div>
    ),
  },
);

export function MapExplorerClient(props: ComponentProps<typeof MapExplorer>) {
  return <MapExplorer {...props} />;
}
