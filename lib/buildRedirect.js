import { findAppScheme } from "./appSchemes";

// Builds serializable redirect data for the public server page.
export function buildRedirectPlan(targetUrl) {
  const scheme = findAppScheme(targetUrl);
  let androidIntent = null;

  try {
    const url = new URL(targetUrl);
    const host = url.host;
    const path = url.pathname + url.search;
    const fallback = encodeURIComponent(targetUrl);

    const packagePart = scheme?.androidPackage
      ? `package=${scheme.androidPackage};`
      : "";

    androidIntent = `intent://${host}${path}#Intent;scheme=${url.protocol.replace(
      ":",
      "",
    )};${packagePart}S.browser_fallback_url=${fallback};end`;
  } catch {
    androidIntent = null;
  }

  return {
    target: targetUrl,
    iosAppScheme: scheme?.ios || null,
    androidIntent,
  };
}
