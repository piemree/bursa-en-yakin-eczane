"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getSearchItems } from "@/lib/data";
import { normalizeText } from "@/lib/slug";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const items = useMemo(() => getSearchItems(), []);

  const results = useMemo(() => {
    const normalized = normalizeText(query);
    if (!normalized) return [];

    return items
      .map((item) => {
        const haystack = normalizeText(
          [item.label, item.subtitle, ...item.keywords].join(" "),
        );
        const score = haystack.includes(normalized)
          ? normalized.length / haystack.length
          : 0;
        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((entry) => entry.item);
  }, [items, query]);

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="search">
        Mahalle veya ilçe ara
      </label>
      <input
        id="search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder='Örn: "beşevler nöbetçi eczane"'
        className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-base shadow-sm outline-none ring-emerald-500 placeholder:text-zinc-400 focus:ring-2"
      />

      {open && query && results.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
          {results.map((result) => (
            <Link
              key={result.href}
              href={result.href}
              className="block border-b border-zinc-100 px-4 py-3 hover:bg-zinc-50 last:border-b-0"
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
            >
              <div className="font-medium text-zinc-900">
                {result.label} Nöbetçi Eczane
              </div>
              <div className="text-sm text-zinc-500">{result.subtitle}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
