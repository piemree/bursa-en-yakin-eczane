import Link from "next/link";

const SUPPORT_URL = "https://kreosus.com/piemree";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center md:flex-row md:justify-between md:text-left">
        <p className="text-sm text-zinc-600">
          Nöbetçi eczane bilgileri resmi eczacı odası kaynaklarından alınır.
          Çıkmadan önce teyit etmeniz önerilir.
        </p>
        <Link
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          <span aria-hidden>☕</span>
          Destek Ol
        </Link>
      </div>
    </footer>
  );
}
