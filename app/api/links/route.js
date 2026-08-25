import { NextResponse } from "next/server";
import { createLink, listLinks, deleteLink } from "../../../lib/store";

export async function GET() {
  const links = await listLinks();

  return NextResponse.json({ links });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const record = await createLink(body);

    return NextResponse.json({ link: record });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  await deleteLink(slug);

  return NextResponse.json({ ok: true });
}
