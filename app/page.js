"use client";

import { useState } from "react";

export default function Home() {
  const [target, setTarget] = useState("");
  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const siteUrl =
    (typeof window !== "undefined" && window.location.origin) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, slug, label, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.link);
      setTarget("");
      setSlug("");
      setLabel("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(`${siteUrl}/l/${result.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="wrap">
      <div className="top-nav">
        <div className="brand">
          deep<span>linker</span>
        </div>

        <nav>
          <a href="/dashboard">Dashboard</a>
        </nav>
      </div>

      <p className="eyebrow">New link</p>
      <h1>Make a link that escapes the in-app browser</h1>

      <p className="sub">
        Drop the destination URL below. You&apos;ll get back a short link to put
        in your Instagram bio — it detects the visitor&apos;s OS and does its
        best to hand them off to their real browser or the native app instead of
        Instagram&apos;s built-in webview.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="target">Destination URL</label>
            <input
              id="target"
              type="url"
              placeholder="https://yourshop.com/new-drop"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="slug">Custom slug (optional)</label>

            <div className="prefix-field">
              <span>{siteUrl.replace(/^https?:\/\//, "")}/l/</span>
              <input
                id="slug"
                type="text"
                placeholder="auto-generated if left blank"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
            </div>

            <p className="hint">
              Letters, numbers and dashes, 3–40 characters.
            </p>
          </div>

          <div className="field">
            <label htmlFor="label">
              Label (optional, for your dashboard only)
            </label>
            <input
              id="label"
              type="text"
              placeholder="e.g. bio link — merch drop"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="description">
              Visitor-facing description (optional)
            </label>
            <input
              id="description"
              type="text"
              placeholder="e.g. Check out our new merch drop"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={120}
            />
            <p className="hint">
              Shown on the page before visitors continue to your link.
            </p>
          </div>

          <button className="btn btn-block" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Generate link"}
          </button>

          {error && <div className="error">{error}</div>}

          {result && (
            <div className="result">
              <div className="row">
                <span className="url">
                  {siteUrl}/l/{result.slug}
                </span>

                <button type="button" className="btn btn-ghost" onClick={copy}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <p className="section-title">How it works</p>

      <p className="sub" style={{ marginBottom: 0 }}>
        On Android, the link uses an <code>intent://</code> URL, which
        Instagram&apos;s in-app webview generally hands off to Chrome or the
        matching app. On iOS, Apple and Meta are locked in a constant
        back-and-forth, so it tries the native app&apos;s URL scheme first, then
        a Safari-escape trick, and always falls back to a visible
        &quot;Continue&quot; button so nobody gets stuck. Every open is logged
        to your dashboard.
      </p>

      <footer className="foot">
        self-hosted · your data stays in your own database · made with love by{" "}
        <a href="https://irtaza.xyz" target="_blank" rel="noreferrer">
          Irtaza
        </a>
      </footer>
    </div>
  );
}
