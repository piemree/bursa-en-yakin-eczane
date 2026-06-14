import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bursa Nöbetçi Eczane",
    short_name: "Nöbetçi Eczane",
    description:
      "Bursa'da en yakın nöbetçi eczaneyi harita ve konum ile bul.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#059669",
    lang: "tr",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
