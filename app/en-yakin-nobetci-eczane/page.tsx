import type { Metadata } from "next";
import { EnYakinView } from "@/components/EnYakinView";
import { EczaneSeoList } from "@/components/EczaneSeoList";
import { JsonLd } from "@/components/JsonLd";
import { getNobetciEczaneler } from "@/lib/scrape";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bursa-en-yakin-eczane.vercel.app";

export const metadata: Metadata = {
  title: "En Yakın Nöbetçi Eczane - Bursa | Konumuna Göre",
  description:
    "Bursa'da sana en yakın nöbetçi eczaneyi bul. Konumunu paylaş, en yakın açık eczaneyi harita ve yol tarifi ile gör.",
  keywords: [
    "en yakın nöbetçi eczane",
    "bana en yakın nöbetçi eczane",
    "yakınımdaki nöbetçi eczane",
    "bursa açık eczane",
  ],
  alternates: {
    canonical: `${siteUrl}/en-yakin-nobetci-eczane`,
  },
};

export default async function EnYakinPage() {
  const data = await getNobetciEczaneler();
  const pageUrl = `${siteUrl}/en-yakin-nobetci-eczane`;

  return (
    <>
      <JsonLd
        title="En Yakın Nöbetçi Eczane - Bursa"
        description="Konumuna göre Bursa'daki en yakın nöbetçi eczaneyi bul."
        url={pageUrl}
        eczaneler={data.eczaneler}
        breadcrumbs={[
          { name: "Ana Sayfa", url: siteUrl },
          { name: "En Yakın Nöbetçi Eczane", url: pageUrl },
        ]}
      />
      <EczaneSeoList eczaneler={data.eczaneler} />
      <EnYakinView eczaneler={data.eczaneler} />
    </>
  );
}
