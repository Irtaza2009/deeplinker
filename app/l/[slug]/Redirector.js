"use client";

import { useEffect, useState } from "react";

export default function Redirector({
  target,
  description,
  iosAppScheme,
  androidIntent,
  serverOS,
}) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const userAgent =
      typeof navigator !== "undefined" ? navigator.userAgent : "";

    const isAndroid = /Android/i.test(userAgent) || serverOS === "Android";

    const isIOS = /iPhone|iPad|iPod/i.test(userAgent) || serverOS === "iOS";

    let cancelled = false;

    if (isAndroid && androidIntent) {
      window.location.href = androidIntent;
    } else if (isIOS) {
      if (iosAppScheme) {
        try {
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = iosAppScheme;
          document.body.appendChild(iframe);
        } catch {}
      }

      const timer = setTimeout(() => {
        if (cancelled) {
          return;
        }

        try {
          window.location.href = `x-safari-${target}`;
        } catch {}
      }, 500);

      return () => clearTimeout(timer);
    } else {
      window.location.href = target;
    }

    return () => {
      cancelled = true;
    };
  }, [target, iosAppScheme, androidIntent, serverOS]);

  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="center-screen">
      <div className="redirect-card">
        <div className="dot" />

        <p className="eyebrow">deeplinker</p>
        <h1 style={{ fontSize: 18 }}>Taking you there…</h1>

        {description && <p className="redirect-description">{description}</p>}

        <p className="sub">
          If nothing happens in a second or two, tap continue below.
        </p>

        {showFallback && (
          <a
            className="btn"
            href={target}
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Continue →
          </a>
        )}
      </div>
    </div>
  );
}
