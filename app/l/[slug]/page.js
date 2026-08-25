import { headers } from "next/headers";
import { getLink, logClick } from "../../../lib/store";
import { parseUA, refDomain } from "../../../lib/ua";
import { buildRedirectPlan } from "../../../lib/buildRedirect";
import Redirector from "./Redirector";

export const dynamic = "force-dynamic";

export default async function RedirectPage({ params }) {
  const { slug } = await params;
  const link = await getLink(slug);

  if (!link) {
    return (
      <div className="center-screen">
        <div className="redirect-card">
          <p className="eyebrow">deeplinker</p>
          <h1 style={{ fontSize: 20 }}>This link doesn&apos;t exist</h1>
          <p className="sub">
            It may have been deleted, or the slug is mistyped.
          </p>
        </div>
      </div>
    );
  }

  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") || "";
  const referrer = requestHeaders.get("referer") || "";
  const parsed = parseUA(userAgent);

  // Server-side logging means clicks are counted even if client JS fails.
  await logClick(slug, {
    os: parsed.os,
    browser: parsed.browser,
    device: parsed.device,
    inApp: parsed.inApp,
    refDomain: refDomain(referrer),
  });

  const plan = buildRedirectPlan(link.target);

  return (
    <Redirector
      target={plan.target}
      description={link.description}
      iosAppScheme={plan.iosAppScheme}
      androidIntent={plan.androidIntent}
      serverOS={parsed.os}
    />
  );
}
