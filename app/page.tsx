import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { EczaneSeoList } from "@/components/EczaneSeoList";
import { MapExplorerClient } from "@/components/MapExplorerClient";
import { DistrictPicker } from "@/components/DistrictPicker";
import { formatTurkishDate } from "@/lib/date";
import { getNobetciEczaneler } from "@/lib/scrape";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bursa-en-yakin-eczane.vercel.app";

export const metadata: Metadata = {
  title: "Bursa Nöbetçi Eczane",
  description:
    "Bursa'da bugün nöbetçi eczaneleri harita ve konumuna göre en yakından başlayarak bul. Resmi Bursa Eczacı Odası verileriyle güncel liste.",
  alternates: {
    canonical: siteUrl,
  },
};

export default async function HomePage() {
  const data = await getNobetciEczaneler();
  const title = `Bursa Nöbetçi Eczane - ${formatTurkishDate()}`;

  return (
    <>
      <JsonLd
        title={title}
        description="Bursa'da bugün nöbetçi eczaneler listesi, harita ve konuma göre en yakın sıralama."
        url={siteUrl}
        eczaneler={data.eczaneler}
        breadcrumbs={[{ name: "Ana Sayfa", url: siteUrl }]}
      />
      <EczaneSeoList eczaneler={data.eczaneler} />

      <section className="space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 md:rounded-3xl md:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 md:text-sm">
            {data.dateLabel}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900 md:mt-2 md:text-4xl">
            Bursa Nöbetçi Eczane
          </h1>
          <p className="mt-2 hidden text-zinc-600 md:block">
            Bugün Bursa&apos;da nöbetçi eczaneleri harita üzerinde gör, konumuna
            göre en yakından başlayarak sırala veya mahalle/ilçe ara.
          </p>

          <div className="mt-4 space-y-3">
            <DistrictPicker />
            <Link
              href="/en-yakin-nobetci-eczane"
              className="inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              En yakın nöbetçi eczaneyi bul
            </Link>
          </div>
        </div>

        <div className="-mx-4 md:mx-0">
          <MapExplorerClient
            eczaneler={data.eczaneler}
            scope={{ type: "all", label: "Bursa" }}
            className="map-explorer--page"
          />
        </div>
      </section>
    </>
  );
}
