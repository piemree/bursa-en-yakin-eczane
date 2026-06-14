import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EczaneFinder } from "@/components/EczaneFinder";
import { JsonLd } from "@/components/JsonLd";
import { SearchBar } from "@/components/SearchBar";
import { getAllStaticSlugs, resolveScopeFromSlug } from "@/lib/data";
import { formatTurkishDate } from "@/lib/date";
import { filterEczanelerByDistrict, getNobetciEczaneler } from "@/lib/scrape";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bursa-en-yakin-eczane.vercel.app";

export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllStaticSlugs().map((slug) => ({ slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scope = resolveScopeFromSlug(slug);
  if (!scope) {
    return { title: "Sayfa bulunamadı" };
  }

  const dateLabel = formatTurkishDate();
  const title =
    scope.type === "mahalle"
      ? `${scope.label} Nöbetçi Eczane - ${dateLabel}`
      : `${scope.label} Nöbetçi Eczane - ${dateLabel}`;

  const description =
    scope.type === "mahalle"
      ? `${scope.label} (${scope.district}) için bugün nöbetçi eczaneler. Konumuna göre en yakın eczaneyi harita ve yol tarifi ile bul.`
      : `${scope.label} ilçesinde bugün nöbetçi eczaneler. Açık eczane listesi, harita ve en yakın sıralama.`;

  return {
    title,
    description,
    keywords: [
      `${scope.label} nöbetçi eczane`,
      `${scope.label} nöbetçi`,
      "nöbetçi eczane bursa",
      "açık eczane",
      scope.district ?? scope.label,
    ],
    alternates: {
      canonical: `${siteUrl}/${slug}`,
    },
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const scope = resolveScopeFromSlug(slug);
  if (!scope) notFound();

  const data = await getNobetciEczaneler();
  const eczaneler =
    scope.type === "district" && scope.district
      ? filterEczanelerByDistrict(data.eczaneler, scope.district)
      : scope.type === "mahalle" && scope.district
        ? filterEczanelerByDistrict(data.eczaneler, scope.district)
        : data.eczaneler;

  const pageUrl = `${siteUrl}/${slug}`;
  const title = `${scope.label} Nöbetçi Eczane - ${data.dateLabel}`;

  return (
    <>
      <JsonLd
        title={title}
        description={`${scope.label} için bugün nöbetçi eczane listesi.`}
        url={pageUrl}
        eczaneler={eczaneler}
        scope={scope}
        breadcrumbs={[
          { name: "Ana Sayfa", url: siteUrl },
          { name: scope.label, url: pageUrl },
        ]}
      />

      <section className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            {data.dateLabel}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            {scope.label} Nöbetçi Eczane
          </h1>
          {scope.type === "mahalle" && scope.district && (
            <p className="mt-2 text-zinc-600">{scope.district} ilçesi</p>
          )}
          <p className="mt-3 text-zinc-600">
            Bugün {scope.label} bölgesinde nöbetçi {eczaneler.length} eczane
            bulundu. Konumunu açarak en yakınını görebilirsin.
          </p>
          <div className="mt-6">
            <SearchBar />
          </div>
        </div>

        <EczaneFinder eczaneler={eczaneler} scope={scope} showMap />
      </section>
    </>
  );
}
