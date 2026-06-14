import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const authHeader = request.headers.get("authorization");
  const expected = process.env.REVALIDATE_SECRET;
  const cronSecret = process.env.CRON_SECRET;

  const authorizedBySecret = Boolean(expected && secret === expected);
  const authorizedByCron = Boolean(
    cronSecret && authHeader === `Bearer ${cronSecret}`,
  );

  if (!authorizedBySecret && !authorizedByCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("eczaneler", "max");

  return NextResponse.json({
    revalidated: true,
    tag: "eczaneler",
    at: new Date().toISOString(),
  });
}
