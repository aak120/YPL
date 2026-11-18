import { NextResponse } from "next/server";
import { searchSite } from "@/lib/search";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.slice(0, 120) ?? "";
  const results = await searchSite(q, 20);
  return NextResponse.json({ results }, { headers: { "Cache-Control": "public, max-age=60" } });
}
