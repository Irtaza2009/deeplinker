import { redis } from "./redis";

const SLUG_RE = /^[a-z0-9-]{3,40}$/i;

function randomSlug() {
  return Math.random().toString(36).slice(2, 8);
}

export async function createLink({ target, slug, label, description }) {
  if (!target || !/^https?:\/\//i.test(target)) {
    throw new Error(
      "Target must be a full URL starting with http:// or https://",
    );
  }

  let finalSlug = (slug || "").trim().toLowerCase();

  if (finalSlug) {
    if (!SLUG_RE.test(finalSlug)) {
      throw new Error(
        "Slug must be 3-40 characters: letters, numbers, and dashes only.",
      );
    }

    const exists = await redis.get(`link:${finalSlug}`);
    if (exists) throw new Error("That slug is already taken.");
  } else {
    do {
      finalSlug = randomSlug();
    } while (await redis.get(`link:${finalSlug}`));
  }

  const record = {
    slug: finalSlug,
    target,
    label: label || "",
    description: (description || "").trim().slice(0, 120),
    createdAt: Date.now(),
  };

  await redis.set(`link:${finalSlug}`, JSON.stringify(record));
  await redis.sadd("links:index", finalSlug);

  return record;
}

export async function getLink(slug) {
  const raw = await redis.get(`link:${slug}`);
  if (!raw) return null;

  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

export async function listLinks() {
  const slugs = await redis.smembers("links:index");
  if (!slugs?.length) return [];

  const links = await Promise.all(slugs.map((slug) => getLink(slug)));
  const counts = await Promise.all(
    slugs.map((slug) => redis.get(`link:${slug}:count`)),
  );

  return links
    .map((link, index) =>
      link ? { ...link, clicks: Number(counts[index] || 0) } : null,
    )
    .filter(Boolean)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteLink(slug) {
  await redis.srem("links:index", slug);
  await redis.del(`link:${slug}`);
  await redis.del(`link:${slug}:count`);
  await redis.del(`link:${slug}:stats`);
  await redis.del(`link:${slug}:daily`);
  await redis.del(`link:${slug}:events`);
}

export async function logClick(
  slug,
  { os, browser, device, inApp, refDomain },
) {
  const day = new Date().toISOString().slice(0, 10);
  const event = {
    t: Date.now(),
    os,
    browser,
    device,
    inApp: inApp || "",
    ref: refDomain,
  };

  await Promise.all([
    redis.incr(`link:${slug}:count`),
    redis.hincrby(`link:${slug}:stats`, `os:${os}`, 1),
    redis.hincrby(`link:${slug}:stats`, `browser:${browser}`, 1),
    redis.hincrby(`link:${slug}:stats`, `device:${device}`, 1),
    redis.hincrby(`link:${slug}:stats`, `ref:${refDomain}`, 1),
    redis.hincrby(`link:${slug}:daily`, day, 1),
    redis.lpush(`link:${slug}:events`, JSON.stringify(event)),
    redis.ltrim(`link:${slug}:events`, 0, 199),
  ]);
}

export async function getStats(slug) {
  const [statsRaw, dailyRaw, eventsRaw, count] = await Promise.all([
    redis.hgetall(`link:${slug}:stats`),
    redis.hgetall(`link:${slug}:daily`),
    redis.lrange(`link:${slug}:events`, 0, 49),
    redis.get(`link:${slug}:count`),
  ]);

  const breakdown = (prefix) => {
    const output = {};

    for (const key of Object.keys(statsRaw || {})) {
      if (key.startsWith(`${prefix}:`)) {
        output[key.slice(prefix.length + 1)] = Number(statsRaw[key]);
      }
    }

    return output;
  };

  const events = (eventsRaw || []).map((event) =>
    typeof event === "string" ? JSON.parse(event) : event,
  );

  return {
    total: Number(count || 0),
    os: breakdown("os"),
    browser: breakdown("browser"),
    device: breakdown("device"),
    ref: breakdown("ref"),
    daily: dailyRaw || {},
    events,
  };
}
