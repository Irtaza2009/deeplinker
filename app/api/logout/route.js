import { NextResponse } from "next/server";
import { COOKIE_NAME } from "../../../lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
