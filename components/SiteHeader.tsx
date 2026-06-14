import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-bold text-zinc-900">
          Bursa Nöbetçi Eczane
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link href="/" className="text-zinc-600 hover:text-zinc-900">
            Tüm Liste
          </Link>
          <Link
            href="/en-yakin-nobetci-eczane"
            className="rounded-full bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            En Yakınım
          </Link>
        </nav>
      </div>
    </header>
  );
}
