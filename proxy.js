import { NextResponse } from "next/server";
import { isValidSession, COOKIE_NAME } from "./lib/auth";

// The dashboard, link generator, and private APIs require a password.
// Public /l/* redirect links and the login flow remain accessible.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(COOKIE_NAME)?.value;

  if (await isValidSession(cookie)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!l/|login|api/login|_next|favicon.ico).*)"],
};
