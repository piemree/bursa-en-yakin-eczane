import { NextResponse } from "next/server";
import { getNobetciEczaneler } from "@/lib/scrape";

export async function GET() {
  try {
    const data = await getNobetciEczaneler();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Nöbetçi eczane verisi alınamadı.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
