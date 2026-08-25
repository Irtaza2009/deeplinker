import { NextResponse } from "next/server";
import { getLink, getStats } from "../../../../lib/store";

export async function GET(request, { params }) {
  const { slug } = await params;
  const link = await getLink(slug);

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stats = await getStats(slug);

  return NextResponse.json({ link, stats });
}
