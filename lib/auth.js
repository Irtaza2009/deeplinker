const COOKIE_NAME = "dl_session";

async function sign() {
  const secret = process.env.SESSION_SECRET || "insecure-dev-secret";

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode("authenticated"),
  );

  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function validSessionValue() {
  return sign();
}

export async function isValidSession(cookieValue) {
  if (!cookieValue) return false;

  const expected = await sign();
  return cookieValue === expected;
}

export { COOKIE_NAME };
