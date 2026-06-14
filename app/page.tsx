import type { Metadata } from "next";
import Link from "next/link";
import { EczaneFinder } from "@/components/EczaneFinder";
import { JsonLd } from "@/components/JsonLd";
import { SearchBar } from "@/components/SearchBar";
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

      <section className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            {data.dateLabel}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900 sm:text-4xl">
            Bursa Nöbetçi Eczane
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-600">
            Bugün Bursa&apos;da nöbetçi eczaneleri harita üzerinde gör, konumuna
            göre en yakından başlayarak sırala veya mahalle/ilçe ara.
          </p>

          <div className="mt-6 space-y-4">
            <SearchBar />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/en-yakin-nobetci-eczane"
                className="inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                En yakın nöbetçi eczaneyi bul
              </Link>
            </div>
          </div>
        </div>

        <EczaneFinder
          eczaneler={data.eczaneler}
          scope={{ type: "all", label: "Bursa" }}
          showMap
        />
      </section>
    </>
  );
}
